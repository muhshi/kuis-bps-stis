# Kuis Interaktif Sosialisasi STIS - Implementation Plan (Refined & Battle-Tested)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web kuis interaktif booth pameran edukasi BPS/STIS yang sangat ringan (<100KB payload), tahan gangguan sinyal venue (offline gameplay loop), hemat resource di Ubuntu Docker, terintegrasi PostgreSQL, dengan fitur All-in-One quiz (Logika -> Data -> STIS), sistem gelar badge, klasemen sekolah yang adil, serta TV Dashboard anti-sleep.

**Architecture:** Monolith berbasis Node.js/Express di dalam container Alpine Docker. 
- Client mengunduh 6 soal sekaligus saat registrasi (tanpa kunci jawaban). Game loop berjalan 100% di browser tanpa bergantung internet di setiap soal.
- Hasil kuis dikirim sekaligus di akhir sesi (`POST /api/quiz/finish`) dengan mekanisme auto-retry.
- Leaderboard TV membaca in-memory cache berdurasi 2-3 detik (zero DB overload).
- Data tersimpan persisten di PostgreSQL server host.

**Tech Stack:**
- Runtime: Node.js 20 (Alpine)
- Database: PostgreSQL (client `pg`, connection pool 5-10)
- Frontend: Vanilla HTML5, CSS modern mandiri (<25KB, no CDN, system fonts), Vanilla JS
- Audio: Web Audio API sintetis (unlocked on first user tap)
- Deployment: Docker & Docker Compose

## Global Constraints
- Payload halaman pertama < 100KB (Gzip/brotli enabled, 0 external font/CDN calls).
- Safe DB operations: Mengikuti aturan global, tidak melakukan DROP/TRUNCATE pada database.
- Offline-tolerant: Game loop tidak boleh freeze jika koneksi drop di tengah soal 1 s.d. 6.
- Anti-spam sekolah: Klasemen sekolah mengagregasi skor tertinggi per siswa unik.
- Sensor kata: Filter kata kasar pada nama panggilan sebelum tampil di TV.

## Review Focus
1. Sinyal drop saat submit akhir: retry queue di localStorage/client side sampai respons 200 OK diterima.
2. Web Audio di iOS/Safari: pastikan `AudioContext` di-resume pada event click tombol "Mulai Kuis".
3. TV Dashboard tetap menampilkan snapshot data terakhir saat koneksi HTTP gagal (graceful degrade).
4. Layar TV booth tidak boleh sleep (Wake Lock API terpasang).
5. Normalisasi nama sekolah otomatis ("SMA N 1", "SMAN 1", "SMA Negeri 1").

---

### Task 1: Scaffolding Proyek, Bank Soal & Test Validasi

**Files:**
- Create: `package.json`
- Create: `src/data/questions.json`
- Create: `src/utils/profanity.js`
- Create: `src/utils/schoolNormalizer.js`
- Create: `tests/data_test.js`

**Interfaces:**
- Consumes: Soal dari `c:\Users\bpsde\Downloads\soal_kuis_stis.json` & `c:\Users\bpsde\Downloads\soal_kuis_stis_v2.json`
- Produces: `questions.json` terpadu (~60 butir soal: 20 logika, 20 data, 20 stis).
- Produces: `normalizeSchoolName(rawName) -> cleanName`
- Produces: `cleanNickname(name) -> sanitizedName`

- [ ] **Step 1: Setup `package.json` dengan dependency minimal (`express`, `cors`, `dotenv`, `pg`, `compression`)**
- [ ] **Step 2: Gabungkan bank soal dari kedua file JSON ke `src/data/questions.json`**
- [ ] **Step 3: Implementasi utils `schoolNormalizer.js` dan `profanity.js`**
- [ ] **Step 4: Buat `tests/data_test.js` untuk memvalidasi kelengkapan soal dan utilitas**
- [ ] **Step 5: Jalankan test dan verifikasi output**
- [ ] **Step 6: Commit Task 1**

---

### Task 2: Skema Database PostgreSQL & Service Layer

**Files:**
- Create: `src/db/schema.sql`
- Create: `src/db/index.js`
- Create: `src/services/quizService.js`
- Test: `tests/quiz_service_test.js`

**Interfaces:**
- Produces:
  - `startSession({ nama, sekolah, wa }) -> { sessionId, questionsWithoutKeys }`
  - `finishSession({ sessionId, answers: [{questionId, chosenOption, timeSpentMs}] }) -> { finalScore, rank, badge, schoolName }`
  - `getLeaderboardSnapshot() -> { topPlayers, topSchools, liveStats }`

- [ ] **Step 1: Tulis unit test untuk generator sesi kuis (harus tepat 2 Logika, 2 Data, 2 STIS) dan scoring**
- [ ] **Step 2: Buat `src/db/schema.sql` dengan tabel `participants`, `quiz_sessions`, `quiz_answers`, dan indeks optimal**
- [ ] **Step 3: Implementasi connection pool PostgreSQL di `src/db/index.js`**
- [ ] **Step 4: Implementasi `src/services/quizService.js` lengkap dengan validasi jawaban, kalkulasi skor, badge, dan in-memory cache**
- [ ] **Step 5: Jalankan test dan verifikasi output**
- [ ] **Step 6: Commit Task 2**

---

### Task 3: REST API & Static Serving

**Files:**
- Create: `src/routes/api.js`
- Create: `src/server.js`
- Test: `tests/api_test.js`

**Endpoints:**
- `POST /api/quiz/start`: Validasi peserta, generate session, kirim 6 soal tanpa kunci.
- `POST /api/quiz/finish`: Terima array jawaban, simpan ke DB, return skor + ranking + badge.
- `GET /api/leaderboard`: Kirim data cache TV (Top 10 siswa, Top 5 sekolah, live stats).
- `GET /api/admin/export-csv`: Endpoint proteksi token untuk download laporan peserta & skor.

- [ ] **Step 1: Tulis automated API test untuk alur start -> finish -> leaderboard**
- [ ] **Step 2: Implementasi Express server dengan middleware compression (Gzip) & cache-control**
- [ ] **Step 3: Jalankan test API**
- [ ] **Step 4: Commit Task 3**

---

### Task 4: Client Web Siswa (Mobile First & Offline Tolerant)

**Files:**
- Create: `public/index.html`
- Create: `public/css/style.css`
- Create: `public/js/audio.js`
- Create: `public/js/app.js`

**Fitur:**
- Layar 1: Registrasi Nama & Sekolah (Input instan).
- Layar 2: Arena Kuis (Timer 15s per soal, tombol warna-warni A/B/C/D, Web Audio feedback bip-bip seru, feedback pop-up fakta unik).
- Layar 3: Kartu Hasil Akhir (Skor, Badge Persona seperti "Calon Statistisi Handal", Ranking, Tombol Share/Screenshot).
- Background Sync: Jika submit akhir gagal karena internet mati, ada tombol "Kirim Ulang" & retry otomatis.

- [ ] **Step 1: Buat stylesheet mandiri (<25KB, responsif, warna cerah ala Kahoot & BPS)**
- [ ] **Step 2: Implementasi Web Audio synthesizer di `audio.js` (unlocked saat tap Mulai)**
- [ ] **Step 3: Implementasi game loop offline di `app.js` dengan fallback retry queue**
- [ ] **Step 4: Verifikasi tampilan dan fungsionalitas di browser mobile emulator**
- [ ] **Step 5: Commit Task 4**

---

### Task 5: Layar TV Dashboard Booth (Fullscreen & Resilient)

**Files:**
- Create: `public/tv.html`
- Create: `public/css/tv.css`
- Create: `public/js/tv.js`

**Fitur:**
- Layout TV 16:9 1080p:
  - Top 10 Siswa
  - Top 5 School Battle
  - Live Ticker BPS (Total peserta, soal paling mengecoh)
  - Indikator status live ("Live Connected" / "Reconnecting...")
  - Screen Wake Lock API (layar TV tidak akan sleep/mati otomatis)
  - Polling berkala (3 detik) membaca endpoint cache.

- [ ] **Step 1: Buat layout TV yang visualnya memukau dan mudah dibaca dari jarak 3-5 meter**
- [ ] **Step 2: Implementasi polling + graceful degrade (tidak blank saat offline) + Screen Wake Lock**
- [ ] **Step 3: Uji coba simulasi live refresh data TV**
- [ ] **Step 4: Commit Task 5**

---

### Task 6: Docker Containerization & Dokumentasi Deployment

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `README.md`

- [ ] **Step 1: Buat Dockerfile multi-stage berbasis Node.js Alpine minimalis (<70MB)**
- [ ] **Step 2: Buat docker-compose.yml yang terhubung ke jaringan PostgreSQL host**
- [ ] **Step 3: Buat dokumentasi README.md lengkap cara deploy, panduan operator booth, dan changelog**
- [ ] **Step 4: Verifikasi build container lokal dan jalankan checklist akhir**
- [ ] **Step 5: Commit Task 6 & Push sesuai aturan kerja**
