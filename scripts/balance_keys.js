const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/questions.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Target distribution: 90 questions / 4 options ≈ 22 or 23 each
const targetDistribution = { A: 23, B: 23, C: 22, D: 22 };
const currentCounts = { A: 0, B: 0, C: 0, D: 0 };
const keysList = ['A', 'B', 'C', 'D'];

// We want to reassign the position of the correct answer for questions where possible
questions.forEach((q, idx) => {
  const currentKey = q.kunci;
  const correctText = q.opsi[currentKey];

  // Find which target key currently has the biggest deficit
  let bestTarget = currentKey;
  let maxDeficit = -999;

  for (const k of keysList) {
    const deficit = targetDistribution[k] - currentCounts[k];
    if (deficit > maxDeficit) {
      maxDeficit = deficit;
      bestTarget = k;
    }
  }

  if (bestTarget !== currentKey) {
    // Swap options: swap the text of currentKey with bestTarget
    const targetText = q.opsi[bestTarget];
    q.opsi[bestTarget] = correctText;
    q.opsi[currentKey] = targetText;
    q.kunci = bestTarget;
  }

  currentCounts[q.kunci]++;
});

console.log('Balanced Key Counts:', currentCounts);
fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');
console.log('Successfully updated questions.json with balanced keys!');
