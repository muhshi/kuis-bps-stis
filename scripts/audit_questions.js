const questions = require('../src/data/questions.json');

const fromId = parseInt(process.argv[2] || 1, 10);
const toId = parseInt(process.argv[3] || 30, 10);

const selected = questions.filter(q => q.id >= fromId && q.id <= toId);

selected.forEach(q => {
  console.log(`[${q.id}] [${q.kategori_kode}] ${q.pertanyaan}`);
  console.log(`    A: ${q.opsi.A}`);
  console.log(`    B: ${q.opsi.B}`);
  console.log(`    C: ${q.opsi.C}`);
  console.log(`    D: ${q.opsi.D}`);
  console.log(`    KUNCI: [${q.kunci}] -> ${q.opsi[q.kunci]}`);
  console.log(`    PENJELASAN: ${q.penjelasan}`);
  console.log('--------------------------------------------------');
});
