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
- **Default Light Mode Layar TV Booth (tv.html & tv.css v6.0)**:
  - **Standarisasi Default Light Mode**: Menjadikan **Mode Terang (Light Mode)** sebagai setelan baku (*default*) resmi untuk tampilan TV monitor booth, dengan kartu putih bersih, kanvas *slate* cerah, teks *slate-900* berkontras tinggi yang sangat mudah terbaca dari jarak jauh di ruangan pameran yang terang benderang.
  - **Aksen Podium Light Mode**: Juara #1 dihiasi gradasi emas hangat (*amber*), Juara #2 perak (*slate*), Juara #3 perunggu (*copper*), dan School Battle beraksen hijau zamrud (*emerald*).
  - **Tombol Toggle Tema TV**: Disediakan tombol saklar tema (`☀️ Mode Terang` / `🌙 Mode Gelap`) pada header atas layar TV jika operator booth ingin beralih ke mode gelap di malam hari.
  - **Versi Aset TV Diperbarui**: Cache busting dinaikkan ke `v=6.0` (`tv.css?v=6.0` & `tv.js?v=6.0`).
- **Perombakan Total Layar TV Booth (tv.html & tv.css v5.0)**:
  - **Tombol Tab Kategori Interaktif**: Tombol tab kategori didesain ulang dengan gaya glassmorphic pill bercahaya, transisi taktil, dan reset tampilan `appearance: none !important` agar tombol tidak kembali ke default kotak putih bawaan browser.
  - **Fungsi Klik Tab & Kontrol Auto-Cycle**: Memperbaiki fungsi klik tab agar langsung mengganti kategori secara instan dan menyertakan tombol jeda/lanjutkan (`⏸️` / `▶️`) dengan hitung mundur detik transparan (`Auto-Cycle: 10s`).
  - **Eliminasi Ruang Kosong (Dynamic Placeholders)**: Menghilangkan kesan kosong saat peserta masih sedikit dengan menambahkan slot placeholder elegan (`#3 Menunggu Penantang... Rebut Posisi 3 Besar!`) dan (`#3 Harumkan nama sekolahmu di sini!`) sehingga mendorong pengunjung booth untuk segera mencoba.
  - **Hierarki Juara (Gold, Silver, Bronze Podium)**: Peringkat #1, #2, dan #3 memiliki gradasi glow dinamis emas, perak, dan perunggu yang menonjol di monitor 1080p.
  - **Live Scannable SVG QR Code**: Menggantikan emoji HP dengan generator kode QR SVG nyata (`/api/qrcode`) beresolusi tinggi di kartu bawah layar agar siswa dapat langsung mengarahkan kamera HP ke TV untuk mulai bermain.
  - **Pencegahan Cache TV**: Memperbarui link file statis menjadi `tv.css?v=5.0` dan `tv.js?v=5.0`.
- **Koreksi Data Akademik STIS (Bank Soal)**:
  - Memperbaiki soal gelar akademik D-IV Komputasi Statistik: Seluruh lulusan jenjang Diploma IV di Politeknik Statistika STIS (baik D-IV Statistika maupun D-IV Komputasi Statistik) menyandang gelar resmi yang sama, yaitu **S.Tr.Stat** (*Sarjana Terapan Statistika*). Tidak ada gelar S.Tr.Kom.
  - Soal nomor 80 disesuaikan untuk mengedukasi bahwa seluruh lulusan D-IV bergelar **S.Tr.Stat**, dan soal nomor 81 difokuskan pada gelar akademik lulusan program studi Diploma III (D-III) Statistika, yaitu **A.Md.Stat** (*Ahli Madya Statistika*).
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
