const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app } = require('../src/server');
const db = require('../src/db');

test('API Tests: health, start, finish, leaderboard, export', async () => {
  db._resetMemoryStore();

  // 1. GET /api/health
  const healthRes = await request(app).get('/api/health');
  assert.equal(healthRes.status, 200);
  assert.equal(healthRes.body.status, 'ok');

  // 2. POST /api/quiz/start (validasi input kosong)
  const invalidStart = await request(app).post('/api/quiz/start').send({});
  assert.equal(invalidStart.status, 400);

  // 3. POST /api/quiz/start (sukses)
  const startRes = await request(app).post('/api/quiz/start').send({
    nama: 'Rian Dwi',
    sekolah: 'sma negeri 3 semarang',
    wa: '08198765432'
  });
  assert.equal(startRes.status, 200);
  assert.equal(startRes.body.success, true);
  const session = startRes.body.data;
  assert.ok(session.sessionId);
  assert.equal(session.participant.nama, 'Rian Dwi');
  assert.equal(session.participant.sekolah, 'SMAN 3 Semarang');
  assert.equal(session.questions.length, 10);

  // 4. POST /api/quiz/finish
  const finishRes = await request(app).post('/api/quiz/finish').send({
    sessionId: session.sessionId,
    answers: session.questions.map(q => ({
      questionId: q.id,
      chosenOption: 'A',
      timeSpentMs: 2500
    }))
  });
  assert.equal(finishRes.status, 200);
  assert.equal(finishRes.body.success, true);
  assert.ok(finishRes.body.data.finalScore >= 0);
  assert.ok(finishRes.body.data.badge.title);

  // 5. GET /api/leaderboard
  const lbRes = await request(app).get('/api/leaderboard');
  assert.equal(lbRes.status, 200);
  assert.equal(lbRes.body.success, true);
  assert.equal(lbRes.body.data.topPlayers.length, 1);
  assert.equal(lbRes.body.data.topSchools.length, 1);
  assert.equal(lbRes.body.data.topSchools[0].sekolah, 'SMAN 3 Semarang');

  // 6. GET /api/admin/export-csv
  const exportRes = await request(app).get('/api/admin/export-csv?token=bps-stis-2026');
  assert.equal(exportRes.status, 200);
  assert.ok(exportRes.text.includes('Rian Dwi'));
  assert.ok(exportRes.text.includes('SMAN 3 Semarang'));
});
