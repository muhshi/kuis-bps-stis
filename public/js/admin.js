/**
 * Panel Operator Ringan (/admin.html)
 * Auth via token operator, live monitoring peserta, klasemen sekolah, CSV 1-klik, & undian doorprize.
 */
const ADMIN_TOKEN_KEY = 'bps_admin_token';

let adminToken = sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
let overviewData = null;
let autoRefreshEnabled = true;
let autoRefreshTimer = null;
let currentFilter = 'all';

// DOM Refs
const authScreen = document.getElementById('admin-auth-screen');
const dashboard = document.getElementById('admin-dashboard');
const formAuth = document.getElementById('form-admin-auth');
const inputToken = document.getElementById('input-admin-token');
const authError = document.getElementById('auth-error');

const btnAutoRefresh = document.getElementById('btn-auto-refresh');
const btnManualRefresh = document.getElementById('btn-manual-refresh');
const btnAdminTheme = document.getElementById('btn-admin-theme');
const btnDownloadCsv = document.getElementById('btn-download-csv');
const btnAdminLogout = document.getElementById('btn-admin-logout');
const bankSoalMeta = document.getElementById('bank-soal-meta');

const kpiPeserta = document.getElementById('kpi-peserta');
const kpiWa = document.getElementById('kpi-wa');
const kpiSesi = document.getElementById('kpi-sesi');
const kpiTuntas = document.getElementById('kpi-tuntas');
const kpiSekolah = document.getElementById('kpi-sekolah');
const kpiUpdated = document.getElementById('kpi-updated');

const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

const searchParticipant = document.getElementById('search-participant');
const filterPills = document.querySelectorAll('.filter-pill');
const tbodyParticipants = document.getElementById('tbody-participants');

const searchSchool = document.getElementById('search-school');
const tbodySchools = document.getElementById('tbody-schools');

const dpPoolRadios = document.querySelectorAll('input[name="dp-pool"]');
const dpPoolCount = document.getElementById('dp-pool-count');
const dpStatusTag = document.getElementById('dp-status-tag');
const dpWinnerName = document.getElementById('dp-winner-name');
const dpWinnerSchool = document.getElementById('dp-winner-school');
const dpWinnerMeta = document.getElementById('dp-winner-meta');
const btnSpinDoorprize = document.getElementById('btn-spin-doorprize');

// ==========================================
// 1. THEME (Default Light Mode)
// ==========================================
function applyAdminTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  if (btnAdminTheme) {
    btnAdminTheme.textContent = isDark ? '🌙 Mode Gelap' : '☀️ Mode Terang';
  }
  localStorage.setItem('bps_theme', theme);
}

applyAdminTheme(localStorage.getItem('bps_theme') === 'dark' ? 'dark' : 'light');

if (btnAdminTheme) {
  btnAdminTheme.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    applyAdminTheme(isDark ? 'light' : 'dark');
  });
}

// ==========================================
// 2. AUTHENTICATION & DATA FETCH
// ==========================================
async function fetchOverview(tokenToUse) {
  const res = await fetch(`/api/admin/overview?token=${encodeURIComponent(tokenToUse)}&t=${Date.now()}`);
  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Gagal memuat data');
  }
  return json.data;
}

async function loginAndLoad(tokenToUse) {
  try {
    const data = await fetchOverview(tokenToUse);
    adminToken = tokenToUse;
    sessionStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
    authError.classList.add('hidden');
    authScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');

    if (btnDownloadCsv) {
      btnDownloadCsv.href = `/api/admin/export-csv?token=${encodeURIComponent(adminToken)}`;
    }

    initQrPanels();
    renderAll(data);
    startAutoRefresh();
  } catch (err) {
    if (err.message === 'UNAUTHORIZED') {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      adminToken = '';
      authError.classList.remove('hidden');
      authScreen.classList.remove('hidden');
      dashboard.classList.add('hidden');
    } else {
      alert('Gagal terhubung ke server: ' + err.message);
    }
  }
}

if (formAuth) {
  formAuth.addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = inputToken.value.trim();
    if (!val) return;
    await loginAndLoad(val);
  });
}

if (btnAdminLogout) {
  btnAdminLogout.addEventListener('click', () => {
    stopAutoRefresh();
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    adminToken = '';
    inputToken.value = '';
    dashboard.classList.add('hidden');
    authScreen.classList.remove('hidden');
  });
}

if (adminToken) {
  loginAndLoad(adminToken);
}

// ==========================================
// 3. REFRESH LOOP
// ==========================================
async function refreshData() {
  if (!adminToken) return;
  try {
    const data = await fetchOverview(adminToken);
    renderAll(data);
  } catch (err) {
    console.warn('Refresh operator gagal:', err.message);
  }
}

function startAutoRefresh() {
  stopAutoRefresh();
  if (!autoRefreshEnabled) return;
  autoRefreshTimer = setInterval(refreshData, 10000);
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
}

if (btnAutoRefresh) {
  btnAutoRefresh.addEventListener('click', () => {
    autoRefreshEnabled = !autoRefreshEnabled;
    btnAutoRefresh.classList.toggle('active', autoRefreshEnabled);
    btnAutoRefresh.textContent = autoRefreshEnabled ? '🔄 Auto: 10s' : '⏸️ Auto: Jeda';
    if (autoRefreshEnabled) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  });
}

if (btnManualRefresh) {
  btnManualRefresh.addEventListener('click', refreshData);
}

// ==========================================
// 4. RENDER OVERVIEW, TABLES, SCHOOLS
// ==========================================
function renderAll(data) {
  overviewData = data;
  const { summary, questionBank } = data;

  kpiPeserta.textContent = summary.totalPeserta.toLocaleString('id-ID');
  kpiWa.textContent = `${summary.totalWithWa.toLocaleString('id-ID')} mengisi nomor WA`;
  kpiSesi.textContent = summary.totalSelesaiSesi.toLocaleString('id-ID');
  kpiTuntas.textContent = summary.totalTuntasAll.toLocaleString('id-ID');
  kpiSekolah.textContent = summary.totalSekolah.toLocaleString('id-ID');

  const timeStr = new Date(data.updatedAt).toLocaleTimeString('id-ID');
  kpiUpdated.textContent = `Terakhir update: ${timeStr}`;

  if (questionBank) {
    bankSoalMeta.textContent = `Bank Soal Aktif: ${questionBank.total} Butir (${questionBank.logika} Logika • ${questionBank.data} Data BPS • ${questionBank.stis} STIS)`;
  }

  renderParticipantsTable();
  renderSchoolsTable();
  updateDoorprizePoolCount();
}

function formatCatScore(score) {
  if (score === null || score === undefined) {
    return '<span class="score-pill none">-</span>';
  }
  return `<span class="score-pill">${Number(score).toLocaleString('id-ID')}</span>`;
}

function formatWaLink(wa) {
  if (!wa || !wa.trim()) return '<span style="color: var(--text-muted);">-</span>';
  const digits = wa.replace(/[^0-9]/g, '');
  const waHref = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
  return `<a class="wa-btn" href="https://wa.me/${encodeURIComponent(waHref)}" target="_blank" rel="noopener">📱 ${escapeHtml(wa)}</a>`;
}

function renderParticipantsTable() {
  if (!overviewData) return;
  const q = (searchParticipant.value || '').trim().toLowerCase();

  let list = overviewData.participants || [];
  if (currentFilter === 'finished3') {
    list = list.filter(p => p.categoriesFinished === 3);
  } else if (currentFilter === 'haswa') {
    list = list.filter(p => p.wa && p.wa.trim().length > 0);
  }

  if (q) {
    list = list.filter(p =>
      p.nama.toLowerCase().includes(q) ||
      p.sekolah.toLowerCase().includes(q) ||
      (p.wa && p.wa.toLowerCase().includes(q))
    );
  }

  if (list.length === 0) {
    tbodyParticipants.innerHTML = '<tr><td colspan="8" class="empty-cell">Tidak ada peserta yang cocok dengan filter.</td></tr>';
    return;
  }

  tbodyParticipants.innerHTML = list.map((p, idx) => `
    <tr>
      <td><strong>#${idx + 1}</strong></td>
      <td>
        <div style="font-weight: 800;">${escapeHtml(p.nama)}</div>
        <div style="font-size: 0.76rem; color: var(--text-muted);">${p.categoriesFinished}/3 kategori (${p.totalTimeSeconds}s)</div>
      </td>
      <td>${escapeHtml(p.sekolah)}</td>
      <td>${formatWaLink(p.wa)}</td>
      <td>${formatCatScore(p.scores.logika)}</td>
      <td>${formatCatScore(p.scores.data)}</td>
      <td>${formatCatScore(p.scores.stis)}</td>
      <td><strong style="color: var(--primary); font-size: 1rem;">${p.totalScore.toLocaleString('id-ID')}</strong></td>
    </tr>
  `).join('');
}

function renderSchoolsTable() {
  if (!overviewData) return;
  const q = (searchSchool.value || '').trim().toLowerCase();
  let list = overviewData.schools || [];

  if (q) {
    list = list.filter(s => s.sekolah.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    tbodySchools.innerHTML = '<tr><td colspan="6" class="empty-cell">Belum ada sekolah terdaftar.</td></tr>';
    return;
  }

  tbodySchools.innerHTML = list.map(s => `
    <tr>
      <td><strong>#${s.rank}</strong></td>
      <td style="font-weight: 800;">${escapeHtml(s.sekolah)}</td>
      <td>${s.pesertaCount} siswa</td>
      <td>${s.finishedPesertaCount} siswa</td>
      <td>${s.avgScore.toLocaleString('id-ID')} poin</td>
      <td><strong style="color: var(--green); font-size: 1rem;">${s.totalPoints.toLocaleString('id-ID')}</strong></td>
    </tr>
  `).join('');
}

if (searchParticipant) {
  searchParticipant.addEventListener('input', renderParticipantsTable);
}
if (searchSchool) {
  searchSchool.addEventListener('input', renderSchoolsTable);
}

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    currentFilter = pill.getAttribute('data-filter') || 'all';
    filterPills.forEach(p => p.classList.toggle('active', p === pill));
    renderParticipantsTable();
  });
});

// ==========================================
// 5. TAB SWITCHING
// ==========================================
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');
    tabBtns.forEach(b => b.classList.toggle('active', b === btn));
    tabPanels.forEach(panel => {
      panel.classList.toggle('hidden', panel.id !== `tab-${target}`);
    });
  });
});

// ==========================================
// 6. DOORPRIZE LUCKY DRAW (READ-ONLY)
// ==========================================
function getEligibleDoorprizePool() {
  if (!overviewData) return [];
  const checked = document.querySelector('input[name="dp-pool"]:checked');
  const mode = checked ? checked.value : 'any1';
  const all = overviewData.participants || [];

  if (mode === 'all3') {
    return all.filter(p => p.categoriesFinished === 3);
  }
  if (mode === 'haswa') {
    return all.filter(p => p.categoriesFinished >= 1 && p.wa && p.wa.trim().length > 0);
  }
  return all.filter(p => p.categoriesFinished >= 1);
}

function updateDoorprizePoolCount() {
  const pool = getEligibleDoorprizePool();
  if (dpPoolCount) {
    dpPoolCount.textContent = `Kandidat eligible: ${pool.length} peserta`;
  }
}

dpPoolRadios.forEach(r => {
  r.addEventListener('change', updateDoorprizePoolCount);
});

if (btnSpinDoorprize) {
  btnSpinDoorprize.addEventListener('click', () => {
    const pool = getEligibleDoorprizePool();
    if (pool.length === 0) {
      alert('Belum ada peserta yang memenuhi syarat undian terpilih.');
      return;
    }

    btnSpinDoorprize.disabled = true;
    dpStatusTag.textContent = 'MENGACAK PEMENANG...';
    dpWinnerMeta.textContent = '';

    let ticks = 0;
    const maxTicks = 24;
    const spinInterval = setInterval(() => {
      const randSample = pool[Math.floor(Math.random() * pool.length)];
      dpWinnerName.textContent = randSample.nama;
      dpWinnerSchool.textContent = randSample.sekolah;
      ticks++;

      if (ticks >= maxTicks) {
        clearInterval(spinInterval);
        const winner = pool[Math.floor(Math.random() * pool.length)];
        dpStatusTag.textContent = '🎉 PEMENANG TERPILIH!';
        dpWinnerName.textContent = winner.nama;
        dpWinnerSchool.textContent = `🏫 ${winner.sekolah}`;
        dpWinnerMeta.textContent = `Skor: ${winner.totalScore.toLocaleString('id-ID')} poin (${winner.categoriesFinished}/3 kategori)${winner.wa ? ' • WA: ' + winner.wa : ''}`;
        btnSpinDoorprize.disabled = false;
      }
    }, 75);
  });
}

// ==========================================
// 7. QR CODE BOOTH PREVIEW
// ==========================================
let qrInitialized = false;
function initQrPanels() {
  if (qrInitialized) return;
  qrInitialized = true;

  const origin = window.location.origin;
  const targets = [
    { imgId: 'qr-img-main', labelId: 'qr-url-main', url: `${origin}/` },
    { imgId: 'qr-img-logika', labelId: 'qr-url-logika', url: `${origin}/?kategori=logika` },
    { imgId: 'qr-img-data', labelId: 'qr-url-data', url: `${origin}/?kategori=data` },
    { imgId: 'qr-img-stis', labelId: 'qr-url-stis', url: `${origin}/?kategori=stis` }
  ];

  targets.forEach(t => {
    const img = document.getElementById(t.imgId);
    const lbl = document.getElementById(t.labelId);
    if (img) img.src = `/api/qrcode?url=${encodeURIComponent(t.url)}`;
    if (lbl) lbl.textContent = t.url;
  });
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
