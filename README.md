# Web Kuis Interaktif Sosialisasi STIS & BPS (Expo Booth Edition)

Aplikasi web kuis interaktif ultra-ringan berbasis scan QR Code ala Kahoot yang dimainkan langsung di **smartphone masing-masing peserta** secara mandiri (tanpa perlu mengantre di perangkat booth). Dirancang khusus untuk pameran sosialisasi **Politeknik Statistika STIS** dan **Badan Pusat Statistik (BPS)** bagi siswa SMA/SMK/MA.

---

## 🌟 Alur Kuis di Smartphone Peserta

1. **Registrasi Cepat (1 Kali Saja):**
   - Siswa scan QR code dengan HP masing-masing ➔ Isi Nama, Asal Sekolah, dan No. WA.
2. **Menu Pemilihan Kategori Kuis:**
   - Siswa bebas memilih salah satu dari 3 kategori tantangan:
     * ⚡ **The Logic Master:** 10 soal teka-teki logika cepat, pola angka, dan asah nalar.
     * 📊 **Detektif Data Indonesia:** 10 soal fakta unik sensus, demografi Gen Z, dan data BPS.
     * 🎓 **Pejuang STIS:** 10 soal seputar kuliah ikatan dinas gratis, prodi D-III/D-IV, dan SPMB.
3. **Penyelesaian Bertahap (Non-Stop):**
   - Setelah menyelesaikan 10 soal di satu kategori, siswa melihat skor kategori tersebut dan total akumulasi poinnya.
   - Kategori yang sudah selesai akan diberi tanda **✅ SELESAI** dan dikunci (tidak bisa diulang).
   - Siswa bisa langsung menekan tombol **"🔥 Tantang Kategori Lainnya"** untuk melanjutkan ke kategori yang belum dikerjakan.
   - Jika ketiga kategori telah selesai, siswa dinyatakan tuntas dan skormu tercatat di **Grand Leaderboard**.
4. **Offline-Tolerant:** 10 soal diunduh langsung di memori HP sehingga kuis berjalan lancar tanpa terpengaruh sinyal pameran yang padat.

---

## 📺 Layar TV Dashboard (Booth Display)

* **Multi-Tab Leaderboard:**
  - 👑 **Juara Umum (Akumulasi):** Peringkat siswa berdasarkan total poin dari seluruh kategori yang diselesaikan.
  - ⚡ **The Logic Master:** Peringkat khusus kategori Logika.
  - 📊 **Detektif Data BPS:** Peringkat khusus kategori Fakta Data.
  - 🎓 **Pejuang STIS:** Peringkat khusus kategori Politeknik Statistika STIS.
* **Auto-Cycle Tab:** Layar TV otomatis berganti kategori setiap 10 detik agar suasana booth terus dinamis dan hidup.
* **School Battle:** Klasemen Top 5 Sekolah Teraktif di pameran.
* **Screen Wake Lock API:** Layar TV tidak akan sleep/mati otomatis.
* **In-Memory Cache (2,5s):** Polling TV tidak membebani database PostgreSQL.

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

3. **Inisialisasi Database (Opsional untuk PostgreSQL host):**
   ```bash
   psql -h localhost -U postgres -d kuis_stis -f src/db/schema.sql
   ```
   *(Aplikasi memiliki mode in-memory otomatis jika database belum terhubung).*

4. **Jalankan Container Docker:**
   ```bash
   docker compose up -d --build
   ```

---

### B. Menjalankan Lokal (Development)

```bash
npm install
npm test    # Menjalankan 7 automated unit test
npm start   # Menjalankan server di port 3000
```

---

## 📱 Akses & URL untuk Operator Booth

* **Web Kuis Siswa (Untuk QR Code Umum):**  
  `http://<IP-SERVER-ATAU-DOMAIN>/`
* **QR Code Langsung Kategori Tertentu (Opsional jika booth punya 3 banner terpisah):**  
  * Logika: `http://<IP-SERVER-ATAU-DOMAIN>/?kategori=logika`  
  * Data: `http://<IP-SERVER-ATAU-DOMAIN>/?kategori=data`  
  * STIS: `http://<IP-SERVER-ATAU-DOMAIN>/?kategori=stis`  
* **Layar TV Monitor Booth (Fullscreen F11):**  
  `http://<IP-SERVER-ATAU-DOMAIN>/tv.html`
* **Ekspor Data Peserta (CSV Laporan Akhir):**  
  `http://<IP-SERVER-ATAU-DOMAIN>/api/admin/export-csv?token=bps-stis-2026`

---

## 📝 Changelog

### [2026-11-05]
- **Fitur Multi-Kategori per Siswa**: Siswa mengisi data 1 kali di HP sendiri, lalu dapat menyelesaikan 3 kategori kuis (Logika, Data, STIS) secara berurutan tanpa antre.
- **Kunci Kategori Selesai**: Kategori yang sudah selesai dikerjakan otomatis dikunci dan menampilkan centang ✅ SELESAI serta skor yang didapat.
- **Akumulasi Skor Grand Leaderboard**: Sistem menghitung total akumulasi skor dari semua kategori yang diselesaikan untuk menentukan Juara Umum pameran.
- **TV Display Multi-Tab & Auto-Cycle**: Layar TV booth dilengkapi tab kategori serta otomatis berganti tampilan setiap 10 detik.
- **Deep Linking QR Code**: Mendukung query parameter `?kategori=logika|data|stis` jika panitia ingin mencetak 3 QR Code banner terpisah.
- **Automated Tests Updated**: Semua test unit dan integrasi API lulus 100% (7 test suites).
