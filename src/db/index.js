const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool = null;
let useInMemory = false;

// File persistence path for zero-setup mode (so server restarts don't lose sessions!)
const DEV_STORE_PATH = path.join(__dirname, '../data/dev_store.json');

function loadDevStore() {
  try {
    if (fs.existsSync(DEV_STORE_PATH)) {
      const content = fs.readFileSync(DEV_STORE_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.warn('[DB] Could not load dev_store.json, creating new store:', e.message);
  }
  return {
    participants: [],
    quizSessions: [],
    quizAnswers: [],
    nextParticipantId: 1,
    nextAnswerId: 1
  };
}

const memStore = loadDevStore();

function saveDevStore() {
  if (useInMemory) {
    try {
      fs.mkdirSync(path.dirname(DEV_STORE_PATH), { recursive: true });
      fs.writeFileSync(DEV_STORE_PATH, JSON.stringify(memStore, null, 2), 'utf8');
    } catch (e) {
      console.warn('[DB] Could not save dev_store.json:', e.message);
    }
  }
}

if (process.env.DATABASE_URL || process.env.PGHOST) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'kuis_stis',
    max: parseInt(process.env.PG_POOL_SIZE || '10', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
  });
} else {
  useInMemory = true;
  console.log('[DB] Running in Persistent Local File Mode (Zero-setup local mode). Set PGHOST/DATABASE_URL to use PostgreSQL.');
}

async function query(text, params) {
  if (pool && !useInMemory) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.warn('[DB] PostgreSQL query failed, using persistent local store:', err.message);
      useInMemory = true;
    }
  }

  const result = executeInMemory(text, params);
  saveDevStore();
  return result;
}

function executeInMemory(text, params = []) {
  const sql = text.trim();

  // INSERT INTO participants
  if (sql.startsWith('INSERT INTO participants')) {
    const id = memStore.nextParticipantId++;
    const [nama, nama_clean, sekolah, sekolah_clean, wa] = params;
    const record = { id, nama, nama_clean, sekolah, sekolah_clean, wa, created_at: new Date().toISOString() };
    memStore.participants.push(record);
    return { rows: [record] };
  }

  // SELECT participant by id
  if (sql.includes('FROM participants') && sql.includes('WHERE id = $1')) {
    const p = memStore.participants.find(item => item.id === parseInt(params[0], 10));
    return { rows: p ? [p] : [] };
  }

  // SELECT participant completed categories
  if (sql.includes('WHERE s.participant_id = $1 AND s.finished_at IS NOT NULL')) {
    const partId = parseInt(params[0], 10);
    const sessions = memStore.quizSessions
      .filter(s => s.participant_id === partId && s.finished_at !== null)
      .map(s => ({
        kategori_kode: s.kategori_kode,
        total_score: s.total_score,
        finished_at: s.finished_at
      }));
    return { rows: sessions };
  }

  // INSERT INTO quiz_sessions
  if (sql.startsWith('INSERT INTO quiz_sessions')) {
    const [id, participant_id, kategori_kode, question_ids] = params;
    const record = {
      id,
      participant_id,
      kategori_kode,
      question_ids,
      total_score: 0,
      total_time_ms: 0,
      correct_count: 0,
      badge_title: null,
      started_at: new Date().toISOString(),
      finished_at: null
    };
    memStore.quizSessions.push(record);
    return { rows: [record] };
  }

  // UPDATE quiz_sessions FINISH
  if (sql.includes('UPDATE quiz_sessions') && sql.includes('finished_at')) {
    const [total_score, total_time_ms, correct_count, badge_title, id] = params;
    const session = memStore.quizSessions.find(s => s.id === id);
    if (session) {
      session.total_score = total_score;
      session.total_time_ms = total_time_ms;
      session.correct_count = correct_count;
      session.badge_title = badge_title;
      session.finished_at = new Date().toISOString();
      return { rows: [session] };
    }
    return { rows: [] };
  }

  // INSERT INTO quiz_answers
  if (sql.startsWith('INSERT INTO quiz_answers')) {
    const [session_id, question_id, chosen_option, is_correct, time_spent_ms, score_awarded] = params;
    const record = {
      id: memStore.nextAnswerId++,
      session_id,
      question_id,
      chosen_option,
      is_correct,
      time_spent_ms,
      score_awarded,
      created_at: new Date().toISOString()
    };
    memStore.quizAnswers.push(record);
    return { rows: [record] };
  }

  // SELECT session by ID
  if (sql.includes('FROM quiz_sessions') && (sql.includes('WHERE s.id = $1') || sql.includes('WHERE id = $1'))) {
    const id = params[0];
    const session = memStore.quizSessions.find(s => s.id === id);
    if (!session) return { rows: [] };
    const p = memStore.participants.find(part => part.id === session.participant_id) || {};
    return {
      rows: [{
        ...session,
        nama_clean: p.nama_clean || 'Peserta',
        sekolah_clean: p.sekolah_clean || 'Sekolah Lainnya'
      }]
    };
  }

  // LEADERBOARD: SPECIFIC CATEGORY
  if (sql.includes('WHERE s.finished_at IS NOT NULL AND s.kategori_kode = $1')) {
    const cat = params[0];
    const rows = memStore.quizSessions
      .filter(s => s.finished_at !== null && s.kategori_kode === cat)
      .map(s => {
        const p = memStore.participants.find(part => part.id === s.participant_id) || {};
        return {
          session_id: s.id,
          nama: p.nama_clean || 'Peserta',
          sekolah: p.sekolah_clean || 'Sekolah Lainnya',
          kategori_kode: s.kategori_kode,
          total_score: s.total_score,
          total_time_ms: s.total_time_ms,
          correct_count: s.correct_count,
          badge_title: s.badge_title
        };
      })
      .sort((a, b) => b.total_score - a.total_score || a.total_time_ms - b.total_time_ms)
      .slice(0, 10);
    return { rows };
  }

  // LEADERBOARD: GRAND LEADERBOARD (AKUMULASI SEMUA KATEGORI PER PESERTA)
  if (sql.includes('SUM(s.total_score) as total_score') && sql.includes('GROUP BY p.id')) {
    const participantAgg = {};
    for (const s of memStore.quizSessions.filter(item => item.finished_at !== null)) {
      const p = memStore.participants.find(part => part.id === s.participant_id);
      if (!p) continue;
      if (!participantAgg[p.id]) {
        participantAgg[p.id] = {
          session_id: s.id,
          nama: p.nama_clean,
          sekolah: p.sekolah_clean,
          total_score: 0,
          total_time_ms: 0,
          correct_count: 0,
          categories_finished: 0,
          badge_title: 'Grand Master'
        };
      }
      participantAgg[p.id].total_score += s.total_score;
      participantAgg[p.id].total_time_ms += s.total_time_ms;
      participantAgg[p.id].correct_count += s.correct_count;
      participantAgg[p.id].categories_finished += 1;
    }

    const rows = Object.values(participantAgg)
      .sort((a, b) => b.total_score - a.total_score || a.total_time_ms - b.total_time_ms)
      .slice(0, 10);
    return { rows };
  }

  // TOP SCHOOLS
  if (sql.includes('best_student_scores') || (sql.includes('sekolah_clean') && sql.includes('GROUP BY'))) {
    const schoolMap = {};
    for (const s of memStore.quizSessions.filter(item => item.finished_at !== null)) {
      const p = memStore.participants.find(part => part.id === s.participant_id);
      if (!p) continue;
      const school = p.sekolah_clean;
      if (!schoolMap[school]) {
        schoolMap[school] = { sekolah: school, students: new Map() };
      }
      const existingBest = schoolMap[school].students.get(p.id) || 0;
      schoolMap[school].students.set(p.id, existingBest + s.total_score);
    }

    const schoolRankings = Object.values(schoolMap).map(sc => {
      const scores = Array.from(sc.students.values());
      const totalPoints = scores.reduce((sum, val) => sum + val, 0);
      return {
        sekolah: sc.sekolah,
        peserta_count: scores.length,
        total_points: totalPoints,
        avg_score: Math.round(totalPoints / (scores.length || 1))
      };
    })
    .sort((a, b) => b.total_points - a.total_points || b.peserta_count - a.peserta_count)
    .slice(0, 5);

    return { rows: schoolRankings };
  }

  // CSV EXPORT QUERY
  if (sql.includes('ORDER BY s.total_score DESC NULLS LAST')) {
    const list = [];
    for (const p of memStore.participants) {
      const pSessions = memStore.quizSessions.filter(sess => sess.participant_id === p.id);
      if (pSessions.length === 0) {
        list.push({
          id: p.id,
          nama: p.nama,
          nama_clean: p.nama_clean,
          sekolah: p.sekolah,
          sekolah_clean: p.sekolah_clean,
          wa: p.wa,
          kategori_kode: '-',
          total_score: 0,
          correct_count: 0,
          total_time_ms: 0,
          badge_title: '-',
          started_at: p.created_at,
          finished_at: null
        });
      } else {
        pSessions.forEach(s => {
          list.push({
            id: p.id,
            nama: p.nama,
            nama_clean: p.nama_clean,
            sekolah: p.sekolah,
            sekolah_clean: p.sekolah_clean,
            wa: p.wa,
            kategori_kode: s.kategori_kode,
            total_score: s.total_score,
            correct_count: s.correct_count,
            total_time_ms: s.total_time_ms,
            badge_title: s.badge_title,
            started_at: s.started_at,
            finished_at: s.finished_at
          });
        });
      }
    }
    return { rows: list.sort((a, b) => b.total_score - a.total_score) };
  }

  // STATS
  if (sql.includes('COUNT(DISTINCT p.id)')) {
    const totalParticipants = memStore.participants.length;
    const totalFinished = memStore.quizSessions.filter(s => s.finished_at !== null).length;
    return { rows: [{ total_peserta: totalParticipants, total_selesai: totalFinished }] };
  }

  return { rows: [] };
}

async function initDb() {
  if (pool && !useInMemory) {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('[DB] PostgreSQL schema initialized successfully.');
  }
}

module.exports = {
  query,
  initDb,
  getPool: () => pool,
  _resetMemoryStore: () => {
    memStore.participants = [];
    memStore.quizSessions = [];
    memStore.quizAnswers = [];
    memStore.nextParticipantId = 1;
    memStore.nextAnswerId = 1;
    saveDevStore();
  }
};
