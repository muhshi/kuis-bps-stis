const fs = require('fs');

const questions = [
  // ==========================================
  // KATEGORI 1: THE LOGIC MASTER (30 UNIQUE)
  // ==========================================
  {
    id: 1,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Lanjutkan pola angka ini: 2, 6, 12, 20, 30, ... ?",
    opsi: { A: "40", B: "42", C: "44", D: "36" },
    kunci: "B",
    penjelasan: "Jawabannya 42! Polanya bertambah secara teratur: +4, +6, +8, +10, lalu +12 (30 + 12 = 42). Pola ini juga setara dengan n × (n+1)!"
  },
  {
    id: 2,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Deret legendaris alam: 1, 1, 2, 3, 5, 8, ... Berapa angka berikutnya?",
    opsi: { A: "11", B: "12", C: "13", D: "14" },
    kunci: "C",
    penjelasan: "Ini deret Fibonacci! Setiap angka adalah penjumlahan dua angka sebelumnya (5 + 8 = 13). Pola ini muncul pada bunga matahari hingga cangkang kerang!"
  },
  {
    id: 3,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Ayah Budi punya 5 anak: Nana, Nini, Nunu, Nene, dan anak kelima bernama siapa?",
    opsi: { A: "Nono", B: "Nunung", C: "Nina", D: "Budi" },
    kunci: "D",
    penjelasan: "Budi! Perhatikan awal kalimatnya: 'Ayah Budi'. Jadi anak kelimanya adalah Budi sendiri. Jangan terkecoh pola nama ya!"
  },
  {
    id: 4,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "3 kucing menangkap 3 tikus dalam 3 menit. Berapa menit yang dibutuhkan 100 kucing untuk menangkap 100 tikus?",
    opsi: { A: "1 menit", B: "3 menit", C: "100 menit", D: "33 menit" },
    kunci: "B",
    penjelasan: "Tetap 3 menit! Masing-masing kucing butuh 3 menit untuk menangkap 1 tikus. Karena bekerja bersamaan, waktunya tetap sama."
  },
  {
    id: 5,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Tebak angka berikutnya: 3, 6, 11, 18, 27, ... ?",
    opsi: { A: "36", B: "37", C: "38", D: "40" },
    kunci: "C",
    penjelasan: "Jawabannya 38! Selisih angkanya adalah deret bilangan ganjil: +3, +5, +7, +9, lalu +11. Jadi 27 + 11 = 38."
  },
  {
    id: 6,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Teratai di kolam jumlahnya berlipat ganda tiap hari. Butuh 30 hari hingga kolam penuh. Pada hari ke berapa kolam terisi setengahnya?",
    opsi: { A: "Hari ke-15", B: "Hari ke-20", C: "Hari ke-25", D: "Hari ke-29" },
    kunci: "D",
    penjelasan: "Hari ke-29! Karena menggandakan diri setiap hari, sehari sebelum penuh (hari ke-30) kolam tersebut tepat terisi setengahnya. Inilah keajaiban pertumbuhan eksponensial!"
  },
  {
    id: 7,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Es teh + boba harganya Rp15.000. Boba lebih mahal Rp10.000 dari es teh. Berapa harga es tehnya?",
    opsi: { A: "Rp5.000", B: "Rp2.500", C: "Rp7.500", D: "Rp1.000" },
    kunci: "B",
    penjelasan: "Rp2.500! Jika es teh Rp2.500, maka boba Rp12.500 (selisih pas Rp10.000 dan total Rp15.000). Jawaban Rp5.000 adalah jebakan refleks yang paling sering salah!"
  },
  {
    id: 8,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Lanjutkan deret ini: 2, 3, 5, 7, 11, 13, ... Angka berikutnya berapa?",
    opsi: { A: "15", B: "16", C: "17", D: "19" },
    kunci: "C",
    penjelasan: "17! Ini adalah deret bilangan prima (hanya habis dibagi 1 dan dirinya sendiri). 15 dan 16 bukan bilangan prima."
  },
  {
    id: 9,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Kamu ikut lomba lari dan berhasil menyalip pelari di posisi kedua. Sekarang kamu berada di posisi berapa?",
    opsi: { A: "Pertama", B: "Kedua", C: "Ketiga", D: "Terakhir" },
    kunci: "B",
    penjelasan: "Posisi kedua! Saat menyalip orang di posisi kedua, kamu mengambil alih tempatnya. Pelari di posisi pertama masih memimpin di depanmu!"
  },
  {
    id: 10,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Jam dinding berdentang 3 kali dalam 4 detik. Berapa detik waktu yang dibutuhkan untuk berdentang 6 kali?",
    opsi: { A: "12 detik", B: "8 detik", C: "14 detik", D: "10 detik" },
    kunci: "D",
    penjelasan: "10 detik! 3 dentang memiliki 2 jeda (4 detik ÷ 2 = 2 detik per jeda). 6 dentang memiliki 5 jeda, jadi 5 × 2 detik = 10 detik."
  },
  {
    id: 11,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Kamu masuk ruangan gelap berisi lilin, lampu minyak, dan kompor gas dengan 1 korek api. Apa yang harus dinyalakan pertama kali?",
    opsi: { A: "Lilin", B: "Lampu minyak", C: "Kompor gas", D: "Korek apinya" },
    kunci: "D",
    penjelasan: "Korek apinya dulu dong! Tanpa menyalakan korek api terlebih dahulu, benda lainnya tidak akan bisa menyala."
  },
  {
    id: 12,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Ada berapa bulan dalam satu tahun masehi yang memiliki 28 hari?",
    opsi: { A: "1 bulan", B: "2 bulan", C: "Semua bulan (12)", D: "6 bulan" },
    kunci: "C",
    penjelasan: "Semua 12 bulan! Setiap bulan memiliki setidaknya 28 hari, hanya saja Februari berhenti di hari ke-28 atau 29."
  },
  {
    id: 13,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Makin banyak kamu mengambil dariku, makin besar jadinya aku. Benda apakah aku?",
    opsi: { A: "Utang", B: "Lubang", C: "Bayangan", D: "Timbangan" },
    kunci: "B",
    penjelasan: "Lubang! Semakin banyak tanah yang kamu ambil dan gali, maka lubang tersebut akan menjadi semakin besar."
  },
  {
    id: 14,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Dokter memberimu 3 butir pil dan berpesan minum 1 pil tiap 30 menit. Pil pertama langsung diminum. Kapan seluruh pil habis?",
    opsi: { A: "1,5 jam", B: "1 jam", C: "2 jam", D: "30 menit" },
    kunci: "B",
    penjelasan: "1 jam! Pil pertama diminum di menit ke-0, pil kedua menit ke-30, dan pil ketiga di menit ke-60 (1 jam)."
  },
  {
    id: 15,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Apa yang bisa kamu patahkan dengan mudah tanpa perlu pernah menyentuhnya sama sekali?",
    opsi: { A: "Janji", B: "Kaca", C: "Tulang", D: "Ranting" },
    kunci: "A",
    penjelasan: "Janji! Kamu bisa mematahkan atau mengingkari janji tanpa sentuhan fisik. Jagalah selalu komitmenmu ya!"
  },
  {
    id: 16,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Sebuah pesawat jatuh tepat di garis perbatasan dua negara. Di manakah para penumpang yang SELAMAT dimakamkan?",
    opsi: { A: "Di negara asal", B: "Di negara tujuan", C: "Tepat di perbatasan", D: "Tidak dimakamkan" },
    kunci: "D",
    penjelasan: "Tidak dimakamkan! Penumpang yang selamat kan masih hidup, masa mau dimakamkan? Baca soalnya dengan teliti ya!"
  },
  {
    id: 17,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Benda ini memiliki puluhan kunci (keys), namun tidak bisa digunakan untuk membuka satu pintu pun. Apakah itu?",
    opsi: { A: "Keyboard", B: "Gembok", C: "Brankas", D: "Koper" },
    kunci: "A",
    penjelasan: "Keyboard komputer atau piano! Keduanya memiliki tombol tuts yang dalam bahasa Inggris disebut 'keys'."
  },
  {
    id: 18,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Seekor ayam jantan bertelur tepat di puncak atap rumah perbatasan. Ke arah mana telur tersebut akan menggelinding?",
    opsi: { A: "Ke sisi kiri", B: "Ke sisi kanan", C: "Tidak menggelinding", D: "Ayam jantan tidak bertelur" },
    kunci: "D",
    penjelasan: "Ayam jantan tidak pernah bertelur! Yang bertelur adalah ayam betina. Jangan terjebak fisika kemiringan atap ya!"
  },
  {
    id: 19,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Mana yang lebih berat: 1 kilogram kapas atau 1 kilogram lempengan besi?",
    opsi: { A: "Besi", B: "Kapas", C: "Sama berat", D: "Tergantung gravitasi" },
    kunci: "C",
    penjelasan: "Sama berat! Keduanya sama-sama memiliki massa 1 kilogram. Besi hanya memiliki kerapatan volume yang jauh lebih padat."
  },
  {
    id: 20,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Sesuatu yang selalu dijanjikan akan datang, namun kenyataannya tidak pernah benar-benar tiba. Apakah itu?",
    opsi: { A: "Kemarin", B: "Besok", C: "Lusa", D: "Masa lalu" },
    kunci: "B",
    penjelasan: "Besok! Karena begitu saatnya tiba, namanya sudah berganti menjadi 'hari ini'. Jangan menunda impianmu sampai besok!"
  },
  {
    id: 21,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Peternak memiliki 17 ekor kambing. Semuanya kabur melarikan diri KECUALI 9 ekor. Berapa ekor kambing yang masih tersisa?",
    opsi: { A: "9 ekor", B: "8 ekor", C: "17 ekor", D: "0 ekor" },
    kunci: "A",
    penjelasan: "9 ekor! Kata kuncinya adalah 'kecuali 9 ekor', artinya sembilan ekor itulah yang tidak kabur dan masih tinggal di kandang."
  },
  {
    id: 22,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Dua ayah dan dua anak pergi memancing bersama. Masing-masing menangkap 1 ikan, dan totalnya terkumpul 3 ekor ikan. Bagaimana mungkin?",
    opsi: { A: "Satu ikan terlepas", B: "Satu ikan dimakan", C: "Mereka terdiri dari kakek, ayah, dan anak", D: "Ada yang berbohong" },
    kunci: "C",
    penjelasan: "Mereka terdiri dari Kakek, Ayah, dan Anak! Kakek & Ayah adalah 2 ayah, sedangkan Ayah & Anak adalah 2 anak (total hanya 3 orang)."
  },
  {
    id: 23,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Sebuah bilangan dua digit. Jumlah digitnya adalah 9. Digit puluhan besarnya 3 kali digit satuan. Berapakah bilangan itu?",
    opsi: { A: "36", B: "72", C: "81", D: "63" },
    kunci: "D",
    penjelasan: "63! Angka puluhannya (6) adalah 3 kali angka satuannya (3), dan 6 + 3 = 9. Soal aljabar cepat yang memuaskan!"
  },
  {
    id: 24,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Hari ini adalah hari Rabu. Hari apakah tepat 100 hari terhitung mulai hari ini?",
    opsi: { A: "Kamis", B: "Minggu", C: "Jumat", D: "Sabtu" },
    kunci: "C",
    penjelasan: "Jumat! Satu minggu ada 7 hari. 100 dibagi 7 bersisa 2 hari (98 habis dibagi 7). Jadi maju 2 hari dari Rabu adalah Jumat."
  },
  {
    id: 25,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Pola kuadrat sempurna berurutan: 1, 4, 9, 16, 25, ... Berapakah angka berikutnya?",
    opsi: { A: "36", B: "30", C: "49", D: "32" },
    kunci: "A",
    penjelasan: "36! Pola ini adalah bilangan kuadrat berurutan: 1², 2², 3², 4², 5², dan berikutnya adalah 6² = 36."
  },
  {
    id: 26,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Pola bilangan pangkat tiga (kubik): 1, 8, 27, 64, ... Berapakah angka selanjutnya?",
    opsi: { A: "100", B: "125", C: "81", D: "121" },
    kunci: "B",
    penjelasan: "125! Pola ini adalah kubik berurutan: 1³, 2³, 3³, 4³, dan selanjutnya adalah 5³ = 125."
  },
  {
    id: 27,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Tebak huruf berikutnya pada urutan unik ini: S, S, R, K, J, S, ... ?",
    opsi: { A: "S", B: "M", C: "A", D: "P" },
    kunci: "B",
    penjelasan: "M (Minggu)! Ini adalah huruf depan nama-nama hari: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, dan Minggu!"
  },
  {
    id: 28,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Jika 'kemarin' adalah lusa dari hari Selasa, maka hari apakah sekarang?",
    opsi: { A: "Kamis", B: "Jumat", C: "Sabtu", D: "Rabu" },
    kunci: "B",
    penjelasan: "Jumat! Lusa dari Selasa adalah Kamis. Jika kemarin adalah hari Kamis, maka hari ini pastilah hari Jumat."
  },
  {
    id: 29,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Budi punya saudara laki-laki sama banyak dengan saudara perempuannya. Tapi saudarinya punya saudara laki-laki 2 kali lebih banyak dari saudari perempuannya. Berapa total anak dalam keluarga itu?",
    opsi: { A: "5 anak", B: "7 anak", C: "6 anak", D: "8 anak" },
    kunci: "B",
    penjelasan: "7 anak (4 laki-laki dan 3 perempuan)! Budi punya 3 saudara laki-laki dan 3 saudari perempuan. Bagi saudarinya, saudara laki-lakinya ada 4 dan saudari perempuannya ada 2 (2x lipat)."
  },
  {
    id: 30,
    kategori_kode: "logika",
    kategori_label: "The Logic Master",
    pertanyaan: "Dalam durasi 12 jam putaran waktu, berapa kali jarum panjang dan pendek membentuk sudut tepat 90 derajat?",
    opsi: { A: "24 kali", B: "22 kali", C: "12 kali", D: "48 kali" },
    kunci: "B",
    penjelasan: "22 kali! Meskipun dalam 1 jam terbentuk sekitar 2 kali sudut siku-siku, karena jarum jam juga terus bergerak, sudut 90 derajat hanya terjadi 22 kali dalam 12 jam."
  },

  // ==========================================
  // KATEGORI 2: DETEKTIF DATA INDONESIA (30 UNIQUE)
  // ==========================================
  {
    id: 31,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Hasil resmi Sensus Penduduk 2020 (SP2020) mencatat jumlah penduduk Indonesia sekitar berapa?",
    opsi: { A: "170,5 juta jiwa", B: "210,3 juta jiwa", C: "270,2 juta jiwa", D: "320,1 juta jiwa" },
    kunci: "C",
    penjelasan: "270,2 juta jiwa! Sensus Penduduk 2020 membuktikan bahwa Indonesia memiliki kekayaan sumber daya manusia yang luar biasa besar."
  },
  {
    id: 32,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Kelompok generasi manakah yang memiliki proporsi penduduk terbanyak di Indonesia menurut SP2020?",
    opsi: { A: "Gen Z (27,94%)", B: "Milenial (25,87%)", C: "Gen X (21,88%)", D: "Baby Boomer (11,56%)" },
    kunci: "A",
    penjelasan: "Gen Z mendominasi data kependudukan Indonesia dengan persentase 27,94%! Kalian adalah pilar kekuatan digital masa depan bangsa."
  },
  {
    id: 33,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Provinsi manakah yang memiliki jumlah penduduk terbanyak di Indonesia (mencapai lebih dari 48 juta jiwa)?",
    opsi: { A: "DKI Jakarta", B: "Jawa Timur", C: "Jawa Barat", D: "Jawa Tengah" },
    kunci: "C",
    penjelasan: "Jawa Barat! Populasinya melebihi 48 juta jiwa, bahkan lebih banyak daripada total penduduk negara Spanyol atau Kanada!"
  },
  {
    id: 34,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Ketika harga barang, kuota internet, dan jajan naik, BPS mengukur angka inflasi melalui indeks apa?",
    opsi: { A: "Indeks Pembangunan Manusia", B: "Indeks Harga Konsumen (IHK)", C: "Produk Domestik Bruto", D: "Rasio Gini" },
    kunci: "B",
    penjelasan: "IHK (Indeks Harga Konsumen)! BPS memantau ribuan harga komoditas setiap bulan di berbagai kota untuk menghitung inflasi."
  },
  {
    id: 35,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Secara global, Indonesia menempati urutan ke berapa negara dengan jumlah penduduk terbanyak di dunia?",
    opsi: { A: "Urutan ke-2", B: "Urutan ke-3", C: "Urutan ke-4", D: "Urutan ke-6" },
    kunci: "C",
    penjelasan: "Urutan ke-4 di dunia, tepat berada di belakang India, Tiongkok, dan Amerika Serikat!"
  },
  {
    id: 36,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Indeks Pembangunan Manusia (IPM) dirilis BPS dari 3 dimensi utama. Mana yang BUKAN bagian dari IPM?",
    opsi: { A: "Umur panjang & hidup sehat", B: "Pengetahuan/Pendidikan", C: "Standar hidup layak", D: "Jumlah followers media sosial" },
    kunci: "D",
    penjelasan: "Followers medsos belum masuk hitungan! IPM mengukur kualitas hidup manusia dari kesehatan, pendidikan, dan daya beli pengeluaran riil."
  },
  {
    id: 37,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Setiap tanggal berapakah 'Hari Statistik Nasional' diperingati di Indonesia?",
    opsi: { A: "17 Agustus", B: "26 September", C: "28 Oktober", D: "2 Mei" },
    kunci: "B",
    penjelasan: "26 September! Memperingati diundangkannya UU No. 7 Tahun 1960 tentang Statistik yang menjadi tonggak kemerdekaan statistik nasional."
  },
  {
    id: 38,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Survei berkala BPS yang khusus mendata angkatan kerja, pengangguran, dan dunia ketenagakerjaan bernama...",
    opsi: { A: "Susenas", B: "Sakernas", C: "Sensus Pertanian", D: "Survei Biaya Hidup" },
    kunci: "B",
    penjelasan: "Sakernas (Survei Angkatan Kerja Nasional)! Dari survei inilah pemerintah mengetahui tingkat pengangguran terbuka (TPT)."
  },
  {
    id: 39,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Membentang dari Sabang sampai Merauke, wilayah Indonesia terbagi ke dalam berapa zona waktu?",
    opsi: { A: "2 Zona", B: "3 Zona (WIB, WITA, WIT)", C: "4 Zona", D: "5 Zona" },
    kunci: "B",
    penjelasan: "3 Zona Waktu: WIB, WITA, dan WIT. Luasnya bentangan geografis ini menjadi kebanggaan sekaligus tantangan sensus lapangan BPS!"
  },
  {
    id: 40,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Meski luas daratannya hanya sekitar 7% dari Indonesia, Pulau Jawa dihuni oleh sekitar berapa persen penduduk?",
    opsi: { A: "25%", B: "40%", C: "56%", D: "75%" },
    kunci: "C",
    penjelasan: "Sekitar 56% penduduk Indonesia terkonsentrasi di Pulau Jawa! Ini menunjukkan pentingnya pemerataan pembangunan ke luar Jawa."
  },
  {
    id: 41,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Setelah peresmian pemekaran wilayah di Pulau Papua, Indonesia saat ini resmi terdiri dari berapa provinsi?",
    opsi: { A: "34 Provinsi", B: "36 Provinsi", C: "37 Provinsi", D: "38 Provinsi" },
    kunci: "D",
    penjelasan: "38 Provinsi! Data statistik BPS selalu mutakhir mengikuti batas wilayah administrasi pemerintahan terbaru."
  },
  {
    id: 42,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Menurut batasan klasifikasi BPS, kelompok Generasi Z mencakup mereka yang lahir pada rentang tahun...",
    opsi: { A: "1965 – 1980", B: "1981 – 1996", C: "1997 – 2012", D: "2013 ke atas" },
    kunci: "C",
    penjelasan: "1997 sampai 2012! Anak-anak SMA saat ini adalah bagian inti dari Generasi Z yang fasih teknologi digital."
  },
  {
    id: 43,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Inovasi bersejarah apa yang pertama kali diterapkan BPS pada Sensus Penduduk 2020 dibanding sensus sebelumnya?",
    opsi: { A: "Warga mengisi data secara mandiri lewat sensus online", B: "Sensus hanya dilakukan di kota besar", C: "Sensus via SMS berbayar", D: "Petugas sensus menggunakan drone" },
    kunci: "A",
    penjelasan: "Sensus Penduduk Online! Jutaan keluarga Indonesia secara mandiri mencatatkan data keluarganya langsung melalui internet."
  },
  {
    id: 44,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Kondisi di mana proporsi penduduk usia produktif (15-64 tahun) mencapai lebih dari 70% di Indonesia disebut...",
    opsi: { A: "Ledakan Penduduk", B: "Bonus Demografi", C: "Transisi Ekonomi", D: "Piramida Terbalik" },
    kunci: "B",
    penjelasan: "Bonus Demografi! Peluang emas bagi bangsa Indonesia untuk melompat menjadi negara maju dengan generasi produktif yang kompeten."
  },
  {
    id: 45,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Jika seorang triliuner masuk ke warung kopi berisi 10 orang biasa, ukuran statistik manakah yang TIDAK goyah oleh nilai ekstrem tersebut?",
    opsi: { A: "Rata-rata (Mean)", B: "Median (Nilai Tengah)", C: "Jumlah Total", D: "Nilai Maksimum" },
    kunci: "B",
    penjelasan: "Median (Nilai Tengah)! Statistisi menggunakan median karena kebal terhadap data pencilan (outlier) ekstrem."
  },
  {
    id: 46,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Berdasarkan standar ILO yang diadopsi BPS, seseorang dinyatakan 'bekerja' jika bekerja minimal berapa lama dalam seminggu?",
    opsi: { A: "1 jam", B: "10 jam", C: "24 jam", D: "40 jam" },
    kunci: "A",
    penjelasan: "Minimal 1 jam berturut-turut dalam seminggu dengan maksud memperoleh atau membantu memperoleh pendapatan."
  },
  {
    id: 47,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Garis Kemiskinan yang dihitung BPS diukur berdasarkan pendekatan kebutuhan dasar dari sisi...",
    opsi: { A: "Jumlah tabungan di bank", B: "Rata-rata pengeluaran makanan & non-makanan per kapita", C: "Jumlah kepemilikan kendaraan", D: "Gaji kotor bulanan" },
    kunci: "B",
    penjelasan: "Pengeluaran pemenuhan kebutuhan dasar makanan (2100 kkal per hari) dan kebutuhan perumahan, sandang, serta pendidikan minimum."
  },
  {
    id: 48,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Provinsi manakah yang memiliki tingkat kepadatan penduduk tertinggi per kilometer persegi di Indonesia?",
    opsi: { A: "DKI Jakarta", B: "Jawa Barat", C: "Banten", D: "DI Yogyakarta" },
    kunci: "A",
    penjelasan: "DKI Jakarta! Kepadatannya melebihi 15.000 jiwa per km², menjadikannya wilayah paling padat di tanah air."
  },
  {
    id: 49,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Survei tahunan BPS yang memotret pengeluaran makanan, jajan seblak, biaya kuota, dan kesehatan masyarakat bernama...",
    opsi: { A: "Susenas", B: "Sensus Pertanian", C: "Survei Industri", D: "Sakernas" },
    kunci: "A",
    penjelasan: "Susenas (Survei Sosial Ekonomi Nasional)! Survei ini menjadi rujukan utama penghitungan angka kemiskinan dan ketimpangan sosial."
  },
  {
    id: 50,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Hasil Sensus Penduduk 2020 mencatat Rasio Jenis Kelamin (Sex Ratio) Indonesia adalah 102. Apa artinya?",
    opsi: { A: "Terdapat 102 laki-laki per 100 perempuan", B: "Terdapat 102 perempuan per 100 laki-laki", C: "Jumlah perempuan lebih banyak", D: "Populasi berimbang sempurna" },
    kunci: "A",
    penjelasan: "Terdapat 102 laki-laki untuk setiap 100 penduduk perempuan di Indonesia. Secara total, jumlah laki-laki sedikit lebih banyak."
  },
  {
    id: 51,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Berdasarkan rujukan Keputusan Mendagri yang dibukukan BPS, Indonesia memiliki berapa pulau resmi bernama?",
    opsi: { A: "10.000 pulau", B: "13.466 pulau", C: "17.001 pulau", D: "25.000 pulau" },
    kunci: "C",
    penjelasan: "17.001 pulau resmi! Menegaskan status nusantara sebagai salah satu negara kepulauan terbesar di muka bumi."
  },
  {
    id: 52,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Sensus Penduduk di Indonesia secara periodik dan teratur dilaksanakan setiap berapa tahun sekali?",
    opsi: { A: "5 tahun sekali", B: "10 tahun sekali (tahun berakhiran 0)", C: "15 tahun sekali", D: "20 tahun sekali" },
    kunci: "B",
    penjelasan: "10 tahun sekali pada tahun berakhiran 0 (SP1971, SP1980, SP1990, SP2000, SP2010, SP2020, dan berikutnya SP2030)."
  },
  {
    id: 53,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Sensus Pertanian (ST) yang memotret struktur pangan dan petani Indonesia rutin diadakan di tahun berakhiran angka...",
    opsi: { A: "Angka 1", B: "Angka 3 (misal ST2023)", C: "Angka 5", D: "Angka 8" },
    kunci: "B",
    penjelasan: "Tahun berakhiran 3! Kegiatan terbarunya adalah Sensus Pertanian 2023 (ST2023) untuk kedaulatan pangan nasional."
  },
  {
    id: 54,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Angka Harapan Hidup (AHH) saat lahir penduduk Indonesia rata-rata saat ini telah melampaui...",
    opsi: { A: "55 tahun", B: "62 tahun", C: "71 tahun", D: "85 tahun" },
    kunci: "C",
    penjelasan: "Lebih dari 71 tahun! Peningkatan akses layanan kesehatan dan gizi mendorong harapan hidup orang Indonesia makin meningkat."
  },
  {
    id: 55,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Sensus Ekonomi (SE) yang memetakan seluruh aktivitas bisnis non-pertanian diadakan di tahun berakhiran...",
    opsi: { A: "Angka 2", B: "Angka 6 (misal SE2026)", C: "Angka 7", D: "Angka 9" },
    kunci: "B",
    penjelasan: "Tahun berakhiran 6 (SE1986, SE1996, SE2006, SE2016, dan yang akan datang adalah SE2026)!"
  },
  {
    id: 56,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Ukuran statistik angka 0 sampai 1 yang digunakan BPS untuk mengukur derajat ketimpangan pengeluaran masyarakat adalah...",
    opsi: { A: "Gini Ratio (Rasio Gini)", B: "Indeks Williamson", C: "Standar Deviasi", D: "Varians Kuartil" },
    kunci: "A",
    penjelasan: "Gini Ratio! Nilai mendekati 0 berarti pemerataan sempurna, sedangkan mendekati 1 berarti ketimpangan ekstrem."
  },
  {
    id: 57,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Pulau manakah yang menyumbang kontribusi Produk Domestik Bruto (PDB) ekonomi terbesar bagi Indonesia (>57%)?",
    opsi: { A: "Pulau Sumatera", B: "Pulau Jawa", C: "Pulau Kalimantan", D: "Pulau Sulawesi" },
    kunci: "B",
    penjelasan: "Pulau Jawa menyumbang lebih dari 57% total perekonomian nasional, disusul oleh Pulau Sumatera di posisi kedua."
  },
  {
    id: 58,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Apa nama situs web resmi portal data terintegrasi tempat masyarakat bisa mengunduh publikasi BPS secara gratis?",
    opsi: { A: "bps.go.id", B: "data.com", C: "statistik.id", D: "sensusterkini.go.id" },
    kunci: "A",
    penjelasan: "bps.go.id! Seluruh publikasi statistik dari tingkat nasional hingga kabupaten/kota dapat diakses gratis oleh siapa saja."
  },
  {
    id: 59,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Aplikasi smartphone resmi dari BPS untuk membaca tabel dan infografis data statistik langsung di genggaman adalah...",
    opsi: { A: "AllStats BPS", B: "DataKita", C: "InfoStat", D: "StatMobile" },
    kunci: "A",
    penjelasan: "AllStats BPS! Tersedia di Google Play Store dan App Store untuk kemudahan akses data statistik kapan pun."
  },
  {
    id: 60,
    kategori_kode: "data",
    kategori_label: "Detektif Data Indonesia",
    pertanyaan: "Layanan literasi dan konsultasi statistik kolaborasi antara BPS dengan perguruan tinggi/kampus dinamakan...",
    opsi: { A: "Pojok Statistik", B: "Posko Data", C: "Kedai Sensus", D: "Klinik Angka" },
    kunci: "A",
    penjelasan: "Pojok Statistik! Dihadirkan di berbagai universitas untuk mendekatkan mahasiswa dan akademisi dengan data statistik resmi."
  },

  // ==========================================
  // KATEGORI 3: PEJUANG STIS & KEDINASAN (30 UNIQUE)
  // ==========================================
  {
    id: 61,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Bagaimana ketentuan pembiayaan kuliah bagi mahasiswa yang lolos ikatan dinas Politeknik Statistika STIS?",
    opsi: { A: "Membayar UKT tiap semester", B: "Bebas biaya pendidikan selama masa studi ikatan dinas", C: "Bayar dulu baru diganti setelah lulus", D: "Wajib mencari sponsor swasta" },
    kunci: "B",
    penjelasan: "Bebas biaya kuliah! Sebagai perguruan tinggi kedinasan ikatan dinas, biaya pendidikan mahasiswa STIS ditanggung oleh negara."
  },
  {
    id: 62,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Setelah menyelesaikan masa studi dan memenuhi persyaratan kedinasan, lulusan STIS diangkat menjadi apa?",
    opsi: { A: "Pegawai Bank Swasta", B: "Freelancer Independen", C: "Calon Pegawai Negeri Sipil (CPNS) di lingkungan BPS", D: "Staf Khusus Kementerian Luar Negeri" },
    kunci: "C",
    penjelasan: "Diangkat sebagai CPNS di lingkungan Badan Pusat Statistik (BPS)! Jalur karir pasti sebagai abdi negara di bidang data."
  },
  {
    id: 63,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Di manakah lokasi kampus utama Politeknik Statistika STIS berada?",
    opsi: { A: "Jl. Otto Iskandardinata (Otista), Jakarta Timur", B: "Kawasan Dago, Kota Bandung", C: "Kawasan Bulaksumur, Yogyakarta", D: "Margonda, Kota Depok" },
    kunci: "A",
    penjelasan: "Jl. Otto Iskandardinata No. 64C, Jakarta Timur! Berlokasi strategis di ibu kota negara dengan akses transportasi terpadu."
  },
  {
    id: 64,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Tiga program studi resmi yang diselenggarakan di Politeknik Statistika STIS saat ini adalah...",
    opsi: { A: "D-III Statistika, D-IV Statistika, D-IV Komputasi Statistik", B: "D-IV Informatika, D-IV Akuntansi, D-IV Manajemen", C: "S1 Matematika, S1 Sains Data, D-III Komputer", D: "D-IV Perpajakan, D-IV Bea Cukai, D-III Akuntansi" },
    kunci: "A",
    penjelasan: "D-III Statistika, D-IV Statistika, dan D-IV Komputasi Statistik! Tiga prodi unggulan untuk mencetak talenta data handal."
  },
  {
    id: 65,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Bagi kamu yang hobi ngoding, arsitektur database, algoritma AI, dan rekayasa big data, prodi STIS manakah yang paling pas?",
    opsi: { A: "D-IV Komputasi Statistik", B: "D-III Statistika", C: "D-IV Statistika", D: "Manajemen Data" },
    kunci: "A",
    penjelasan: "D-IV Komputasi Statistik! Memadukan ilmu statistika dengan computer science, machine learning, dan software development modern."
  },
  {
    id: 66,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Bagi kamu yang menyukai analisis fenomena ekonomi, perancangan survei sosial, dan inferensi statistika, prodi STIS yang tepat adalah...",
    opsi: { A: "Program Studi Statistika (D-III / D-IV)", B: "Teknik Telekomunikasi", C: "Ilmu Komunikasi", D: "Administrasi Fiskal" },
    kunci: "A",
    penjelasan: "Program Studi Statistika! Fokus mendalami perancangan metode survei, penarikan sampel (sampling), dan ekonometrika."
  },
  {
    id: 67,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Tahap seleksi berbasis komputer menggunakan sistem CAT BKN yang wajib dilalui peserta sekolah kedinasan adalah...",
    opsi: { A: "Seleksi Kompetensi Dasar (SKD)", B: "Ujian Tulis Berbasis Komputer (UTBK)", C: "Tes Bahasa Inggris TOEFL", D: "Ujian Kelulusan Nasional" },
    kunci: "A",
    penjelasan: "SKD (Seleksi Kompetensi Dasar)! Meliputi Tes Karakteristik Pribadi (TKP), Tes Intelegensia Umum (TIU), dan Tes Wawasan Kebangsaan (TWK)."
  },
  {
    id: 68,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Pintu pendaftaran online pertama untuk seleksi sekolah kedinasan STIS terpusat melalui portal resmi...",
    opsi: { A: "dikdin.bkn.go.id (SSCASN BKN)", B: "snpmb.bppp.kemdikbud.go.id", C: "portal.stis.ac.id saja", D: "prakerja.go.id" },
    kunci: "A",
    penjelasan: "Portal SSCASN Sekolah Kedinasan BKN (dikdin.bkn.go.id) sebelum melanjutkan pengisian berkas di portal SPMB STIS."
  },
  {
    id: 69,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Mitos atau Fakta: Siswa lulusan jurusan IPS, Bahasa, atau SMK/MAK dilarang mendaftar ke STIS?",
    opsi: { A: "Fakta, hanya lulusan SMA IPA yang boleh", B: "Mitos! Lulusan SMA/MA/SMK/MAK semua jurusan kini dapat mendaftar jika memenuhi syarat", C: "Hanya anak SMK Komputer yang boleh", D: "Hanya lulusan madrasah aliyah" },
    kunci: "B",
    penjelasan: "Mitos! Pada ketentuan SPMB terkini, lulusan kelas XII SMA/MA/SMK/MAK semua peminatan jurusan berhak mendaftar asalkan nilai rapor matematika memenuhi syarat."
  },
  {
    id: 70,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Mitos atau Fakta: Apakah harus pernah menjuarai olimpiade sains/matematika untuk bisa lulus SPMB STIS?",
    opsi: { A: "Fakta, minimal medali perunggu OSN", B: "Mitos! Yang terpenting adalah persiapan tekun, logika terlatih, dan disiplin belajar", C: "Wajib punya piagam internasional", D: "Harus anak guru matematika" },
    kunci: "B",
    penjelasan: "Mitos! Ribuan mahasiswa STIS berasal dari berbagai latar belakang sekolah biasa dari pelosok negeri yang gigih berlatih soal."
  },
  {
    id: 71,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Jenjang pendidikan Diploma IV (D-IV) di Politeknik Statistika STIS secara regulasi pendidikan setara dengan jenjang...",
    opsi: { A: "Sarjana Terapan (setara S1)", B: "Magister Terapan (S2)", C: "Diploma II", D: "Sekolah Vokasi Menengah" },
    kunci: "A",
    penjelasan: "Sarjana Terapan (setara S1)! Menekankan keseimbangan teori mendalam dengan keterampilan praktik terapan di dunia nyata."
  },
  {
    id: 72,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Setelah diangkat menjadi ASN di lingkungan BPS, lulusan ikatan dinas STIS dapat ditempatkan di mana?",
    opsi: { A: "Hanya di kantor pusat Jakarta", B: "Hanya di ibu kota provinsi", C: "Di seluruh unit kerja BPS (Pusat, Provinsi, Kabupaten/Kota) di seluruh Indonesia", D: "Hanya di pulau asal masing-masing" },
    kunci: "C",
    penjelasan: "BPS memiliki kantor di Pusat, 38 Provinsi, dan lebih dari 500 Kabupaten/Kota di seluruh Indonesia. Pengabdian sejati untuk nusantara!"
  },
  {
    id: 73,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Apa makna penandatanganan Surat Perjanjian Ikatan Dinas (SPID) bagi mahasiswa baru STIS?",
    opsi: { A: "Wajib mengembalikan biaya kuliah jika lulus", B: "Komitmen bersedia mengabdi dan ditempatkan sebagai ASN di unit kerja BPS", C: "Larangan memiliki media sosial", D: "Perjanjian tidak boleh menikah selamanya" },
    kunci: "B",
    penjelasan: "Komitmen pengabdian! Kuliah dibiayai negara dengan timbal balik kewajiban mengabdi di instansi BPS sesuai masa perjanjian ikatan dinas."
  },
  {
    id: 74,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Sebelum bertransformasi menjadi Politeknik Statistika STIS, singkatan STIS pada awalnya merupakan kependekan dari...",
    opsi: { A: "Sekolah Tinggi Ilmu Statistik", B: "Sekolah Teknik Informasi Statistik", C: "Sentra Terpadu Informatika Sosial", D: "Sekolah Tinggi Industri Sensus" },
    kunci: "A",
    penjelasan: "Sekolah Tinggi Ilmu Statistik (STIS), yang cikal bakalnya telah ada sejak era Akademi Ilmu Statistik (AIS) tahun 1958!"
  },
  {
    id: 75,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Politeknik Statistika STIS secara kelembagaan berada di bawah naungan lembaga pemerintah apa?",
    opsi: { A: "Badan Pusat Statistik (BPS RI)", B: "Kementerian BUMN", C: "Bank Indonesia", D: "Kementerian PPN / Bappenas" },
    kunci: "A",
    penjelasan: "Badan Pusat Statistik (BPS RI)! STIS adalah kawah candradimuka resmi pencetak tenaga ahli statistik bagi negara."
  },
  {
    id: 76,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Bagi peserta yang telah dinyatakan lolos nilai ambang batas SKD CAT, tahapan Seleksi Lanjutan tahap pertama adalah...",
    opsi: { A: "Tes Matematika Akademik", B: "Uji Kemahiran Mengetik", C: "Wawancara Politik", D: "Tes Ketangkasan Berenang" },
    kunci: "A",
    penjelasan: "Tes Matematika Akademik! Menguji penguasaan konsep aljabar, kalkulus dasar, logika analitis, dan penalaran matematika."
  },
  {
    id: 77,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Tiga sub-tes utama yang diujikan dalam tes Seleksi Kompetensi Dasar (SKD) CAT kedinasan adalah...",
    opsi: { A: "TWK, TIU, dan TKP", B: "Fisika, Kimia, dan Biologi", C: "TPA, TOEFL, dan Wawancara", D: "Matematika, Bahasa Indonesia, dan Bahasa Inggris" },
    kunci: "A",
    penjelasan: "TWK (Tes Wawasan Kebangsaan), TIU (Tes Intelegensia Umum), dan TKP (Tes Karakteristik Pribadi)."
  },
  {
    id: 78,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Penerimaan mahasiswa baru STIS membuka jalur khusus bagi putra-putri daerah tertentu yang disebut...",
    opsi: { A: "Jalur Afirmasi Kewilayahan", B: "Jalur Undangan Rapor", C: "Jalur Atlet Berprestasi", D: "Jalur Sumbangan Mandiri" },
    kunci: "A",
    penjelasan: "Jalur Afirmasi Kewilayahan! Diperuntukkan bagi putra-putri daerah afirmasi (seperti Papua, Maluku, NTT) untuk pemerataan SDM statistik."
  },
  {
    id: 79,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Jalur penerimaan STIS hasil kerja sama dengan Pemerintah Daerah untuk penempatan kembali di Pemda mitra adalah...",
    opsi: { A: "Jalur Pembibitan", B: "Jalur Konsorsium", C: "Jalur Mandiri", D: "Jalur Titipan" },
    kunci: "A",
    penjelasan: "Jalur Pembibitan! Mahasiswa dibiayai dan dipersiapkan untuk menjadi aparatur statistik di pemerintah daerah asal yang bermitra."
  },
  {
    id: 80,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Gelar akademik vokasi yang berhak disandang oleh lulusan program studi D-IV Statistika STIS adalah...",
    opsi: { A: "S.Tr.Stat (Sarjana Terapan Statistika)", B: "S.Stat (Sarjana Statistika)", C: "S.Si (Sarjana Sains)", D: "A.Md.Stat" },
    kunci: "A",
    penjelasan: "S.Tr.Stat (Sarjana Terapan Statistika)! Gelar resmi nasional untuk lulusan sarjana terapan bidang statistik."
  },
  {
    id: 81,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Gelar akademik vokasi yang disandang oleh lulusan program studi D-IV Komputasi Statistik STIS adalah...",
    opsi: { A: "S.Tr.Kom (Sarjana Terapan Komputer)", B: "S.Kom (Sarjana Komputer)", C: "S.T (Sarjana Teknik)", D: "A.Md.Kom" },
    kunci: "A",
    penjelasan: "S.Tr.Kom (Sarjana Terapan Komputer)! Mengukuhkan keahlian ganda dalam komputasi rekayasa data dan statistik."
  },
  {
    id: 82,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Bagaimanakah tata tertib busana perkuliahan harian bagi seluruh mahasiswa di lingkungan kampus Politeknik Statistika STIS?",
    opsi: { A: "Mengenakan seragam dinas harian (PDH) kampus resmi", B: "Bebas memakai kaos oblong dan celana jeans", C: "Wajib memakai setelan jas pesta", D: "Bebas asalkan sopan tanpa aturan warna" },
    kunci: "A",
    penjelasan: "Mengenakan seragam dinas harian (PDH)! Mencerminkan kedisiplinan, kerapian, dan jiwa korsa calon aparatur sipil negara."
  },
  {
    id: 83,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Kegiatan penelitian survei lapangan akbar berskala nasional yang rutin dijalankan mahasiswa tingkat 3 STIS dinamakan...",
    opsi: { A: "Praktek Kerja Lapangan (PKL) Nasional", B: "Kuliah Kerja Nyata (KKN)", C: "Studi Banding Wisata", D: "Latihan Militer Dasar" },
    kunci: "A",
    penjelasan: "PKL Nasional Mahasiswa STIS! Meneliti langsung fenomena sosial-ekonomi nyata di suatu provinsi secara ilmiah dan terstruktur."
  },
  {
    id: 84,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Untuk menjaga mutu akademik, STIS memberlakukan sistem evaluasi ketat setiap semester di mana mahasiswa bisa terkena...",
    opsi: { A: "Drop Out (DO) jika nilai tidak mencapai standar IPK minimum", B: "Denda uang tunai", C: "Skorsing kerja sosial", D: "Wajib mengulang dari semester 1" },
    kunci: "A",
    penjelasan: "Drop Out (DO)! Mahasiswa dituntut disiplin dan menjaga capaian IPK serta tidak boleh mendapatkan nilai E pada mata kuliah tertentu."
  },
  {
    id: 85,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Fasilitas riset dan laboratorium komputasi di STIS terhubung langsung dengan penyediaan data apa?",
    opsi: { A: "Data mikro & publikasi resmi sensus/survei BPS RI", B: "Data bursa saham wall street", C: "Data penerbangan militer", D: "Data telekomunikasi swasta" },
    kunci: "A",
    penjelasan: "Data mikro dan survei resmi BPS RI! Mahasiswa STIS memiliki akses istimewa untuk meneliti data riil pembangunan nasional."
  },
  {
    id: 86,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Rentang batas usia pendaftar SPMB Politeknik Statistika STIS umumnya adalah...",
    opsi: { A: "16 sampai 22 tahun per 1 September tahun berjalan", B: "Minimal 25 tahun", C: "Bebas tanpa batas umur", D: "Maksimal 18 tahun saja" },
    kunci: "A",
    penjelasan: "Umumnya minimal 16 tahun dan maksimal 22 tahun per 1 September tahun pendaftaran berjalan."
  },
  {
    id: 87,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Berapa batas minimal nilai rapor matematika yang disyaratkan untuk mendaftar seleksi SPMB STIS?",
    opsi: { A: "Minimal 80,00 (skala 100)", B: "Minimal 60,00", C: "Minimal 95,00", D: "Cukup lulus KKM sekolah" },
    kunci: "A",
    penjelasan: "Rata-rata nilai matematika minimal 80,00 pada rapor semester yang ditentukan sebagai bukti kesiapan logika numerik."
  },
  {
    id: 88,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Tahap seleksi kesehatan dan kebugaran pada SPMB STIS bertujuan untuk menguji apa?",
    opsi: { A: "Kondisi kesehatan fisik, bebas narkoba, dan ketahanan fisik penunjang kerja", B: "Kemampuan lari maraton 42 km", C: "Berat badan tepat 60 kg", D: "Keahlian bela diri khusus" },
    kunci: "A",
    penjelasan: "Kesehatan medis menyeluruh (laboratorium & organ dalam) serta kebugaran jasmani agar siap bertugas di pelosok nusantara."
  },
  {
    id: 89,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Sapaan akrab penuh kebanggaan bagi seluruh civitas dan mahasiswa/i di Politeknik Statistika STIS adalah...",
    opsi: { A: "Ksatria Data / Korps STIS", B: "Praja Muda", C: "Kadet Angka", D: "Laskar Sensus" },
    kunci: "A",
    penjelasan: "Ksatria Data / Korps STIS! Mencerminkan kehormatan, integritas, dan dedikasi tinggi dalam memperjuangkan kedaulatan data bangsa."
  },
  {
    id: 90,
    kategori_kode: "stis",
    kategori_label: "Pejuang STIS",
    pertanyaan: "Apakah lulusan STIS setelah beberapa tahun mengabdi sebagai ASN BPS berpeluang melanjutkan studi S2/S3 di dalam dan luar negeri?",
    opsi: { A: "Sangat berpeluang lewat program beasiswa Tugas Belajar ASN BPS / LPDP", B: "Dilarang kuliah lagi selamanya", C: "Hanya boleh kuliah di dalam kota saja", D: "Wajib pensiun dini jika mau S2" },
    kunci: "A",
    penjelasan: "Sangat berpeluang! BPS secara aktif mengirimkan pegawainya untuk melanjutkan studi master dan doktoral di kampus terbaik dunia."
  }
];

fs.writeFileSync('src/data/questions.json', JSON.stringify(questions, null, 2), 'utf8');
console.log('Successfully generated 90 100% UNIQUE curated questions!');
