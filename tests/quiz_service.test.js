const test = require('node:test');
const assert = require('node:assert/strict');
const quizService = require('../src/services/quizService');
const db = require('../src/db');

test('Quiz Service: generate10Questions menghasilkan 4 logika, 3 data, 3 stis', () => {
  const questions = quizService.generate10Questions();
  assert.equal(questions.length, 10, 'Jumlah soal per sesi harus 10 butir');

  const counts = { logika: 0, data: 0, stis: 0 };
  questions.forEach(q => counts[q.kategori_kode]++);

  assert.equal(counts.logika, 4, 'Harus ada 4 soal logika pembuka');
  assert.equal(counts.data, 3, 'Harus ada 3 soal data BPS');
  assert.equal(counts.stis, 3, 'Harus ada 3 soal STIS');
});

test('Quiz Service: calculateQuestionScore menghitung base poin + sisa waktu', () => {
  // Benar instan (0 detik) -> 1000 base + 500 bonus = 1500
  assert.equal(quizService.calculateQuestionScore(true, 0, 15000), 1500);

  // Benar di detik ke-7.5 (separuh waktu) -> 1000 + 250 = 1250
  assert.equal(quizService.calculateQuestionScore(true, 7500, 15000), 1250);

  // Benar di detik terakhir (15 detik) -> 1000 + 0 = 1000
  assert.equal(quizService.calculateQuestionScore(true, 15000, 15000), 1000);

  // Salah -> 0 poin
  assert.equal(quizService.calculateQuestionScore(false, 1000, 15000), 0);
});

test('Quiz Service: startSession and finishSession flow', async () => {
  db._resetMemoryStore();
  quizService._resetCache();

  const startRes = await quizService.startSession({
    nama: 'Andi Pratama',
    sekolah: 'sma n 1 semarang',
    wa: '08123456789'
  });

  assert.ok(startRes.sessionId);
  assert.equal(startRes.participant.nama, 'Andi Pratama');
  assert.equal(startRes.participant.sekolah, 'SMAN 1 Semarang');
  assert.equal(startRes.questions.length, 10);
  assert.equal(startRes.questions[0].kunci, undefined, 'Kunci jawaban tidak boleh dikirim ke klien!');

  // Prepare answers
  const questionsData = require('../src/data/questions.json');
  const questionsMap = new Map(questionsData.map(q => [q.id, q]));

  const mockAnswers = startRes.questions.map(q => {
    const fullQ = questionsMap.get(q.id);
    return {
      questionId: q.id,
      chosenOption: fullQ.kunci, // jawab benar semua
      timeSpentMs: 3000 // 3 detik
    };
  });

  const finishRes = await quizService.finishSession({
    sessionId: startRes.sessionId,
    answers: mockAnswers
  });

  assert.equal(finishRes.correctCount, 10);
  assert.ok(finishRes.finalScore > 13000, `Skor harus tinggi: got ${finishRes.finalScore}`);
  assert.equal(finishRes.badge.title, 'Grand Master Statistika');

  // Check Leaderboard
  const leaderboard = await quizService.getLeaderboardSnapshot();
  assert.equal(leaderboard.topPlayers.length, 1);
  assert.equal(leaderboard.topPlayers[0].nama, 'Andi Pratama');
  assert.equal(leaderboard.topSchools.length, 1);
  assert.equal(leaderboard.topSchools[0].sekolah, 'SMAN 1 Semarang');
  assert.equal(leaderboard.liveStats.totalSelesai, 1);
});
