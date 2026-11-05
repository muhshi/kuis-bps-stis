# Web Kuis Interaktif Sosialisasi STIS & BPS (Expo Booth Edition)

Aplikasi web kuis interaktif ultra-ringan berbasis scan QR Code ala Kahoot yang dimainkan langsung di **smartphone masing-masing peserta** secara mandiri (tanpa perlu mengantre di perangkat booth). Dirancang khusus untuk pameran sosialisasi **Politeknik Statistika STIS** dan **Badan Pusat Statistik (BPS)** bagi siswa SMA/SMK/MA.

---

## 🌟 Fitur Unggulan Terbaru

1. **Light / Dark Mode (Default Light Mode / Sesuai Device):**
   - Tampilan default otomatis bersih dan cerah (Light Mode), atau otomatis menyesuaikan tema perangkat siswa (`prefers-color-scheme`).
   - Tersedia tombol toggle (☀️ / 🌙) di pojok atas agar peserta bisa beralih mode kapan saja sesuai kenyamanan mata mereka.
2. **Cek Leaderboard Langsung di HP Siswa:**
   - Di menu kategori dan di layar hasil kuis, siswa dapat langsung menekan tombol **"🏆 Cek Papan Peringkat (Leaderboard)"**.
   - Menampilkan modal interaktif berisi Top 10 Juara Umum & per kategori, dengan baris khusus bertanda **⭐ (Kamu)** untuk mempermudah siswa melihat posisi mereka.
   - Dilengkapi tautan langsung menuju `/tv.html` untuk tampilan layar penuh monitor booth.
3. **Multi-Kategori Mandiri (Non-Stop):**
   - Siswa bebas memilih salah satu dari 3 kategori tantangan (Logika, Data, STIS).
   - Kategori yang sudah selesai akan diberi tanda **✅ SELESAI** dan dikunci agar tidak bisa diulang.
   - Siswa dapat melanjutkan ke kategori berikutnya untuk mendongkrak skor kumulatif menuju posisi puncak Juara Umum!
4. **Offline-Tolerant:** 10 soal diunduh langsung di awal sesi sehingga game loop berjalan 100% mulus di jaringan pameran yang padat.
5. **Screen Wake Lock & Auto-Cycle di TV:** Layar TV booth otomatis berganti kategori setiap 10 detik dan tidak akan sleep/mati otomatis.

---

## 📺 Akses & URL untuk Operator Booth

* **Web Kuis Siswa (Untuk QR Code Booth):**  
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
- **Fitur Light & Dark Mode**: Implementasi tema default Light Mode yang ramah mata dengan auto-detection `prefers-color-scheme` dan tombol toggle (☀️ / 🌙) yang persisten di `localStorage`.
- **Fitur Mobile Leaderboard Modal**: Penambahan tombol "🏆 Cek Papan Peringkat" di layar HP siswa (pada menu kategori & layar hasil) lengkap dengan indikator posisi siswa ⭐ (Kamu) dan filter kategori.
- **Fitur Multi-Kategori per Siswa**: Siswa mengisi data 1 kali di HP sendiri, lalu dapat menyelesaikan 3 kategori kuis (Logika, Data, STIS) secara berurutan tanpa antre.
- **Kunci Kategori Selesai**: Kategori yang sudah selesai dikerjakan otomatis dikunci dan menampilkan centang ✅ SELESAI serta skor yang didapat.
- **Akumulasi Skor Grand Leaderboard**: Sistem menghitung total akumulasi skor dari semua kategori yang diselesaikan untuk menentukan Juara Umum pameran.
- **TV Display Multi-Tab & Auto-Cycle**: Layar TV booth dilengkapi tab kategori serta otomatis berganti tampilan setiap 10 detik.
- **Deep Linking QR Code**: Mendukung query parameter `?kategori=logika|data|stis` jika panitia ingin mencetak 3 QR Code banner terpisah.
- **Automated Tests Updated**: Semua test unit dan integrasi API lulus 100% (7 test suites).
