const fs = require('fs');
const path = require('path');

// 1. Load original 90 foundation questions
const existing = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/questions.json'), 'utf8'));
const existingLogika = existing.filter(q => q.kategori_kode === 'logika'); // 30
const existingData = existing.filter(q => q.kategori_kode === 'data');     // 30
const existingStis = existing.filter(q => q.kategori_kode === 'stis');     // 30

// 2. Load 70 new questions for each
const newLogika = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions_logika_70.json'), 'utf8'));
const newData = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions_data_70.json'), 'utf8'));
const newStis = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions_stis_70.json'), 'utf8'));

console.log(`Original: ${existingLogika.length} Logika, ${existingData.length} Data, ${existingStis.length} STIS`);
console.log(`New: ${newLogika.length} Logika, ${newData.length} Data, ${newStis.length} STIS`);

function balanceCategory(questions, targetPerKey = 25) {
  const keysList = ['A', 'B', 'C', 'D'];
  const counts = { A: 0, B: 0, C: 0, D: 0 };

  questions.forEach(q => {
    const currentKey = q.kunci;
    const correctText = q.opsi[currentKey];

    // Find key with biggest deficit
    let bestTarget = currentKey;
    let maxDeficit = -999;
    for (const k of keysList) {
      const deficit = targetPerKey - counts[k];
      if (deficit > maxDeficit) {
        maxDeficit = deficit;
        bestTarget = k;
      }
    }

    if (bestTarget !== currentKey) {
      const targetText = q.opsi[bestTarget];
      q.opsi[bestTarget] = correctText;
      q.opsi[currentKey] = targetText;
      q.kunci = bestTarget;
    }

    counts[q.kunci]++;
  });

  return counts;
}

// Prepare combined categories
const fullLogika = [...existingLogika, ...newLogika].map((q, idx) => ({
  id: idx + 1,
  kategori_kode: 'logika',
  kategori_label: 'The Logic Master',
  pertanyaan: q.pertanyaan,
  opsi: { ...q.opsi },
  kunci: q.kunci,
  penjelasan: q.penjelasan
}));

const fullData = [...existingData, ...newData].map((q, idx) => ({
  id: 101 + idx,
  kategori_kode: 'data',
  kategori_label: 'Detektif Data BPS',
  pertanyaan: q.pertanyaan,
  opsi: { ...q.opsi },
  kunci: q.kunci,
  penjelasan: q.penjelasan
}));

const fullStis = [...existingStis, ...newStis].map((q, idx) => ({
  id: 201 + idx,
  kategori_kode: 'stis',
  kategori_label: 'Pejuang STIS',
  pertanyaan: q.pertanyaan,
  opsi: { ...q.opsi },
  kunci: q.kunci,
  penjelasan: q.penjelasan
}));

// Balance each category
const countsLogika = balanceCategory(fullLogika, 25);
const countsData = balanceCategory(fullData, 25);
const countsStis = balanceCategory(fullStis, 25);

console.log('Logika Key Distribution:', countsLogika);
console.log('Data BPS Key Distribution:', countsData);
console.log('STIS Key Distribution:', countsStis);

const all300 = [...fullLogika, ...fullData, ...fullStis];
console.log(`Total questions compiled: ${all300.length}`);

// Write to src/data/questions.json
const targetFile = path.join(__dirname, '../src/data/questions.json');
fs.writeFileSync(targetFile, JSON.stringify(all300, null, 2), 'utf8');
console.log(`Saved 300 questions to ${targetFile}`);
