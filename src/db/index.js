const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
let useInMemory = false;

// In-Memory store fallback for standalone local preview / mock tests
const memStore = {
  participants: [],
  quizSessions: [],
  quizAnswers: [],
  nextParticipantId: 1,
  nextAnswerId: 1
};

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
  console.log('[DB] Running in In-Memory fallback mode (Zero-setup local mode). Set PGHOST/DATABASE_URL to use PostgreSQL.');
}

async function query(text, params) {
  if (pool && !useInMemory) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.warn('[DB] PostgreSQL query failed, using in-memory store:', err.message);
      // Fallback to in-memory if connection fails
      useInMemory = true;
    }
  }

  // Fallback simulator for basic queries
  return executeInMemory(text, params);
}

function executeInMemory(text, params = []) {
  const sql = text.trim();

  // INSERT INTO participants
  if (sql.startsWith('INSERT INTO participants')) {
    const id = memStore.nextParticipantId++;
    const [nama, nama_clean, sekolah, sekolah_clean, wa] = params;
    const record = { id, nama, nama_clean, sekolah, sekolah_clean, wa, created_at: new Date() };
    memStore.participants.push(record);
    return { rows: [record] };
  }

  // INSERT INTO quiz_sessions
  if (sql.startsWith('INSERT INTO quiz_sessions')) {
    const [id, participant_id, question_ids] = params;
    const record = {
      id,
      participant_id,
      question_ids,
      total_score: 0,
      total_time_ms: 0,
      correct_count: 0,
      badge_title: null,
      started_at: new Date(),
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
      session.finished_at = new Date();
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
      created_at: new Date()
    };
    memStore.quizAnswers.push(record);
    return { rows: [record] };
  }

  // SELECT session by ID (handles both 'WHERE s.id = $1' and 'WHERE id = $1')
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

  // TOP PARTICIPANTS LEADERBOARD
  if (sql.includes('FROM quiz_sessions s') && sql.includes('ORDER BY') && sql.includes('total_score DESC')) {
    const finished = memStore.quizSessions
      .filter(s => s.finished_at !== null)
      .map(s => {
        const p = memStore.participants.find(part => part.id === s.participant_id) || {};
        return {
          session_id: s.id,
          nama: p.nama_clean || 'Peserta',
          sekolah: p.sekolah_clean || 'Sekolah Lainnya',
          total_score: s.total_score,
          total_time_ms: s.total_time_ms,
          correct_count: s.correct_count,
          badge_title: s.badge_title
        };
      })
      .sort((a, b) => b.total_score - a.total_score || a.total_time_ms - b.total_time_ms)
      .slice(0, 10);
    return { rows: finished };
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
      if (s.total_score > existingBest) {
        schoolMap[school].students.set(p.id, s.total_score);
      }
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
    const list = memStore.participants.map(p => {
      const s = memStore.quizSessions.find(sess => sess.participant_id === p.id) || {};
      return {
        id: p.id,
        nama: p.nama,
        nama_clean: p.nama_clean,
        sekolah: p.sekolah,
        sekolah_clean: p.sekolah_clean,
        wa: p.wa,
        total_score: s.total_score || 0,
        correct_count: s.correct_count || 0,
        total_time_ms: s.total_time_ms || 0,
        badge_title: s.badge_title || '',
        started_at: s.started_at || p.created_at,
        finished_at: s.finished_at || null
      };
    }).sort((a, b) => b.total_score - a.total_score);
    return { rows: list };
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
    const fs = require('fs');
    const path = require('path');
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
  }
};
