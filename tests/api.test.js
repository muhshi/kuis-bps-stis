const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app } = require('../src/server');
const db = require('../src/db');
const quizService = require('../src/services/quizService');

test('API Tests: multi-category session flow, leaderboard filter, and export', async () => {
  db._resetMemoryStore();
  quizService._resetCache();

  // 1. GET /api/health
  const healthRes = await request(app).get('/api/health');
  assert.equal(healthRes.status, 200);

  // 2. Start initial session without participantId
  const startRes = await request(app).post('/api/quiz/start').send({
    nama: 'Rian Dwi',
    sekolah: 'sma negeri 3 semarang',
    wa: '08198765432',
    kategoriKode: 'logika'
  });
  assert.equal(startRes.status, 200);
  assert.equal(startRes.body.success, true);
  const data1 = startRes.body.data;
  assert.ok(data1.sessionId);
  assert.equal(data1.kategoriKode, 'logika');
  assert.equal(data1.questions.length, 10);

  // 3. Finish category 'logika'
  const finishRes = await request(app).post('/api/quiz/finish').send({
    sessionId: data1.sessionId,
    answers: data1.questions.map(q => ({
      questionId: q.id,
      chosenOption: 'A',
      timeSpentMs: 2000
    }))
  });
  assert.equal(finishRes.status, 200);
  assert.equal(finishRes.body.success, true);
  assert.equal(finishRes.body.data.participantStatus.completedCategories.length, 1);

  // 4. GET /api/participant/:id
  const partRes = await request(app).get(`/api/participant/${data1.participantId}`);
  assert.equal(partRes.status, 200);
  assert.equal(partRes.body.data.completedCategories.length, 1);
  assert.equal(partRes.body.data.availableCategories.length, 2);

  // 5. Start next category ('stis') using existing participantId
  const start2 = await request(app).post('/api/quiz/start').send({
    participantId: data1.participantId,
    kategoriKode: 'stis'
  });
  assert.equal(start2.status, 200);
  assert.equal(start2.body.data.kategoriKode, 'stis');

  // 6. Test Leaderboard with query parameter
  const lbAll = await request(app).get('/api/leaderboard?kategori=all');
  assert.equal(lbAll.status, 200);
  assert.equal(lbAll.body.data.currentCategory, 'all');

  const lbLogika = await request(app).get('/api/leaderboard?kategori=logika');
  assert.equal(lbLogika.status, 200);
  assert.equal(lbLogika.body.data.currentCategory, 'logika');

  // 7. GET /api/admin/export-csv
  const exportRes = await request(app).get('/api/admin/export-csv?token=bps-stis-2026');
  assert.equal(exportRes.status, 200);
  assert.ok(exportRes.text.includes('Rian Dwi'));
  assert.ok(exportRes.text.includes('SMAN 3 Semarang'));

  // 8. GET /api/admin/overview (Unauthorized & Authorized)
  const unauthRes = await request(app).get('/api/admin/overview?token=salah');
  assert.equal(unauthRes.status, 401);

  const overviewRes = await request(app).get('/api/admin/overview?token=bps-stis-2026');
  assert.equal(overviewRes.status, 200);
  assert.equal(overviewRes.body.success, true);
  assert.equal(overviewRes.body.data.summary.totalPeserta, 1);
  assert.equal(overviewRes.body.data.summary.totalSelesaiSesi, 1);
  assert.equal(overviewRes.body.data.questionBank.total, 300);
  assert.equal(overviewRes.body.data.schools.length, 1);
  assert.equal(overviewRes.body.data.schools[0].sekolah, 'SMAN 3 Semarang');
  assert.equal(overviewRes.body.data.participants[0].nama, 'Rian Dwi');
  assert.equal(overviewRes.body.data.participants[0].categoriesFinished, 1);

  // 9. GET /admin.html static page
  const adminPage = await request(app).get('/admin.html');
  assert.equal(adminPage.status, 200);
  assert.ok(adminPage.text.includes('Panel Operator Booth'));
});
