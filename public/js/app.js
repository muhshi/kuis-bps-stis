// Client State
const state = {
  participantId: localStorage.getItem('bps_participant_id') || null,
  participant: JSON.parse(localStorage.getItem('bps_participant_info') || 'null'),
  participantStatus: null,
  currentCategory: null,
  sessionId: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  timerInterval: null,
  questionStartTime: null,
  maxTimeMs: 15000,
  answeredCurrent: false
};

// Check URL query parameters (e.g. ?kategori=logika from specific QR Code)
const urlParams = new URLSearchParams(window.location.search);
const preselectedCategory = urlParams.get('kategori');

// DOM Elements
const screenReg = document.getElementById('screen-reg');
const screenCategory = document.getElementById('screen-category');
const screenQuiz = document.getElementById('screen-quiz');
const screenResult = document.getElementById('screen-result');
const modalLeaderboard = document.getElementById('modal-leaderboard');

const btnThemeToggle = document.getElementById('btn-theme-toggle');

const formRegister = document.getElementById('form-register');
const inputNama = document.getElementById('input-nama');
const inputSekolah = document.getElementById('input-sekolah');
const inputWa = document.getElementById('input-wa');
const btnStart = document.getElementById('btn-start');

// Category Screen DOM
const catWelcomeTitle = document.getElementById('cat-welcome-title');
const catWelcomeSub = document.getElementById('cat-welcome-sub');
const bannerGrandScore = document.getElementById('banner-grand-score');
const bannerProgress = document.getElementById('banner-progress');
const catCards = document.querySelectorAll('.cat-card');
const badgeCatLogika = document.getElementById('badge-cat-logika');
const badgeCatData = document.getElementById('badge-cat-data');
const badgeCatStis = document.getElementById('badge-cat-stis');
const btnLogout = document.getElementById('btn-logout');
const btnViewLbFromCat = document.getElementById('btn-view-lb-from-cat');

// Quiz Screen DOM
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

// Result Screen DOM
const resTrophy = document.getElementById('res-trophy');
const resCatLabel = document.getElementById('res-cat-label');
const resScore = document.getElementById('res-score');
const resNameSchool = document.getElementById('res-name-school');
const badgeTitle = document.getElementById('badge-title');
const badgeSub = document.getElementById('badge-sub');
const resCorrect = document.getElementById('res-correct');
const resCumulative = document.getElementById('res-cumulative');
const offlineRetryBox = document.getElementById('offline-retry-box');
const btnRetrySubmit = document.getElementById('btn-retry-submit');
const btnNextCategory = document.getElementById('btn-next-category');
const btnBackToMenu = document.getElementById('btn-back-to-menu');
const btnViewLbFromRes = document.getElementById('btn-view-lb-from-res');

// Mobile Leaderboard Modal DOM
const btnCloseModalLb = document.getElementById('btn-close-modal-lb');
const mobileLbList = document.getElementById('mobile-lb-list');
const mobileCatPills = document.querySelectorAll('.mobile-cat-pill');
let currentModalCat = 'all';

// ==========================================
// 1. THEME MANAGEMENT (Light / Dark Mode)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('bps_theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Default light mode unless user saved dark or system prefers dark
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    btnThemeToggle.textContent = '☀️';
    btnThemeToggle.title = 'Beralih ke Mode Terang';
  } else {
    document.body.classList.remove('dark-mode');
    btnThemeToggle.textContent = '🌙';
    btnThemeToggle.title = 'Beralih ke Mode Gelap';
  }
  localStorage.setItem('bps_theme', theme);
}

btnThemeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  applyTheme(isDark ? 'light' : 'dark');
});

// Initialize on load
initTheme();
window.addEventListener('DOMContentLoaded', () => {
  if (state.participantId && state.participant) {
    showCategoryScreen();
  }
});

// ==========================================
// 2. REGISTRATION HANDLER
// ==========================================
formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  window.soundFX.unlock();

  const nama = inputNama.value.trim();
  const sekolah = inputSekolah.value.trim();
  const wa = inputWa.value.trim();

  if (!nama || !sekolah) return;

  btnStart.disabled = true;
  btnStart.textContent = 'Memproses...';

  try {
    const targetCat = preselectedCategory || 'logika';
    const res = await fetch('/api/quiz/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, sekolah, wa, kategoriKode: targetCat })
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal registrasi');

    state.participantId = json.data.participantId;
    state.participant = json.data.participant;

    localStorage.setItem('bps_participant_id', state.participantId);
    localStorage.setItem('bps_participant_info', JSON.stringify(state.participant));

    if (preselectedCategory) {
      startQuizWithData(json.data);
    } else {
      await refreshParticipantStatus();
      screenReg.classList.add('hidden');
      screenCategory.classList.remove('hidden');
    }
  } catch (err) {
    alert('Koneksi terganggu: ' + err.message);
  } finally {
    btnStart.disabled = false;
    btnStart.textContent = 'Masuk ke Menu Kategori ➔';
  }
});

// ==========================================
// 3. CATEGORY SCREEN LOGIC
// ==========================================
async function showCategoryScreen() {
  screenReg.classList.add('hidden');
  screenQuiz.classList.add('hidden');
  screenResult.classList.add('hidden');
  screenCategory.classList.remove('hidden');

  await refreshParticipantStatus();
}

async function refreshParticipantStatus() {
  if (!state.participantId) return;

  try {
    const res = await fetch(`/api/participant/${state.participantId}`);
    const json = await res.json();
    if (json.success) {
      state.participantStatus = json.data;
      renderCategoryScreen(json.data);
    }
  } catch (err) {
    console.warn('Gagal memuat status peserta:', err.message);
  }
}

function renderCategoryScreen(status) {
  catWelcomeTitle.textContent = `Halo, ${status.participant.nama}!`;
  catWelcomeSub.textContent = `Asal: ${status.participant.sekolah} • Pilih kategori yang ingin kamu kerjakan:`;

  bannerGrandScore.textContent = `${status.totalScore.toLocaleString('id-ID')} Poin`;
  bannerProgress.textContent = `${status.completedCategories.length}/3 Selesai`;

  const completedMap = new Map();
  status.completedCategories.forEach(c => completedMap.set(c.kategori_kode, c.total_score));

  updateCatCard('logika', completedMap.get('logika'), badgeCatLogika);
  updateCatCard('data', completedMap.get('data'), badgeCatData);
  updateCatCard('stis', completedMap.get('stis'), badgeCatStis);
}

function updateCatCard(catCode, score, badgeEl) {
  const card = document.getElementById(`card-cat-${catCode}`);
  if (score !== undefined) {
    card.classList.add('done');
    badgeEl.textContent = `✅ SELESAI (${score.toLocaleString('id-ID')} Poin)`;
  } else {
    card.classList.remove('done');
    if (catCode === 'logika') badgeEl.textContent = '10 Soal • Asah Nalar';
    if (catCode === 'data') badgeEl.textContent = '10 Soal • Fakta BPS';
    if (catCode === 'stis') badgeEl.textContent = '10 Soal • Kedinasan';
  }
}

catCards.forEach(card => {
  card.addEventListener('click', async () => {
    window.soundFX.unlock();
    const cat = card.getAttribute('data-cat');

    if (card.classList.contains('done')) {
      alert(`Kategori ini sudah selesai kamu kerjakan! Silakan pilih kategori yang lain untuk menambah total skormu.`);
      return;
    }

    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: state.participantId,
          kategoriKode: cat
        })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Gagal memulai kategori');

      startQuizWithData(json.data);
    } catch (err) {
      alert(err.message);
    }
  });
});

btnLogout.addEventListener('click', () => {
  if (confirm('Yakin ingin ganti peserta? (Data skormu tetap aman tersimpan di leaderboard)')) {
    localStorage.removeItem('bps_participant_id');
    localStorage.removeItem('bps_participant_info');
    state.participantId = null;
    state.participant = null;
    state.participantStatus = null;

    screenCategory.classList.add('hidden');
    screenReg.classList.remove('hidden');
  }
});

// ==========================================
// 4. QUIZ GAMEPLAY
// ==========================================
function startQuizWithData(data) {
  state.sessionId = data.sessionId;
  state.currentCategory = data.kategoriKode;
  state.questions = data.questions;
  state.currentIndex = 0;
  state.answers = [];

  screenReg.classList.add('hidden');
  screenCategory.classList.add('hidden');
  screenResult.classList.add('hidden');
  screenQuiz.classList.remove('hidden');

  startCurrentQuestion();
}

function startCurrentQuestion() {
  if (state.currentIndex >= state.questions.length) {
    finishQuizGame();
    return;
  }

  const q = state.questions[state.currentIndex];
  state.answeredCurrent = false;
  state.questionStartTime = Date.now();

  catPill.textContent = getCategoryBadge(state.currentCategory);
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
      handleOptionSelected(null);
    }
  }, 100);
}

function renderTimer(remainingMs) {
  const seconds = Math.ceil(remainingMs / 1000);
  timerText.textContent = `${seconds}s`;

  const percent = (remainingMs / state.maxTimeMs) * 100;
  timerBar.style.width = `${percent}%`;

  if (percent > 45) {
    timerBar.style.backgroundColor = '#0284c7';
  } else if (percent > 20) {
    timerBar.style.backgroundColor = '#f59e0b';
  } else {
    timerBar.style.backgroundColor = '#ef4444';
  }
}

function getCategoryBadge(catCode) {
  if (catCode === 'logika') return '⚡ The Logic Master';
  if (catCode === 'data') return '📊 Detektif Data BPS';
  if (catCode === 'stis') return '🎓 Pejuang STIS';
  return '❓ Kuis BPS';
}

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

  if (chosenOpt) {
    window.soundFX.playCorrect();
  } else {
    window.soundFX.playWrong();
  }

  fbStatus.textContent = chosenOpt ? `Jawabanmu [${chosenOpt}] Tercatat!` : `⏰ Waktu Habis!`;
  fbScore.textContent = `${(timeSpentMs / 1000).toFixed(1)}s`;
  fbExplanation.textContent = `Jawaban terenkripsi. Pembahasan lengkap & skor akhir akan muncul di layar hasil!`;

  feedbackSheet.classList.add('open');
}

btnNextQuestion.addEventListener('click', () => {
  state.currentIndex++;
  startCurrentQuestion();
});

// ==========================================
// 5. FINISH CATEGORY & SUBMIT
// ==========================================
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
    state.participantStatus = result.participantStatus;

    window.soundFX.playVictory();
    resTrophy.textContent = result.badge.icon || '🏆';
    resCatLabel.textContent = `HASIL KATEGORI ${getCategoryBadge(result.kategoriKode).toUpperCase()}`;
    resScore.textContent = `+${result.categoryScore.toLocaleString('id-ID')}`;
    resNameSchool.textContent = `${state.participant.nama} • ${state.participant.sekolah}`;
    badgeTitle.textContent = result.badge.title;
    badgeSub.textContent = result.badge.subtitle;
    resCorrect.textContent = `${result.correctCount} / ${result.totalQuestions}`;
    resCumulative.textContent = `${(result.participantStatus.totalScore || result.categoryScore).toLocaleString('id-ID')} Poin`;

    const remainingCount = result.participantStatus.availableCategories.length;
    if (remainingCount > 0) {
      btnNextCategory.textContent = `🔥 Tantang Kategori Lain (${remainingCount} Tersisa)`;
      btnNextCategory.classList.remove('hidden');
    } else {
      btnNextCategory.textContent = `🎉 Semua 3 Kategori Tuntas! Kamu Juara Sejati!`;
      btnNextCategory.classList.add('hidden');
    }

  } catch (err) {
    console.warn('Gagal submit ke server:', err.message);
    offlineRetryBox.classList.remove('hidden');
    resScore.textContent = 'Tersimpan Offline';
    resTrophy.textContent = '📡';
    badgeTitle.textContent = 'Menunggu Koneksi...';
    badgeSub.textContent = 'Klik tombol merah untuk mengirim ulang hasil kuis!';
  }
}

btnRetrySubmit.addEventListener('click', () => {
  submitFinalResult();
});

btnNextCategory.addEventListener('click', () => {
  showCategoryScreen();
});

btnBackToMenu.addEventListener('click', () => {
  showCategoryScreen();
});

// ==========================================
// 6. MOBILE LEADERBOARD MODAL
// ==========================================
btnViewLbFromCat.addEventListener('click', () => openLeaderboardModal('all'));
btnViewLbFromRes.addEventListener('click', () => openLeaderboardModal('all'));
btnCloseModalLb.addEventListener('click', () => {
  modalLeaderboard.classList.add('hidden');
});

mobileCatPills.forEach(pill => {
  pill.addEventListener('click', () => {
    currentModalCat = pill.getAttribute('data-cat');
    mobileCatPills.forEach(p => {
      if (p.getAttribute('data-cat') === currentModalCat) {
        p.style.background = '#0284c7';
        p.style.color = '#fff';
      } else {
        p.style.background = 'var(--inner-card)';
        p.style.color = 'var(--text-main)';
      }
    });
    fetchMobileLeaderboard(currentModalCat);
  });
});

async function openLeaderboardModal(cat = 'all') {
  currentModalCat = cat;
  modalLeaderboard.classList.remove('hidden');
  await fetchMobileLeaderboard(currentModalCat);
}

async function fetchMobileLeaderboard(cat) {
  mobileLbList.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted);">Memuat peringkat...</div>`;

  try {
    const res = await fetch(`/api/leaderboard?kategori=${cat}&t=${Date.now()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    const players = json.data.topPlayers || [];
    if (players.length === 0) {
      mobileLbList.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted);">Belum ada peserta di kategori ini.</div>`;
      return;
    }

    mobileLbList.innerHTML = players.map(p => {
      const isMe = state.participant && p.nama.toLowerCase() === state.participant.nama.toLowerCase();
      const medal = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`;

      return `
        <div class="mobile-lb-row ${isMe ? 'my-rank' : ''}">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="font-weight: 900; font-size: 1rem; min-width: 28px;">${medal}</div>
            <div>
              <div style="font-weight: 700; color: var(--text-main);">${escapeHtml(p.nama)} ${isMe ? '⭐ (Kamu)' : ''}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(p.sekolah)} • ${p.badgeTitle || ''}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 900; color: #0284c7; font-size: 0.98rem;">${p.totalScore.toLocaleString('id-ID')}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${p.totalTimeSeconds}s</div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    mobileLbList.innerHTML = `<div style="text-align: center; padding: 24px; color: #ef4444;">Gagal memuat: ${err.message}</div>`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}
