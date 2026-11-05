// ==========================================================================
// TV LEADERBOARD SCRIPT (1080p Expo Booth Edition)
// ==========================================================================

const playersList = document.getElementById('players-list');
const schoolsList = document.getElementById('schools-list');
const statsTotalPeserta = document.getElementById('stats-total-peserta');
const statsTotalSekolah = document.getElementById('stats-total-sekolah');
const liveIndicator = document.getElementById('live-indicator');
const liveText = document.getElementById('live-text');
const tvClock = document.getElementById('tv-clock');
const tvDomainHint = document.getElementById('tv-domain-hint');
const tvBoardTitle = document.getElementById('tv-board-title');
const tvBoardSub = document.getElementById('tv-board-sub');
const tvBoardTag = document.getElementById('tv-board-tag');
const tvTabs = document.querySelectorAll('.tv-tab');
const tvCycleBox = document.getElementById('tv-cycle-box');
const cycleLabel = document.getElementById('cycle-label');
const btnToggleCycle = document.getElementById('btn-toggle-cycle');
const tvQrImg = document.getElementById('tv-qr-img');

let currentCategory = 'all';
const categoryOrder = ['all', 'logika', 'data', 'stis'];
let cycleIndex = 0;
let isCyclePaused = false;
let cycleSecondsLeft = 10;
const CYCLE_DURATION_SEC = 10;

// Setup domain hint and QR Code with full origin URL
const currentOrigin = window.location.origin || `http://${window.location.host}`;
if (tvDomainHint) {
  tvDomainHint.textContent = currentOrigin;
}
if (tvQrImg) {
  tvQrImg.src = `/api/qrcode?url=${encodeURIComponent(currentOrigin)}`;
}

// ==========================================
// THEME MANAGEMENT (Default is LIGHT MODE)
// ==========================================
function initTvTheme() {
  const savedTheme = localStorage.getItem('bps_tv_theme');
  // Default is LIGHT MODE
  if (savedTheme === 'dark') {
    applyTvTheme('dark');
  } else {
    applyTvTheme('light');
  }
}

function applyTvTheme(theme) {
  const isDark = (theme === 'dark');
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  const tvThemeIcon = document.getElementById('tv-theme-icon');
  const tvThemeLabel = document.getElementById('tv-theme-label');
  const btnTvTheme = document.getElementById('btn-tv-theme');

  if (tvThemeIcon && tvThemeLabel) {
    tvThemeIcon.textContent = isDark ? '🌙' : '☀️';
    tvThemeLabel.textContent = isDark ? 'Mode Gelap' : 'Mode Terang';
  }

  if (btnTvTheme) {
    btnTvTheme.title = isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap';
  }
  localStorage.setItem('bps_tv_theme', theme);
}

const btnTvTheme = document.getElementById('btn-tv-theme');
if (btnTvTheme) {
  btnTvTheme.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    applyTvTheme(isDark ? 'light' : 'dark');
  });
}
initTvTheme();

// 1. Live Clock
function updateClock() {
  const now = new Date();
  tvClock.textContent = now.toLocaleTimeString('id-ID', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
setInterval(updateClock, 1000);
updateClock();

// 2. Screen Wake Lock (Prevents TV screen sleep)
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      await navigator.wakeLock.request('screen');
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
          await navigator.wakeLock.request('screen');
        }
      });
    }
  } catch (err) {
    console.log('[WakeLock] Ignored:', err.message);
  }
}
requestWakeLock();

// 3. Tab Switching Events
tvTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    const targetCat = tab.getAttribute('data-cat');
    if (!targetCat) return;

    currentCategory = targetCat;
    cycleIndex = categoryOrder.indexOf(currentCategory);
    
    // Reset cycle timer on manual click
    cycleSecondsLeft = CYCLE_DURATION_SEC;
    updateActiveTabUI();
    fetchLeaderboard();
  });
});

// Pause / Resume Auto-Cycle toggle
if (tvCycleBox) {
  tvCycleBox.addEventListener('click', () => {
    isCyclePaused = !isCyclePaused;
    if (isCyclePaused) {
      btnToggleCycle.textContent = '▶️';
      cycleLabel.textContent = 'Jeda (Terkunci)';
      tvCycleBox.style.borderColor = '#f59e0b';
    } else {
      btnToggleCycle.textContent = '⏸️';
      cycleSecondsLeft = CYCLE_DURATION_SEC;
      cycleLabel.textContent = `Auto-Cycle: ${cycleSecondsLeft}s`;
      tvCycleBox.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
  });
}

function updateActiveTabUI() {
  tvTabs.forEach(t => {
    if (t.getAttribute('data-cat') === currentCategory) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  if (currentCategory === 'all') {
    tvBoardTitle.textContent = '👑 TOP 10 JUARA UMUM';
    tvBoardSub.textContent = 'Akumulasi Skor Semua Kategori';
    tvBoardTag.textContent = 'Klasemen Utama';
  } else if (currentCategory === 'logika') {
    tvBoardTitle.textContent = '⚡ TOP 10 THE LOGIC MASTER';
    tvBoardSub.textContent = 'Skor Kategori Teka-Teki Logika';
    tvBoardTag.textContent = 'Teka-Teki Cepat';
  } else if (currentCategory === 'data') {
    tvBoardTitle.textContent = '📊 TOP 10 DETEKTIF DATA';
    tvBoardSub.textContent = 'Skor Kategori Fakta Data BPS';
    tvBoardTag.textContent = 'Sensus & Data BPS';
  } else if (currentCategory === 'stis') {
    tvBoardTitle.textContent = '🎓 TOP 10 PEJUANG STIS';
    tvBoardSub.textContent = 'Skor Kategori Politeknik Statistika STIS';
    tvBoardTag.textContent = 'Kedinasan STIS';
  }
}

// 4. Auto-Cycle Timer (every 1 second)
setInterval(() => {
  if (isCyclePaused) return;

  cycleSecondsLeft--;
  if (cycleSecondsLeft <= 0) {
    cycleIndex = (cycleIndex + 1) % categoryOrder.length;
    currentCategory = categoryOrder[cycleIndex];
    cycleSecondsLeft = CYCLE_DURATION_SEC;
    updateActiveTabUI();
    fetchLeaderboard();
  } else {
    cycleLabel.textContent = `Auto-Cycle: ${cycleSecondsLeft}s`;
  }
}, 1000);

// 5. Polling Loop (Fast snapshot polling)
async function fetchLeaderboard() {
  try {
    const res = await fetch(`/api/leaderboard?kategori=${currentCategory}&t=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    renderData(json.data);

    liveIndicator.classList.remove('reconnecting');
    liveText.textContent = 'LIVE UPDATE';
  } catch (err) {
    console.warn('TV Polling hiccup:', err.message);
    liveIndicator.classList.add('reconnecting');
    liveText.textContent = 'MENYAMBUNGKAN...';
  }
}

// 6. Render Data with Rich Placeholders
function renderData(data) {
  const players = data.topPlayers || [];
  const schools = data.topSchools || [];

  // Update Global Participant & School Stats
  const totalP = (data.liveStats && data.liveStats.totalPeserta !== undefined)
    ? data.liveStats.totalPeserta
    : (data.totalParticipants || players.length || 0);

  if (statsTotalPeserta) {
    statsTotalPeserta.textContent = totalP.toLocaleString('id-ID');
  }
  if (statsTotalSekolah) {
    statsTotalSekolah.textContent = (schools.length || 0).toLocaleString('id-ID');
  }

  // --- RENDER TOP 10 PLAYERS (With placeholders for empty slots) ---
  const maxSlots = 10;
  let playersHtml = '';

  for (let i = 0; i < maxSlots; i++) {
    if (i < players.length) {
      const p = players[i];
      const rank = p.rank || (i + 1);
      const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
      const medal = rank === 1 ? '🥇 1' : rank === 2 ? '🥈 2' : rank === 3 ? '🥉 3' : `#${rank}`;
      const badgePill = p.badgeTitle ? ` • ${p.badgeTitle}` : '';

      playersHtml += `
        <div class="lb-row ${rankClass}">
          <div class="lb-rank">${medal}</div>
          <div class="lb-player" title="${escapeHtml(p.nama)}">${escapeHtml(p.nama)}</div>
          <div class="lb-school" title="${escapeHtml(p.sekolah)}">${escapeHtml(p.sekolah)}${badgePill}</div>
          <div class="lb-score">${p.totalScore.toLocaleString('id-ID')}</div>
          <div class="lb-time">${p.totalTimeSeconds}s</div>
        </div>
      `;
    } else {
      // Empty slot placeholder
      const slotRank = `#${i + 1}`;
      const promoText = i === 2 
        ? 'Rebut Posisi 3 Besar!' 
        : i < 5 
        ? 'Slot Masih Terbuka' 
        : 'Scan QR di Booth untuk Masuk TV!';
      
      playersHtml += `
        <div class="lb-row placeholder">
          <div class="lb-rank">${slotRank}</div>
          <div class="lb-player">Menunggu Penantang...</div>
          <div class="lb-school">${promoText}</div>
          <div class="lb-score">-</div>
          <div class="lb-time">-</div>
        </div>
      `;
    }
  }
  playersList.innerHTML = playersHtml;

  // --- RENDER TOP 5 SCHOOL BATTLE (With placeholders) ---
  const maxSchools = 5;
  let schoolsHtml = '';

  for (let s = 0; s < maxSchools; s++) {
    if (s < schools.length) {
      const sc = schools[s];
      const rankNum = s + 1;
      const rankClass = rankNum === 1 ? 'rank-1' : '';
      const rankIcon = rankNum === 1 ? '🏆 #1' : rankNum === 2 ? '🥈 #2' : rankNum === 3 ? '🥉 #3' : `#${rankNum}`;

      const schoolPts = sc.totalPoints !== undefined ? sc.totalPoints : (sc.totalScore || 0);

      schoolsHtml += `
        <div class="school-row ${rankClass}">
          <div>
            <div class="school-name">${rankIcon} ${escapeHtml(sc.sekolah)}</div>
            <div class="school-meta">${sc.pesertaCount} Siswa • Rata-rata ${sc.avgScore.toLocaleString('id-ID')} Poin</div>
          </div>
          <div class="school-score">${schoolPts.toLocaleString('id-ID')} Poin</div>
        </div>
      `;
    } else {
      const slotRank = `#${s + 1}`;
      const schoolPromo = s === 0 
        ? 'Belum ada sekolah yang masuk klasemen' 
        : 'Harumkan nama sekolahmu di sini!';

      schoolsHtml += `
        <div class="school-row placeholder">
          <div>
            <div class="school-name">${slotRank} Menunggu Kontribusi Sekolah...</div>
            <div class="school-meta">${schoolPromo}</div>
          </div>
          <div class="school-score" style="color: #475569;">-</div>
        </div>
      `;
    }
  }
  schoolsList.innerHTML = schoolsHtml;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

// Initial Fetch and start background loop
fetchLeaderboard();
setInterval(fetchLeaderboard, 3000);
