const playersList = document.getElementById('players-list');
const schoolsList = document.getElementById('schools-list');
const statsTotalPeserta = document.getElementById('stats-total-peserta');
const liveIndicator = document.getElementById('live-indicator');
const liveText = document.getElementById('live-text');
const tvClock = document.getElementById('tv-clock');
const tvDomainHint = document.getElementById('tv-domain-hint');

// Set domain hint from current origin
if (window.location.host) {
  tvDomainHint.textContent = window.location.host;
}

// 1. Live Clock
function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  tvClock.textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// 2. Screen Wake Lock API (mencegah TV monitor tidur/sleep)
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      const lock = await navigator.wakeLock.request('screen');
      console.log('TV Display Screen Wake Lock active.');
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
          await navigator.wakeLock.request('screen');
        }
      });
    }
  } catch (err) {
    console.warn('Wake Lock request warning:', err.message);
  }
}
requestWakeLock();

// 3. Leaderboard Polling Loop
let lastData = null;

async function fetchLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard?t=' + Date.now());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    lastData = json.data;
    renderData(json.data);

    // Indicator online
    liveIndicator.classList.remove('reconnecting');
    liveText.textContent = 'LIVE UPDATE';
  } catch (err) {
    console.warn('TV Polling hiccup (retaining last data):', err.message);
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
        Belum ada peserta yang menyelesaikan kuis.<br>
        <strong style="color: #38bdf8;">Jadilah orang pertama di papan peringkat!</strong>
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

  // Render Stats
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

// Initial fetch and start interval
fetchLeaderboard();
setInterval(fetchLeaderboard, 3000);
