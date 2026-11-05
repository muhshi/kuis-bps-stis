const playersList = document.getElementById('players-list');
const schoolsList = document.getElementById('schools-list');
const statsTotalPeserta = document.getElementById('stats-total-peserta');
const liveIndicator = document.getElementById('live-indicator');
const liveText = document.getElementById('live-text');
const tvClock = document.getElementById('tv-clock');
const tvDomainHint = document.getElementById('tv-domain-hint');
const tvBoardTitle = document.getElementById('tv-board-title');
const tvBoardSub = document.getElementById('tv-board-sub');
const tvTabs = document.querySelectorAll('.tv-tab');

let currentCategory = 'all';
const categoryOrder = ['all', 'logika', 'data', 'stis'];
let cycleIndex = 0;

if (window.location.host) {
  tvDomainHint.textContent = window.location.host;
}

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

// 2. Screen Wake Lock
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
  } catch (err) {}
}
requestWakeLock();

// 3. Tab Switching
tvTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    currentCategory = tab.getAttribute('data-cat');
    cycleIndex = categoryOrder.indexOf(currentCategory);
    updateActiveTabUI();
    fetchLeaderboard();
  });
});

function updateActiveTabUI() {
  tvTabs.forEach(t => {
    if (t.getAttribute('data-cat') === currentCategory) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  if (currentCategory === 'all') {
    tvBoardTitle.textContent = '🏆 TOP 10 JUARA UMUM';
    tvBoardSub.textContent = 'Akumulasi Skor Semua Kategori';
  } else if (currentCategory === 'logika') {
    tvBoardTitle.textContent = '⚡ TOP 10 THE LOGIC MASTER';
    tvBoardSub.textContent = 'Skor Kategori Teka-Teki Logika';
  } else if (currentCategory === 'data') {
    tvBoardTitle.textContent = '📊 TOP 10 DETEKTIF DATA';
    tvBoardSub.textContent = 'Skor Kategori Fakta Data BPS';
  } else if (currentCategory === 'stis') {
    tvBoardTitle.textContent = '🎓 TOP 10 PEJUANG STIS';
    tvBoardSub.textContent = 'Skor Kategori Politeknik Statistika STIS';
  }
}

// 4. Auto-Cycle Categories every 10 seconds
setInterval(() => {
  cycleIndex = (cycleIndex + 1) % categoryOrder.length;
  currentCategory = categoryOrder[cycleIndex];
  updateActiveTabUI();
  fetchLeaderboard();
}, 10000);

// 5. Polling Loop
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

function renderData(data) {
  // Render Top 10 Players
  const players = data.topPlayers || [];
  if (players.length === 0) {
    playersList.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #64748b;">
        Belum ada peserta di kategori ini.<br>
        <strong style="color: #38bdf8;">Jadilah yang pertama di papan peringkat!</strong>
      </div>
    `;
  } else {
    playersList.innerHTML = players.map(p => {
      const rankClass = p.rank === 1 ? 'rank-1' : p.rank === 2 ? 'rank-2' : p.rank === 3 ? 'rank-3' : '';
      const medal = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`;

      return `
        <div class="lb-row ${rankClass}">
          <div class="lb-rank">${medal}</div>
          <div class="lb-player" title="${escapeHtml(p.nama)}">${escapeHtml(p.nama)}</div>
          <div class="lb-school" title="${escapeHtml(p.sekolah)}">${escapeHtml(p.sekolah)}</div>
          <div class="lb-score">${p.totalScore.toLocaleString('id-ID')}</div>
          <div class="lb-time">${p.totalTimeSeconds}s</div>
        </div>
      `;
    }).join('');
  }

  // Render Top 5 Schools
  const schools = data.topSchools || [];
  if (schools.length === 0) {
    schoolsList.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #64748b;">
        Menunggu kontribusi poin sekolah...
      </div>
    `;
  } else {
    schoolsList.innerHTML = schools.map((sc, idx) => `
      <div class="school-row">
        <div>
          <div class="school-name">#${idx + 1} ${escapeHtml(sc.sekolah)}</div>
          <div class="school-meta">${sc.pesertaCount} Siswa Berpartisipasi • Rata-rata ${sc.avgScore.toLocaleString('id-ID')}</div>
        </div>
        <div class="school-score">${sc.totalPoints.toLocaleString('id-ID')} Poin</div>
      </div>
    `).join('');
  }

  // Render Live Stats
  if (data.liveStats) {
    statsTotalPeserta.textContent = (data.liveStats.totalPeserta || 0).toLocaleString('id-ID');
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

// Initial fetch & short poll (every 3 seconds for current category)
fetchLeaderboard();
setInterval(fetchLeaderboard, 3000);
