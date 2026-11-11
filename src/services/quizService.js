const crypto = require('crypto');
const db = require('../db');
const { normalizeSchoolName } = require('../utils/schoolNormalizer');
const { sanitizeNickname } = require('../utils/profanity');
const questionsData = require('../data/questions.json');

// Map questions by id for fast O(1) lookup
const questionsMap = new Map();
questionsData.forEach(q => questionsMap.set(q.id, q));

// Group questions by category
const byCategory = {
  logika: questionsData.filter(q => q.kategori_kode === 'logika'),
  data: questionsData.filter(q => q.kategori_kode === 'data'),
  stis: questionsData.filter(q => q.kategori_kode === 'stis')
};

// In-memory cache for TV Leaderboard snapshots (per category and 'all')
const cachedLeaderboards = new Map();
const CACHE_TTL_MS = 2500; // 2.5 seconds cache

function getRandomItems(array, count) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

function generate10QuestionsForCategory(categoryCode) {
  const pool = byCategory[categoryCode] || byCategory['logika'];
  return getRandomItems(pool, 10);
}

function calculateQuestionScore(isCorrect, timeSpentMs, maxTimeMs = 15000) {
  if (!isCorrect) return 0;
  const baseScore = 1000;
  const clampedTime = Math.min(Math.max(0, timeSpentMs), maxTimeMs);
  const remaining = maxTimeMs - clampedTime;
  const speedBonus = Math.round(500 * (remaining / maxTimeMs));
  return baseScore + speedBonus;
}

function determineBadge(totalScore, correctCount, categoryCode) {
  if (totalScore >= 11000 || correctCount >= 9) {
    return {
      title: 'Grand Master Statistika',
      subtitle: 'Siap Jadi Taruna/Mahasiswa STIS!',
      icon: '🏆',
      color: 'gold'
    };
  } else if (totalScore >= 8000 || correctCount >= 7) {
    return {
      title: 'Detektif Data Handal',
      subtitle: 'Nalar Tajam & Peka Fakta',
      icon: '🔍',
      color: 'blue'
    };
  } else if (totalScore >= 5000 || correctCount >= 5) {
    return {
      title: 'Pejuang Logika Tangguh',
      subtitle: 'Berani Menjawab & Berbakat',
      icon: '⚡',
      color: 'green'
    };
  } else {
    return {
      title: 'Sahabat Muda BPS',
      subtitle: 'Tetap Semangat & Coba Lagi!',
      icon: '🌱',
      color: 'purple'
    };
  }
}

async function getParticipantStatus(participantId) {
  const partRes = await db.query(
    `SELECT id, nama_clean, sekolah_clean FROM participants WHERE id = $1`,
    [participantId]
  );
  if (partRes.rows.length === 0) return null;

  const part = partRes.rows[0];
  const sessRes = await db.query(
    `SELECT s.kategori_kode, s.total_score, s.finished_at 
     FROM quiz_sessions s 
     WHERE s.participant_id = $1 AND s.finished_at IS NOT NULL`,
    [participantId]
  );

  const completed = sessRes.rows.map(r => ({
    kategori_kode: r.kategori_kode,
    total_score: r.total_score,
    finished_at: r.finished_at
  }));

  const allCategories = ['logika', 'data', 'stis'];
  const completedCodes = new Set(completed.map(c => c.kategori_kode));
  const available = allCategories.filter(c => !completedCodes.has(c));
  const totalScore = completed.reduce((sum, item) => sum + item.total_score, 0);

  return {
    participant: {
      id: part.id,
      nama: part.nama_clean,
      sekolah: part.sekolah_clean
    },
    completedCategories: completed,
    availableCategories: available,
    totalScore,
    isAllCompleted: available.length === 0
  };
}

async function startSession({ participantId, nama, sekolah, wa, kategoriKode }) {
  const cat = ['logika', 'data', 'stis'].includes(kategoriKode) ? kategoriKode : 'logika';
  let participant;

  if (participantId) {
    const partRes = await db.query(
      `SELECT id, nama_clean, sekolah_clean FROM participants WHERE id = $1`,
      [participantId]
    );
    if (partRes.rows.length > 0) {
      participant = partRes.rows[0];
    }
  }

  if (!participant) {
    const namaClean = sanitizeNickname(nama);
    const sekolahClean = normalizeSchoolName(sekolah);
    const waClean = (wa || '').trim();

    const partRes = await db.query(
      `INSERT INTO participants (nama, nama_clean, sekolah, sekolah_clean, wa)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nama_clean, sekolah_clean`,
      [nama.trim(), namaClean, sekolah.trim(), sekolahClean, waClean]
    );
    participant = partRes.rows[0];
  }

  // Check if participant already finished this category
  const existingSess = await db.query(
    `SELECT s.kategori_kode, s.total_score, s.finished_at 
     FROM quiz_sessions s 
     WHERE s.participant_id = $1 AND s.finished_at IS NOT NULL`,
    [participant.id]
  );

  const completedCats = existingSess.rows.map(r => r.kategori_kode);
  if (completedCats.includes(cat)) {
    throw new Error(`Kategori ${cat.toUpperCase()} sudah pernah kamu kerjakan! Silakan pilih kategori lain.`);
  }

  // Generate 10 questions strictly for this category
  const selectedQuestions = generate10QuestionsForCategory(cat);
  const questionIds = selectedQuestions.map(q => q.id);
  const sessionId = crypto.randomUUID();

  await db.query(
    `INSERT INTO quiz_sessions (id, participant_id, kategori_kode, question_ids)
     VALUES ($1, $2, $3, $4)`,
    [sessionId, participant.id, cat, questionIds]
  );

  const safeQuestions = selectedQuestions.map(q => ({
    id: q.id,
    kategori_kode: q.kategori_kode,
    kategori_label: q.kategori_label,
    pertanyaan: q.pertanyaan,
    opsi: q.opsi
  }));

  return {
    sessionId,
    participantId: participant.id,
    participant: {
      nama: participant.nama_clean,
      sekolah: participant.sekolah_clean
    },
    kategoriKode: cat,
    totalQuestions: safeQuestions.length,
    questions: safeQuestions
  };
}

async function finishSession({ sessionId, participantId, kategoriKode, answers = [] }) {
  const sessRes = await db.query(
    `SELECT s.*, p.id as participant_id, p.nama_clean, p.sekolah_clean 
     FROM quiz_sessions s
     JOIN participants p ON p.id = s.participant_id
     WHERE s.id = $1`,
    [sessionId]
  );

  if (sessRes.rows.length === 0) {
    // Graceful auto-recovery: If session wasn't found (e.g. server restarted during dev),
    // look up participant or create one, so student results are NEVER lost!
    let part = null;
    if (participantId) {
      const pCheck = await db.query(
        `SELECT id, nama_clean, sekolah_clean FROM participants WHERE id = $1`,
        [participantId]
      );
      if (pCheck.rows.length > 0) {
        part = pCheck.rows[0];
      }
    }

    if (!part) {
      const partRes = await db.query(
        `INSERT INTO participants (nama, nama_clean, sekolah, sekolah_clean, wa)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, nama_clean, sekolah_clean`,
        ['Peserta Kuis', 'Peserta Kuis', 'SMA Indonesia', 'SMA Indonesia', '']
      );
      part = partRes.rows[0];
    }

    const cat = kategoriKode || 'logika';
    const recQuestionIds = answers.map(a => a.questionId);
    await db.query(
      `INSERT INTO quiz_sessions (id, participant_id, kategori_kode, question_ids)
       VALUES ($1, $2, $3, $4)`,
      [sessionId, part.id, cat, recQuestionIds]
    );

    sessRes.rows.push({
      id: sessionId,
      participant_id: part.id,
      nama_clean: part.nama_clean,
      sekolah_clean: part.sekolah_clean,
      kategori_kode: cat,
      finished_at: null
    });
  }

  const session = sessRes.rows[0];
  if (session.finished_at) {
    const status = await getParticipantStatus(session.participant_id);
    const badge = determineBadge(session.total_score, session.correct_count, session.kategori_kode);
    return {
      sessionId,
      participantId: session.participant_id,
      categoryScore: session.total_score,
      correctCount: session.correct_count,
      totalQuestions: 10,
      totalTimeMs: session.total_time_ms,
      badge,
      participantStatus: status
    };
  }

  let totalScore = 0;
  let totalTimeMs = 0;
  let correctCount = 0;
  const feedbackList = [];

  for (const ans of answers) {
    const q = questionsMap.get(ans.questionId);
    if (!q) continue;

    const chosen = (ans.chosenOption || '').trim().toUpperCase();
    const isCorrect = chosen === q.kunci;
    const timeSpent = Math.max(0, parseInt(ans.timeSpentMs || 0, 10));
    const scoreAwarded = calculateQuestionScore(isCorrect, timeSpent);

    totalScore += scoreAwarded;
    totalTimeMs += timeSpent;
    if (isCorrect) correctCount++;

    feedbackList.push({
      questionId: q.id,
      pertanyaan: q.pertanyaan,
      chosenOption: chosen,
      correctOption: q.kunci,
      isCorrect,
      scoreAwarded,
      penjelasan: q.penjelasan
    });

    await db.query(
      `INSERT INTO quiz_answers (session_id, question_id, chosen_option, is_correct, time_spent_ms, score_awarded)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (session_id, question_id) DO NOTHING`,
      [sessionId, q.id, chosen, isCorrect, timeSpent, scoreAwarded]
    );
  }

  const badge = determineBadge(totalScore, correctCount, session.kategori_kode);

  await db.query(
    `UPDATE quiz_sessions 
     SET total_score = $1, total_time_ms = $2, correct_count = $3, badge_title = $4, finished_at = CURRENT_TIMESTAMP
     WHERE id = $5`,
    [totalScore, totalTimeMs, correctCount, badge.title, sessionId]
  );

  // Clear leaderboard caches
  cachedLeaderboards.clear();

  const status = await getParticipantStatus(session.participant_id);

  return {
    sessionId,
    participantId: session.participant_id,
    kategoriKode: session.kategori_kode,
    categoryScore: totalScore,
    correctCount,
    totalQuestions: 10,
    totalTimeMs,
    badge,
    feedback: feedbackList,
    participantStatus: status
  };
}

async function getLeaderboardSnapshot(kategori = 'all') {
  const cat = ['logika', 'data', 'stis'].includes(kategori) ? kategori : 'all';
  const now = Date.now();
  const cached = cachedLeaderboards.get(cat);
  if (cached && now < cached.expiresAt) {
    return cached.data;
  }

  let topPlayers = [];

  if (cat === 'all') {
    // Grand Leaderboard (Total Akumulasi Skor per Siswa)
    const topRes = await db.query(
      `SELECT p.id as participant_id, p.nama_clean as nama, p.sekolah_clean as sekolah,
              SUM(s.total_score) as total_score,
              SUM(s.total_time_ms) as total_time_ms,
              SUM(s.correct_count) as correct_count,
              COUNT(s.id) as categories_finished
       FROM quiz_sessions s
       JOIN participants p ON p.id = s.participant_id
       WHERE s.finished_at IS NOT NULL
       GROUP BY p.id, p.nama_clean, p.sekolah_clean
       ORDER BY total_score DESC, total_time_ms ASC
       LIMIT 10`
    );

    topPlayers = topRes.rows.map((row, idx) => ({
      rank: idx + 1,
      nama: row.nama,
      sekolah: row.sekolah,
      totalScore: parseInt(row.total_score || 0, 10),
      totalTimeSeconds: (parseInt(row.total_time_ms || 0, 10) / 1000).toFixed(1),
      correctCount: parseInt(row.correct_count || 0, 10),
      badgeTitle: `${row.categories_finished || 1}/3 Kategori Selesai`
    }));
  } else {
    // Leaderboard Specific Category
    const topRes = await db.query(
      `SELECT s.id as session_id, p.nama_clean as nama, p.sekolah_clean as sekolah, 
              s.total_score, s.total_time_ms, s.correct_count, s.badge_title
       FROM quiz_sessions s
       JOIN participants p ON p.id = s.participant_id
       WHERE s.finished_at IS NOT NULL AND s.kategori_kode = $1
       ORDER BY s.total_score DESC, s.total_time_ms ASC
       LIMIT 10`,
      [cat]
    );

    topPlayers = topRes.rows.map((row, idx) => ({
      rank: idx + 1,
      nama: row.nama,
      sekolah: row.sekolah,
      totalScore: row.total_score,
      totalTimeSeconds: (row.total_time_ms / 1000).toFixed(1),
      correctCount: row.correct_count,
      badgeTitle: row.badge_title
    }));
  }

  // Top 5 Schools
  const schoolRes = await db.query(
    `WITH best_student_scores AS (
       SELECT p.id as participant_id, p.sekolah_clean, SUM(s.total_score) as best_score
       FROM quiz_sessions s
       JOIN participants p ON p.id = s.participant_id
       WHERE s.finished_at IS NOT NULL
       GROUP BY p.id, p.sekolah_clean
     )
     SELECT sekolah_clean as sekolah,
            COUNT(participant_id) as peserta_count,
            SUM(best_score) as total_points,
            ROUND(AVG(best_score)) as avg_score
     FROM best_student_scores
     GROUP BY sekolah_clean
     ORDER BY total_points DESC, peserta_count DESC
     LIMIT 5`
  );

  const topSchools = schoolRes.rows.map((row, idx) => ({
    rank: idx + 1,
    sekolah: row.sekolah,
    pesertaCount: parseInt(row.peserta_count || 0, 10),
    totalPoints: parseInt(row.total_points || 0, 10),
    avgScore: parseInt(row.avg_score || 0, 10)
  }));

  // Stats
  const statsRes = await db.query(
    `SELECT COUNT(DISTINCT p.id) as total_peserta,
            COUNT(s.id) FILTER (WHERE s.finished_at IS NOT NULL) as total_selesai
     FROM participants p
     LEFT JOIN quiz_sessions s ON s.participant_id = p.id`
  );
  const stats = statsRes.rows[0] || {};

  const snapshot = {
    currentCategory: cat,
    topPlayers,
    topSchools,
    liveStats: {
      totalPeserta: parseInt(stats.total_peserta || 0, 10),
      totalSelesai: parseInt(stats.total_selesai || 0, 10)
    },
    updatedAt: new Date().toISOString()
  };

  cachedLeaderboards.set(cat, {
    data: snapshot,
    expiresAt: now + CACHE_TTL_MS
  });

  return snapshot;
}

async function getAdminOverview() {
  const queryRes = await db.query(
    `SELECT p.id, p.nama, p.nama_clean, p.sekolah, p.sekolah_clean, p.wa,
            s.kategori_kode, s.total_score, s.correct_count, s.total_time_ms, s.badge_title, s.started_at, s.finished_at
     FROM participants p
     LEFT JOIN quiz_sessions s ON s.participant_id = p.id
     ORDER BY s.total_score DESC NULLS LAST, p.created_at ASC`
  );

  const rows = queryRes.rows || [];
  const participantMap = new Map();

  for (const r of rows) {
    if (!participantMap.has(r.id)) {
      participantMap.set(r.id, {
        id: r.id,
        nama: r.nama_clean || r.nama || 'Peserta',
        namaAsli: r.nama || '',
        sekolah: r.sekolah_clean || r.sekolah || 'Sekolah Lainnya',
        wa: r.wa || '',
        createdAt: r.started_at || null,
        scores: { logika: null, data: null, stis: null },
        categoriesFinished: 0,
        totalScore: 0,
        totalCorrect: 0,
        totalTimeMs: 0,
        lastFinishedAt: null
      });
    }

    const p = participantMap.get(r.id);
    if (r.started_at && (!p.createdAt || r.started_at < p.createdAt)) {
      p.createdAt = r.started_at;
    }

    const isValidCat = ['logika', 'data', 'stis'].includes(r.kategori_kode);
    if (isValidCat && r.finished_at) {
      const score = parseInt(r.total_score || 0, 10);
      const correct = parseInt(r.correct_count || 0, 10);
      const timeMs = parseInt(r.total_time_ms || 0, 10);

      if (p.scores[r.kategori_kode] === null) {
        p.scores[r.kategori_kode] = score;
        p.categoriesFinished += 1;
        p.totalScore += score;
        p.totalCorrect += correct;
        p.totalTimeMs += timeMs;
      }

      if (!p.lastFinishedAt || r.finished_at > p.lastFinishedAt) {
        p.lastFinishedAt = r.finished_at;
      }
    }
  }

  const participants = Array.from(participantMap.values())
    .map(p => ({
      ...p,
      totalTimeSeconds: (p.totalTimeMs / 1000).toFixed(1)
    }))
    .sort((a, b) => b.totalScore - a.totalScore || a.totalTimeMs - b.totalTimeMs || a.id - b.id);

  // Build full school rankings (not capped to top 5)
  const schoolMap = new Map();
  for (const p of participants) {
    const key = p.sekolah;
    if (!schoolMap.has(key)) {
      schoolMap.set(key, {
        sekolah: key,
        pesertaCount: 0,
        finishedPesertaCount: 0,
        totalPoints: 0
      });
    }
    const sc = schoolMap.get(key);
    sc.pesertaCount += 1;
    if (p.categoriesFinished > 0) {
      sc.finishedPesertaCount += 1;
      sc.totalPoints += p.totalScore;
    }
  }

  const schools = Array.from(schoolMap.values())
    .map(sc => ({
      ...sc,
      avgScore: sc.finishedPesertaCount > 0 ? Math.round(sc.totalPoints / sc.finishedPesertaCount) : 0
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints || b.pesertaCount - a.pesertaCount || a.sekolah.localeCompare(b.sekolah))
    .map((sc, idx) => ({ rank: idx + 1, ...sc }));

  const totalSelesaiSesi = participants.reduce((sum, p) => sum + p.categoriesFinished, 0);
  const totalTuntasAll = participants.filter(p => p.categoriesFinished === 3).length;
  const totalWithWa = participants.filter(p => p.wa && p.wa.trim().length > 0).length;

  return {
    summary: {
      totalPeserta: participants.length,
      totalSelesaiSesi,
      totalTuntasAll,
      totalSekolah: schools.length,
      totalWithWa
    },
    questionBank: {
      total: questionsData.length,
      logika: byCategory.logika.length,
      data: byCategory.data.length,
      stis: byCategory.stis.length
    },
    schools,
    participants,
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  startSession,
  finishSession,
  getParticipantStatus,
  getLeaderboardSnapshot,
  getAdminOverview,
  calculateQuestionScore,
  determineBadge,
  generate10QuestionsForCategory,
  _resetCache: () => { cachedLeaderboards.clear(); }
};
