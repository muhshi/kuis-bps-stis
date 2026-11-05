// State Management
const state = {
  sessionId: null,
  participant: null,
  questions: [],
  currentIndex: 0,
  answers: [], // { questionId, chosenOption, timeSpentMs }
  timerInterval: null,
  questionStartTime: null,
  maxTimeMs: 15000,
  answeredCurrent: false
};

// DOM Elements
const screenReg = document.getElementById('screen-reg');
const screenQuiz = document.getElementById('screen-quiz');
const screenResult = document.getElementById('screen-result');

const formRegister = document.getElementById('form-register');
const inputNama = document.getElementById('input-nama');
const inputSekolah = document.getElementById('input-sekolah');
const inputWa = document.getElementById('input-wa');
const btnStart = document.getElementById('btn-start');

const catPill = document.getElementById('cat-pill');
const timerText = document.getElementById('timer-text');
const timerBar = document.getElementById('timer-bar');
const qCounter = document.getElementById('q-counter');
const qText = document.getElementById('q-text');
const optTextA = document.getElementById('opt-text-a');
const optTextB = document.getElementById('opt-text-b');
const optTextC = document.getElementById('opt-text-c');
const optTextD = document.getElementById('opt-text-d');
const optButtons = document.querySelectorAll('.opt-btn');

const feedbackSheet = document.getElementById('feedback-sheet');
const fbStatus = document.getElementById('fb-status');
const fbScore = document.getElementById('fb-score');
const fbExplanation = document.getElementById('fb-explanation');
const btnNextQuestion = document.getElementById('btn-next-question');

const resTrophy = document.getElementById('res-trophy');
const resScore = document.getElementById('res-score');
const resNameSchool = document.getElementById('res-name-school');
const badgeTitle = document.getElementById('badge-title');
const badgeSub = document.getElementById('badge-sub');
const resCorrect = document.getElementById('res-correct');
const resTime = document.getElementById('res-time');
const btnPlayAgain = document.getElementById('btn-play-again');
const offlineRetryBox = document.getElementById('offline-retry-box');
const btnRetrySubmit = document.getElementById('btn-retry-submit');

// 1. REGISTRATION HANDLER
formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  window.soundFX.unlock(); // Unlock Web Audio API on first user gesture

  const nama = inputNama.value.trim();
  const sekolah = inputSekolah.value.trim();
  const wa = inputWa.value.trim();

  if (!nama || !sekolah) return;

  btnStart.disabled = true;
  btnStart.textContent = 'Menyiapkan 10 Soal...';

  try {
    const res = await fetch('/api/quiz/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, sekolah, wa })
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal memulai kuis');

    state.sessionId = json.data.sessionId;
    state.participant = json.data.participant;
    state.questions = json.data.questions;
    state.currentIndex = 0;
    state.answers = [];

    // Switch to Quiz Screen
    screenReg.classList.add('hidden');
    screenQuiz.classList.remove('hidden');

    startCurrentQuestion();
  } catch (err) {
    alert('Koneksi terganggu: ' + err.message);
  } finally {
    btnStart.disabled = false;
    btnStart.textContent = '🚀 Mulai Kuis Sekarang (10 Soal)';
  }
});

// 2. QUESTION RENDER & TIMER LOOP
function startCurrentQuestion() {
  if (state.currentIndex >= state.questions.length) {
    finishQuizGame();
    return;
  }

  const q = state.questions[state.currentIndex];
  state.answeredCurrent = false;
  state.questionStartTime = Date.now();

  // Update UI texts
  catPill.textContent = getCategoryBadge(q.kategori_kode);
  qCounter.textContent = `Soal ${state.currentIndex + 1} dari ${state.questions.length}`;
  qText.textContent = q.pertanyaan;

  optTextA.textContent = q.opsi.A;
  optTextB.textContent = q.opsi.B;
  optTextC.textContent = q.opsi.C;
  optTextD.textContent = q.opsi.D;

  optButtons.forEach(btn => {
    btn.classList.remove('disabled');
    btn.style.opacity = '1';
    btn.style.filter = 'none';
  });

  feedbackSheet.classList.remove('open');

  // Reset & start 15s timer
  clearInterval(state.timerInterval);
  renderTimer(state.maxTimeMs);

  state.timerInterval = setInterval(() => {
    const elapsed = Date.now() - state.questionStartTime;
    const remaining = Math.max(0, state.maxTimeMs - elapsed);
    renderTimer(remaining);

    if (remaining <= 4000 && remaining > 0) {
      window.soundFX.playUrgentTick();
    }

    if (remaining <= 0) {
      clearInterval(state.timerInterval);
      handleOptionSelected(null); // Timeout (unanswered)
    }
  }, 100);
}

function renderTimer(remainingMs) {
  const seconds = Math.ceil(remainingMs / 1000);
  timerText.textContent = `${seconds}s`;

  const percent = (remainingMs / state.maxTimeMs) * 100;
  timerBar.style.width = `${percent}%`;

  if (percent > 45) {
    timerBar.style.backgroundColor = '#38bdf8'; // Blue
  } else if (percent > 20) {
    timerBar.style.backgroundColor = '#f59e0b'; // Yellow
  } else {
    timerBar.style.backgroundColor = '#ef4444'; // Red
  }
}

function getCategoryBadge(catCode) {
  if (catCode === 'logika') return '⚡ The Logic Master';
  if (catCode === 'data') return '📊 Detektif Data BPS';
  if (catCode === 'stis') return '🎓 Pejuang STIS';
  return '❓ Kuis BPS';
}

// 3. OPTION CLICK HANDLER
optButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (state.answeredCurrent) return;
    const chosen = btn.getAttribute('data-opt');
    handleOptionSelected(chosen, btn);
  });
});

function handleOptionSelected(chosenOpt, chosenBtn = null) {
  if (state.answeredCurrent) return;
  state.answeredCurrent = true;
  clearInterval(state.timerInterval);

  const timeSpentMs = Math.min(state.maxTimeMs, Date.now() - state.questionStartTime);
  const q = state.questions[state.currentIndex];

  state.answers.push({
    questionId: q.id,
    chosenOption: chosenOpt || '',
    timeSpentMs
  });

  optButtons.forEach(b => b.classList.add('disabled'));

  if (chosenBtn) {
    chosenBtn.style.filter = 'brightness(1.25)';
  }

  // Play sound
  if (chosenOpt) {
    window.soundFX.playCorrect();
  } else {
    window.soundFX.playWrong();
  }

  // Show Quick Feedback Bottom Sheet
  fbStatus.textContent = chosenOpt ? `Jawabanmu [${chosenOpt}] Tercatat!` : `⏰ Waktu Habis!`;
  fbScore.textContent = `${(timeSpentMs / 1000).toFixed(1)}s`;
  fbExplanation.textContent = `Jawaban sedang dienkripsi. Pembahasan lengkap & skor akhir akan muncul di layar hasil!`;

  feedbackSheet.classList.add('open');
}

btnNextQuestion.addEventListener('click', () => {
  state.currentIndex++;
  startCurrentQuestion();
});

// 4. FINISH GAME & SUBMISSION (WITH RETRY QUEUE)
async function finishQuizGame() {
  screenQuiz.classList.add('hidden');
  screenResult.classList.remove('hidden');

  resScore.textContent = 'Menghitung Skor...';
  resTrophy.textContent = '⏳';

  submitFinalResult();
}

async function submitFinalResult() {
  try {
    offlineRetryBox.classList.add('hidden');

    const res = await fetch('/api/quiz/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: state.sessionId,
        answers: state.answers
      })
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal mengirim hasil');

    const result = json.data;

    // Render Victory UI
    window.soundFX.playVictory();
    resTrophy.textContent = result.badge.icon || '🏆';
    resScore.textContent = result.finalScore.toLocaleString('id-ID');
    resNameSchool.textContent = `${result.participant.nama} • ${result.participant.sekolah}`;
    badgeTitle.textContent = result.badge.title;
    badgeSub.textContent = result.badge.subtitle;
    resCorrect.textContent = `${result.correctCount} / ${result.totalQuestions}`;
    resTime.textContent = `${(result.totalTimeMs / 1000).toFixed(1)}s`;

  } catch (err) {
    console.warn('Gagal submit ke server (koneksi offline?):', err.message);
    offlineRetryBox.classList.remove('hidden');
    resScore.textContent = 'Tersimpan Offline';
    resTrophy.textContent = '📡';
    badgeTitle.textContent = 'Menunggu Koneksi...';
    badgeSub.textContent = 'Klik tombol merah di bawah untuk mengirim ulang ke papan TV!';
  }
}

btnRetrySubmit.addEventListener('click', () => {
  submitFinalResult();
});

btnPlayAgain.addEventListener('click', () => {
  // Reset state
  state.sessionId = null;
  state.answers = [];
  state.currentIndex = 0;

  // Clear form
  inputNama.value = '';
  inputWa.value = '';

  screenResult.classList.add('hidden');
  screenReg.classList.remove('hidden');
});
