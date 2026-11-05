# Web Kuis Interaktif Sosialisasi STIS & BPS (Expo Booth Edition)

Aplikasi web kuis interaktif ultra-ringan berbasis scan QR Code ala Kahoot yang dimainkan langsung di **smartphone masing-masing peserta** secara mandiri (tanpa perlu mengantre di perangkat booth). Dirancang khusus untuk pameran sosialisasi **Politeknik Statistika STIS** dan **Badan Pusat Statistik (BPS)** bagi siswa SMA/SMK/MA.

---

## 🌟 Fitur Unggulan

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
4. **Desain Teroptimasi (Design-Engineering Polish):**
   - **Tabular Numbers:** Angka timer & skor tidak goyang saat menghitung mundur.
   - **Hit Area 44×44px:** Tombol kontrol mudah ditekan dengan jempol di smartphone.
   - **Text-Wrap Balance:** Judul dan pertanyaan terdistribusi rapi tanpa kata yatim (*orphan words*).
   - **Tactile Button Feedback:** Efek sentuhan tombol responsif dengan *scoped transitions* bebas lag.
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
- **Perbaikan Bug UI/UX & Interaksi (Berdasarkan Skill Frontend Design, Taste, Emil Kowalski, Hallmark, Impeccable)**:
  - **Toggle Light / Dark Mode**: Memperbaiki toggle tema agar instan beralih antara Mode Terang (default) dan Mode Gelap, menjaga keutuhan ikon serta teks label (`☀️ Mode Terang` / `🌙 Mode Gelap`).
  - **Modal Cek Peringkat HP**: Memperbaiki tombol "🏆 Cek Papan Peringkat (Leaderboard)" pada layar hasil dan menu kategori agar membuka dialog modal fixed-center dengan animasi *scale-up* halus, backdrop-blur, serta fitur tutup via backdrop/tombol silang.
  - **Solusi Masalah Koneksi Terputus ("Tersimpan Offline")**: Menambahkan persistensi data otomatis (`dev_store.json`) dan fallback auto-recovery di service kuis sehingga sesi kuis peserta tidak akan pernah hilang atau gagal tersimpan walau server sempat restart di tengah acara.
  - **Bank Soal 100% Unik (Zero Duplicate)**: Mengganti bank soal lama dengan 90 soal kurasi unik baru (30 Logika, 30 Data BPS, 30 STIS) dan menerapkan algoritma acak *Fisher-Yates shuffle* agar soal tidak berulang dalam satu sesi.
  - **Pencegahan Cache Browser**: Menambahkan header HTTP `no-cache, no-store, must-revalidate` serta cache-busting query parameter versi (`?v=4.1`) pada berkas statis CSS dan JS.
- **Design-Engineering Polish (make-interfaces-feel-better)**:
  - Penerapan `font-variant-numeric: tabular-nums` pada timer dan skor untuk mengeliminasi *layout jitter*.
  - Perluasan area sentuh (*hit area*) tombol kontrol menjadi minimum 44×44px (standar Apple HIG & WCAG).
  - Penambahan `text-wrap: balance` dan `text-wrap: pretty` pada seluruh teks pertanyaan dan deskripsi.
  - Refaktor transisi CSS dari `all` menjadi *scoped properties* demi performa rendering 60fps di HP.
  - Penambahan antialiasing font smoothing di level root untuk layar Retina/iOS.
  - Harmonisasi *concentric radius* antar elemen bersarang.
- **Fitur Light & Dark Mode**: Implementasi tema default Light Mode yang ramah mata dengan auto-detection `prefers-color-scheme` dan tombol toggle (☀️ / 🌙) yang persisten di `localStorage`.
- **Fitur Mobile Leaderboard Modal**: Penambahan tombol "🏆 Cek Papan Peringkat" di layar HP siswa lengkap dengan indikator posisi siswa ⭐ (Kamu) dan filter kategori.
- **Fitur Multi-Kategori per Siswa**: Siswa mengisi data 1 kali di HP sendiri, lalu dapat menyelesaikan 3 kategori kuis (Logika, Data, STIS) secara berurutan tanpa antre.
- **TV Display Multi-Tab & Auto-Cycle**: Layar TV booth dilengkapi tab kategori serta otomatis berganti tampilan setiap 10 detik.
- **Automated Tests**: 7 test suites lulus 100%.
