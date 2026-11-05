const test = require('node:test');
const assert = require('node:assert/strict');
const quizService = require('../src/services/quizService');
const db = require('../src/db');

test('Quiz Service: generate10QuestionsForCategory menghasilkan 10 soal sesuai kategori', () => {
  const qLogika = quizService.generate10QuestionsForCategory('logika');
  assert.equal(qLogika.length, 10);
  assert.ok(qLogika.every(q => q.kategori_kode === 'logika'));

  const qData = quizService.generate10QuestionsForCategory('data');
  assert.equal(qData.length, 10);
  assert.ok(qData.every(q => q.kategori_kode === 'data'));

  const qStis = quizService.generate10QuestionsForCategory('stis');
  assert.equal(qStis.length, 10);
  assert.ok(qStis.every(q => q.kategori_kode === 'stis'));
});

test('Quiz Service: calculateQuestionScore menghitung base poin + sisa waktu', () => {
  assert.equal(quizService.calculateQuestionScore(true, 0, 15000), 1500);
  assert.equal(quizService.calculateQuestionScore(true, 7500, 15000), 1250);
  assert.equal(quizService.calculateQuestionScore(true, 15000, 15000), 1000);
  assert.equal(quizService.calculateQuestionScore(false, 1000, 15000), 0);
});

test('Quiz Service: alur multi-kategori per peserta & pencegahan repetisi kategori', async () => {
  db._resetMemoryStore();
  quizService._resetCache();

  // 1. Peserta mulai kategori 'logika'
  const session1 = await quizService.startSession({
    nama: 'Budi Santoso',
    sekolah: 'sma n 1 semarang',
    wa: '08123456789',
    kategoriKode: 'logika'
  });

  assert.ok(session1.sessionId);
  assert.equal(session1.kategoriKode, 'logika');
  assert.equal(session1.questions.length, 10);

  // 2. Selesaikan sesi 1
  const questionsData = require('../src/data/questions.json');
  const questionsMap = new Map(questionsData.map(q => [q.id, q]));

  const mockAnswers1 = session1.questions.map(q => ({
    questionId: q.id,
    chosenOption: questionsMap.get(q.id).kunci,
    timeSpentMs: 2000
  }));

  const finish1 = await quizService.finishSession({
    sessionId: session1.sessionId,
    answers: mockAnswers1
  });

  assert.equal(finish1.correctCount, 10);
  assert.ok(finish1.categoryScore > 13000);
  assert.equal(finish1.participantStatus.completedCategories.length, 1);
  assert.equal(finish1.participantStatus.availableCategories.length, 2);

  // 3. Coba mulai kategori 'logika' lagi (harus ditolak karena sudah selesai)
  await assert.rejects(
    async () => {
      await quizService.startSession({
        participantId: session1.participantId,
        kategoriKode: 'logika'
      });
    },
    /sudah pernah kamu kerjakan/
  );

  // 4. Mulai kategori kedua: 'data'
  const session2 = await quizService.startSession({
    participantId: session1.participantId,
    kategoriKode: 'data'
  });
  assert.ok(session2.sessionId);
  assert.equal(session2.kategoriKode, 'data');

  // 5. Cek Leaderboard Grand vs Per Kategori
  const grandLb = await quizService.getLeaderboardSnapshot('all');
  assert.equal(grandLb.topPlayers.length, 1);
  assert.equal(grandLb.topPlayers[0].nama, 'Budi Santoso');

  const catLb = await quizService.getLeaderboardSnapshot('logika');
  assert.equal(catLb.topPlayers.length, 1);
  assert.equal(catLb.topPlayers[0].nama, 'Budi Santoso');
});
