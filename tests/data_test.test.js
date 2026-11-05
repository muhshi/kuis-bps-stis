const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { normalizeSchoolName } = require('../src/utils/schoolNormalizer');
const { sanitizeNickname } = require('../src/utils/profanity');

test('Validasi Bank Soal: format dan kelengkapan data', (t) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/questions.json'), 'utf8'));
  assert.equal(data.length, 90, 'Bank soal harus berisi 90 butir soal');

  const categories = { logika: 0, data: 0, stis: 0 };
  const validKeys = new Set(['A', 'B', 'C', 'D']);

  data.forEach((q) => {
    assert.ok(q.id > 0, `ID harus angka positif: ${q.id}`);
    assert.ok(['logika', 'data', 'stis'].includes(q.kategori_kode), `Kategori tidak valid: ${q.kategori_kode}`);
    assert.ok(q.pertanyaan && q.pertanyaan.length > 5, `Pertanyaan tidak boleh kosong (id ${q.id})`);
    assert.ok(q.opsi.A && q.opsi.B && q.opsi.C && q.opsi.D, `Semua opsi A, B, C, D harus terisi (id ${q.id})`);
    assert.ok(validKeys.has(q.kunci), `Kunci jawaban harus A, B, C, atau D: got ${q.kunci} (id ${q.id})`);
    assert.ok(q.penjelasan && q.penjelasan.length > 5, `Penjelasan harus ada (id ${q.id})`);

    categories[q.kategori_kode]++;
  });

  assert.equal(categories.logika, 30);
  assert.equal(categories.data, 30);
  assert.equal(categories.stis, 30);
});

test('Validasi School Normalizer: normalisasi variasi penulisan sekolah', (t) => {
  assert.equal(normalizeSchoolName('sma negeri 1 semarang'), 'SMAN 1 Semarang');
  assert.equal(normalizeSchoolName('SMA N 1 SEMARANG'), 'SMAN 1 Semarang');
  assert.equal(normalizeSchoolName('sman1 semarang'), 'SMAN 1 Semarang');
  assert.equal(normalizeSchoolName('smk negeri 2 kudus'), 'SMKN 2 Kudus');
  assert.equal(normalizeSchoolName('smkn2 kudus'), 'SMKN 2 Kudus');
  assert.equal(normalizeSchoolName('man 1 medan'), 'MAN 1 Medan');
  assert.equal(normalizeSchoolName(''), 'Sekolah Lainnya');
  assert.equal(normalizeSchoolName(null), 'Sekolah Lainnya');
});

test('Validasi Profanity Sanitizer: filter kata kotor & batasan panjang nama', (t) => {
  assert.equal(sanitizeNickname('Budi Santoso'), 'Budi Santoso');
  assert.equal(sanitizeNickname('Budi anjing nakal'), 'Budi *** nakal');
  assert.equal(sanitizeNickname(''), 'Siswa BPS');
  assert.equal(sanitizeNickname(null), 'Siswa BPS');
  const longName = 'NamaSangatPanjangSekaliLebihDari25Karakter';
  assert.ok(sanitizeNickname(longName).length <= 25);
});
