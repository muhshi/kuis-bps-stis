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

// In-memory cache for TV Leaderboard snapshot
let cachedLeaderboard = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 2500; // 2.5 seconds cache

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generate10Questions() {
  // 4 Logika (sebagai hook seru), 3 Data BPS, 3 Info STIS
  const qLogika = getRandomItems(byCategory.logika, 4);
  const qData = getRandomItems(byCategory.data, 3);
  const qStis = getRandomItems(byCategory.stis, 3);

  const combined = [...qLogika, ...qData, ...qStis];
  return combined;
}

function calculateQuestionScore(isCorrect, timeSpentMs, maxTimeMs = 15000) {
  if (!isCorrect) return 0;
  const baseScore = 1000;
  const clampedTime = Math.min(Math.max(0, timeSpentMs), maxTimeMs);
  const remaining = maxTimeMs - clampedTime;
  const speedBonus = Math.round(500 * (remaining / maxTimeMs));
  return baseScore + speedBonus;
}

function determineBadge(totalScore, correctCount) {
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

async function startSession({ nama, sekolah, wa }) {
  const namaClean = sanitizeNickname(nama);
  const sekolahClean = normalizeSchoolName(sekolah);
  const waClean = (wa || '').trim();

  // 1. Create participant
  const partRes = await db.query(
    `INSERT INTO participants (nama, nama_clean, sekolah, sekolah_clean, wa)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nama_clean, sekolah_clean`,
    [nama.trim(), namaClean, sekolah.trim(), sekolahClean, waClean]
  );
  const participant = partRes.rows[0];

  // 2. Select 10 questions
  const selectedQuestions = generate10Questions();
  const questionIds = selectedQuestions.map(q => q.id);
  const sessionId = crypto.randomUUID();

  // 3. Create session record
  await db.query(
    `INSERT INTO quiz_sessions (id, participant_id, question_ids)
     VALUES ($1, $2, $3)`,
    [sessionId, participant.id, questionIds]
  );

  // 4. Return questions WITHOUT the secret answer keys
  const safeQuestions = selectedQuestions.map(q => ({
    id: q.id,
    kategori_kode: q.kategori_kode,
    kategori_label: q.kategori_label,
    pertanyaan: q.pertanyaan,
    opsi: q.opsi,
    // Note: 'kunci' and 'penjelasan' are NOT sent to client during play to prevent inspecting
  }));

  return {
    sessionId,
    participant: {
      nama: participant.nama_clean,
      sekolah: participant.sekolah_clean
    },
    totalQuestions: safeQuestions.length,
    questions: safeQuestions
  };
}

async function finishSession({ sessionId, answers = [] }) {
  // 1. Fetch session
  const sessRes = await db.query(
    `SELECT s.*, p.nama_clean, p.sekolah_clean 
     FROM quiz_sessions s
     JOIN participants p ON p.id = s.participant_id
     WHERE s.id = $1`,
    [sessionId]
  );

  if (sessRes.rows.length === 0) {
    throw new Error('Sesi kuis tidak ditemukan');
  }

  const session = sessRes.rows[0];
  if (session.finished_at) {
    // Sesi sudah pernah difinalisasi (idempotent response)
    const badge = determineBadge(session.total_score, session.correct_count);
    return {
      sessionId,
      finalScore: session.total_score,
      correctCount: session.correct_count,
      totalQuestions: 10,
      totalTimeMs: session.total_time_ms,
      badge,
      participant: {
        nama: session.nama_clean,
        sekolah: session.sekolah_clean
      }
    };
  }

  // 2. Evaluate answers
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

    // Save individual answer record
    await db.query(
      `INSERT INTO quiz_answers (session_id, question_id, chosen_option, is_correct, time_spent_ms, score_awarded)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (session_id, question_id) DO NOTHING`,
      [sessionId, q.id, chosen, isCorrect, timeSpent, scoreAwarded]
    );
  }

  const badge = determineBadge(totalScore, correctCount);

  // 3. Update session
  await db.query(
    `UPDATE quiz_sessions 
     SET total_score = $1, total_time_ms = $2, correct_count = $3, badge_title = $4, finished_at = CURRENT_TIMESTAMP
     WHERE id = $5`,
    [totalScore, totalTimeMs, correctCount, badge.title, sessionId]
  );

  // Invalidate leaderboard cache so TV updates immediately
  cachedLeaderboard = null;

  return {
    sessionId,
    finalScore: totalScore,
    correctCount,
    totalQuestions: 10,
    totalTimeMs,
    badge,
    feedback: feedbackList,
    participant: {
      nama: session.nama_clean,
      sekolah: session.sekolah_clean
    }
  };
}

async function getLeaderboardSnapshot() {
  const now = Date.now();
  if (cachedLeaderboard && now < cacheExpiresAt) {
    return cachedLeaderboard;
  }

  // 1. Top 10 Participants
  const topRes = await db.query(
    `SELECT s.id as session_id, p.nama_clean as nama, p.sekolah_clean as sekolah, 
            s.total_score, s.total_time_ms, s.correct_count, s.badge_title
     FROM quiz_sessions s
     JOIN participants p ON p.id = s.participant_id
     WHERE s.finished_at IS NOT NULL
     ORDER BY s.total_score DESC, s.total_time_ms ASC
     LIMIT 10`
  );

  const topPlayers = topRes.rows.map((row, idx) => ({
    rank: idx + 1,
    nama: row.nama,
    sekolah: row.sekolah,
    totalScore: row.total_score,
    totalTimeSeconds: (row.total_time_ms / 1000).toFixed(1),
    correctCount: row.correct_count,
    badgeTitle: row.badge_title
  }));

  // 2. Top 5 Schools (Aggregated by highest score per unique participant to prevent spam)
  const schoolRes = await db.query(
    `WITH best_student_scores AS (
       SELECT p.id as participant_id, p.sekolah_clean, MAX(s.total_score) as best_score
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

  // 3. Live Stats Counter
  const statsRes = await db.query(
    `SELECT COUNT(DISTINCT p.id) as total_peserta,
            COUNT(s.id) FILTER (WHERE s.finished_at IS NOT NULL) as total_selesai
     FROM participants p
     LEFT JOIN quiz_sessions s ON s.participant_id = p.id`
  );

  const stats = statsRes.rows[0] || {};

  cachedLeaderboard = {
    topPlayers,
    topSchools,
    liveStats: {
      totalPeserta: parseInt(stats.total_peserta || 0, 10),
      totalSelesai: parseInt(stats.total_selesai || 0, 10)
    },
    updatedAt: new Date().toISOString()
  };
  cacheExpiresAt = now + CACHE_TTL_MS;

  return cachedLeaderboard;
}

module.exports = {
  startSession,
  finishSession,
  getLeaderboardSnapshot,
  calculateQuestionScore,
  determineBadge,
  generate10Questions,
  _resetCache: () => { cachedLeaderboard = null; cacheExpiresAt = 0; }
};
