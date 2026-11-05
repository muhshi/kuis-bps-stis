# Web Kuis Interaktif Sosialisasi STIS & BPS (Expo Booth Edition)

Aplikasi web kuis interaktif ultra-ringan berbasis scan QR Code ala Kahoot yang dirancang khusus untuk pameran sosialisasi **Politeknik Statistika STIS** dan **Badan Pusat Statistik (BPS)** bagi siswa SMA/SMK/MA.

---

## 🌟 Fitur Utama

1. **Alur Kuis 10 Soal Seimbang (All-in-One):**
   - **4 Soal The Logic Master:** Teka-teki logika, pola angka, dan jebakan nalar santai (*hook* pembuka agar siswa tertarik).
   - **3 Soal Detektif Data Indonesia:** Fakta unik sensus penduduk, demografi Gen Z, dan fenomena statistik BPS.
   - **3 Soal Pejuang STIS:** Kuliah ikatan dinas tanpa biaya, program studi (Statistika & Komputasi Statistik), serta pematahan mitos keliru.
2. **Offline-Tolerant Game Loop:** 10 soal diunduh sekaligus di awal sesi sehingga kuis tetap lancar meski sinyal seluler di dalam venue pameran padat/lemah.
3. **Sistem Poin Kahoot:** Nilai dihitung dari ketepatan jawaban + bonus sisa waktu (mencegah skor kembar di leaderboard).
4. **Sistem Gelar / Badge:** Siswa mendapatkan titel hasil kuis (*Grand Master Statistika*, *Detektif Data Handal*, dll.) yang siap di-screenshot untuk IG Story.
5. **Klasemen Sekolah (School Battle):** Menampilkan Top 5 Sekolah Teraktif di booth untuk memicu persaingan gengsi positif antar-sekolah.
6. **Layar TV Dashboard (Booth Display):** 
   - Tampilan 16:9 fullscreen dengan auto-update polling (3 detik) via in-memory cache server (zero DB overload).
   - Dilengkapi **Screen Wake Lock API** agar layar TV monitor tidak sleep/mati sendiri saat acara berlangsung.
7. **Pembersihan & Keamanan Data:**
   - Normalisasi otomatis variasi nama sekolah (`SMAN 1`, `SMA N 1`, `SMA Negeri 1`).
   - Sensor kata kasar (*profanity filter*) pada nama panggilan siswa agar aman tampil di monitor TV.
   - Ekspor data CSV terproteksi token admin untuk rekapitulasi data pengunjung booth.

---

## 🚀 Panduan Menjalankan & Deploy

### A. Menjalankan di Server Ubuntu dengan Docker

1. **Clone repository dan masuk ke folder:**
   ```bash
   cd /path/to/kuis
   ```

2. **Siapkan konfigurasi `.env`:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   *Sesuaikan host, user, dan password PostgreSQL yang sudah aktif di server Anda.*

3. **Inisialisasi Database (Hanya jika menggunakan PostgreSQL):**
   Jalankan file `src/db/schema.sql` di database Anda:
   ```bash
   psql -h localhost -U postgres -d kuis_stis -f src/db/schema.sql
   ```
   *(Aplikasi juga memiliki mode in-memory otomatis jika database PostgreSQL belum dikonfigurasi).*

4. **Jalankan Container Docker:**
   ```bash
   docker compose up -d --build
   ```

5. **Cek Log Container:**
   ```bash
   docker compose logs -f kuis-app
   ```

---

### B. Menjalankan Lokal (Development / Demo Tanpa Docker)

```bash
npm install
npm test    # Menjalankan 7 automated unit test
npm start   # Menjalankan server di port 3000
```

---

## 📺 Akses & URL untuk Operator Booth

* **Web Kuis Siswa (Target QR Code Banner):**  
  `http://<IP-SERVER-ATAU-DOMAIN>/`
* **Layar TV Monitor Booth (Fullscreen F11):**  
  `http://<IP-SERVER-ATAU-DOMAIN>/tv.html`
* **Ekspor Data Peserta (CSV Laporan Akhir):**  
  `http://<IP-SERVER-ATAU-DOMAIN>/api/admin/export-csv?token=bps-stis-2026`

---

## 📝 Changelog

### [2026-11-05]
- **Inisialisasi Proyek**: Setup arsitektur monolith Node.js + Express ultra-ringan (<75MB Docker Alpine).
- **Bank Soal Terpadu**: Penggabungan dan kurasi 90 butir bank soal (30 Logika, 30 Data BPS, 30 Info STIS).
- **Service & Game Logic**: Generator 10 soal acak seimbang (4 Logika, 3 Data, 3 STIS), perhitungan skor berbasis waktu, penentuan badge persona, dan in-memory cache snapshot.
- **Resilience & Sanitasi**: Implementasi `schoolNormalizer.js` untuk mengatasi fragmentasi nama sekolah dan `profanity.js` untuk sensor kata kotor di TV.
- **Mobile First Web Player**: Halaman kuis responsif, Web Audio synthesizer (zero MP3 download), dan fallback retry saat koneksi terputus.
- **TV Display Dashboard**: Layar live leaderboard 1080p, klasemen Top 5 Sekolah, live counter BPS, dan Screen Wake Lock API.
- **Deployment Ready**: Pembuatan `Dockerfile` multi-stage, `docker-compose.yml`, serta skema PostgreSQL optimal.
- **Automated Testing**: 7 skenario test lulus 100% (validasi soal, utilitas, service layer, dan API REST).
