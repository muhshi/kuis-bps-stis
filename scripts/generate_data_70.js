// Generator for 70 Data BPS questions
const fs = require('fs');
const path = require('path');

const dataQuestions = [
  {
    pertanyaan: "Berdasarkan hasil Sensus Penduduk 2020 (SP2020), Laju Pertumbuhan Penduduk (LPP) Indonesia per tahun periode 2010-2020 adalah...",
    opsi: {
      A: "1,25 persen",
      B: "1,98 persen",
      C: "2,45 persen",
      D: "0,85 persen"
    },
    kunci: "A",
    penjelasan: "1,25 persen per tahun! Laju pertumbuhan penduduk Indonesia melambat dibandingkan periode 2000-2010 yang sebesar 1,49 persen."
  },
  {
    pertanyaan: "Hasil resmi Sensus Pertanian 2023 (ST2023) mencatat jumlah Rumah Tangga Usaha Pertanian (RTUP) di Indonesia sekitar...",
    opsi: {
      A: "15,2 juta rumah tangga",
      B: "28,4 juta rumah tangga",
      C: "42,1 juta rumah tangga",
      D: "50,6 juta rumah tangga"
    },
    kunci: "B",
    penjelasan: "Sekitar 28,42 juta rumah tangga! ST2023 mencatat potret komprehensif struktur pertanian dan pelaku usaha tani di seluruh Indonesia."
  },
  {
    pertanyaan: "Berdasarkan hasil Sensus Pertanian 2023 (ST2023), berapa jumlah Petani Milenial (usia 19-39 tahun) di Indonesia?",
    opsi: {
      A: "Sekitar 1,2 juta orang",
      B: "Sekitar 3,4 juta orang",
      C: "Sekitar 6,18 juta orang",
      D: "Sekitar 14,5 juta orang"
    },
    kunci: "C",
    penjelasan: "Sekitar 6,18 juta orang (21,93% dari total petani)! Generasi muda ini menjadi kunci adopsi teknologi smart farming di Indonesia."
  },
  {
    pertanyaan: "Dalam definisi statistik BPS pada Sensus Pertanian, petani gurem diklasifikasikan sebagai pengelola lahan pertanian seluas...",
    opsi: {
      A: "Kurang dari 0,5 hektar",
      B: "Kurang dari 1,0 hektar",
      C: "Kurang dari 2,0 hektar",
      D: "Kurang dari 0,25 hektar"
    },
    kunci: "A",
    penjelasan: "Kurang dari 0,5 hektar (< 5.000 m²)! Jumlah petani gurem merupakan indikator penting dalam ketahanan ekonomi pertanian skala kecil."
  },
  {
    pertanyaan: "Sensus pertama yang diselenggarakan secara mandiri oleh pemerintah Republik Indonesia pasca-kemerdekaan adalah Sensus Penduduk tahun...",
    opsi: {
      A: "1945",
      B: "1950",
      C: "1961",
      D: "1971"
    },
    kunci: "C",
    penjelasan: "Tahun 1961! Sensus Penduduk 1961 disahkan atas instruksi Presiden Soekarno sebagai sensus resmi perdana bangsa Indonesia merdeka."
  },
  {
    pertanyaan: "Undang-Undang yang menjadi payung hukum utama perstatistikan di Indonesia hingga saat ini adalah...",
    opsi: {
      A: "UU No. 16 Tahun 1997",
      B: "UU No. 25 Tahun 2004",
      C: "UU No. 14 Tahun 2008",
      D: "UU No. 23 Tahun 2014"
    },
    kunci: "A",
    penjelasan: "UU No. 16 Tahun 1997 tentang Statistik! UU ini membagi kegiatan statistik menjadi statistik dasar, sektoral, dan khusus."
  },
  {
    pertanyaan: "Berdasarkan UU No. 16 Tahun 1997, lembaga pemerintah yang diberi wewenang tunggal menyelenggarakan Statistik Dasar adalah...",
    opsi: {
      A: "Bappenas",
      B: "Badan Pusat Statistik (BPS)",
      C: "Kementerian Keuangan",
      D: "Badan Riset dan Inovasi Nasional (BRIN)"
    },
    kunci: "B",
    penjelasan: "Badan Pusat Statistik (BPS)! Statistik dasar diselenggarakan untuk keperluan yang bersifat luas, lintas sektor, dan makro nasional."
  },
  {
    pertanyaan: "Kegiatan statistik yang pemanfaatannya ditujukan untuk memenuhi kebutuhan instansi kementerian/dinas tertentu dinamakan...",
    opsi: {
      A: "Statistik Khusus",
      B: "Statistik Dasar",
      C: "Statistik Sektoral",
      D: "Statistik Terapan"
    },
    kunci: "C",
    penjelasan: "Statistik Sektoral! Diselenggarakan oleh kementerian, lembaga pemerintah non-kementerian, atau instansi pemda terkait tupoksinya."
  },
  {
    pertanyaan: "Kegiatan statistik yang diselenggarakan oleh perguruan tinggi, swasta, atau LSM untuk kepentingan riset mandiri digolongkan sebagai...",
    opsi: {
      A: "Statistik Dasar",
      B: "Statistik Sektoral",
      C: "Statistik Khusus",
      D: "Statistik Mandiri"
    },
    kunci: "C",
    penjelasan: "Statistik Khusus! Sesuai UU 16/1997, statistik khusus diselenggarakan oleh masyarakat atau lembaga non-pemerintah."
  },
  {
    pertanyaan: "Dalam kebijakan Perpres No. 39 Tahun 2019 tentang Satu Data Indonesia (SDI), BPS Pusat mengemban peran strategis sebagai...",
    opsi: {
      A: "Pembina Data Statistik",
      B: "Walidata Statistik",
      C: "Produsen Data Spasial",
      D: "Pengelola Anggaran SDI"
    },
    kunci: "A",
    penjelasan: "Pembina Data Statistik! BPS membina kementerian/lembaga agar data yang diproduksi memenuhi standar data, metadata, dan interoperabilitas."
  },
  {
    pertanyaan: "Apakah identitas nama dan data pribadi responden yang diwawancarai BPS boleh dipublikasikan atau dibocorkan ke pihak lain?",
    opsi: {
      A: "Boleh untuk keperluan komersial",
      B: "Boleh jika diminta aparat penegak hukum",
      C: "Dilarang keras, dijamin kerahasiaannya oleh undang-undang",
      D: "Boleh asal mendapat komisi"
    },
    kunci: "C",
    penjelasan: "Dilarang keras! Pasal 21 UU No. 16 Tahun 1997 menegaskan BPS wajib menjamin kerahasiaan data individu responden."
  },
  {
    pertanyaan: "Wilayah kerja pemetaan terkecil yang dibentuk BPS sebagai unit operasional pelaksanaan sensus dan survei disebut...",
    opsi: {
      A: "Rukun Tetangga (RT)",
      B: "Dusun Terpadu",
      C: "Blok Sensus (BS)",
      D: "Zona Satelit"
    },
    kunci: "C",
    penjelasan: "Blok Sensus (BS)! Blok sensus adalah wilayah kerja statistik yang memiliki batas-batas jelas, permanen, atau dapat dikenali."
  },
  {
    pertanyaan: "Dalam satu wilayah Blok Sensus (BS) BPS biasa (B), muatan idealnya dirancang mencakup berapa rumah tangga/keluarga?",
    opsi: {
      A: "10 - 20 rumah tangga",
      B: "80 - 120 rumah tangga",
      C: "300 - 500 rumah tangga",
      D: "1.000 rumah tangga"
    },
    kunci: "B",
    penjelasan: "Sekitar 80 hingga 120 rumah tangga! Ukuran ini dirancang agar beban kerja pencacahan lapangan oleh petugas sensus seimbang dan akurat."
  },
  {
    pertanyaan: "Program inovatif BPS untuk membina aparat desa dalam mengelola dan memanfaatkan data statistik pembangunan desa dinamakan...",
    opsi: {
      A: "Desa Digital Sejahtera",
      B: "Desa Cinta Statistik (Desa Cantik)",
      C: "Desa Mandiri Data",
      D: "Kampung Statistik Modern"
    },
    kunci: "B",
    penjelasan: "Desa Cinta Statistik (Desa Cantik)! Program ini melatih aparat desa memahami data potensi desa dan data sasaran kemiskinan."
  },
  {
    pertanyaan: "Aplikasi daring milik BPS tempat kementerian/lembaga mengajukan permohonan Rekomendasi Kegiatan Statistik dinamakan...",
    opsi: {
      A: "ROMANTIK",
      B: "SIMBA",
      C: "SAKTI",
      D: "SIPD"
    },
    kunci: "A",
    penjelasan: "ROMANTIK (Rekomendasi Kegiatan Statistik)! Aplikasi ini mencegah duplikasi kegiatan survei antar-instansi pemerintah di Indonesia."
  },
  {
    pertanyaan: "Nilai capaian kualitas penyelenggaraan statistik di kementerian/lembaga/pemda yang diukur BPS melalui EPSS dinamakan...",
    opsi: {
      A: "Indeks Efisiensi Birokrasi (IEB)",
      B: "Indeks Pembangunan Statistik (IPS)",
      C: "Indeks Maturitas Digital (IMD)",
      D: "Indeks Literasi Daerah (ILD)"
    },
    kunci: "B",
    penjelasan: "Indeks Pembangunan Statistik (IPS)! Nilai IPS menjadi salah satu indikator kunci reformasi birokrasi pemerintah daerah dan kementerian."
  },
  {
    pertanyaan: "Pusat layanan konsultasi data, perpustakaan cetak, dan pembelian publikasi statistik di kantor BPS dikenal dengan nama...",
    opsi: {
      A: "Pusat Data Nasional (PDN)",
      B: "Pelayanan Statistik Terpadu (PST)",
      C: "Pojok Literasi Daerah",
      D: "Gerai Data Terbuka"
    },
    kunci: "B",
    penjelasan: "Pelayanan Statistik Terpadu (PST)! Masyarakat dapat berkonsultasi langsung dengan petugas statistisi BPS di ruang PST secara gratis."
  },
  {
    pertanyaan: "Sejak awal tahun 2024, BPS menghitung Indeks Harga Konsumen (IHK) dan angka inflasi menggunakan tahun dasar terbaru yaitu...",
    opsi: {
      A: "Tahun 2012 (2012 = 100)",
      B: "Tahun 2018 (2018 = 100)",
      C: "Tahun 2022 (2022 = 100)",
      D: "Tahun 2020 (2020 = 100)"
    },
    kunci: "C",
    penjelasan: "Tahun dasar 2022 = 100! Pembaruan tahun dasar berdasarkan Survei Biaya Hidup (SBH) 2022 agar mencerminkan pola konsumsi pasca-pandemi."
  },
  {
    pertanyaan: "Berapa banyak kabupaten/kota yang dipantau harga komoditasnya oleh BPS dalam penghitungan inflasi IHK tahun dasar 2022?",
    opsi: {
      A: "34 kabupaten/kota",
      B: "90 kabupaten/kota",
      C: "150 kabupaten/kota",
      D: "514 kabupaten/kota"
    },
    kunci: "C",
    penjelasan: "150 kabupaten/kota! Jumlah cakupan wilayah penghasil inflasi diperluas dari 90 kota menjadi 150 kabupaten/kota pada SBH 2022."
  },
  {
    pertanyaan: "Dalam penghitungan Garis Kemiskinan Makanan (GKM) oleh BPS, komoditas pangan yang memberikan kontribusi bobot rupiah terbesar adalah...",
    opsi: {
      A: "Minyak goreng",
      B: "Daging sapi",
      C: "Beras",
      D: "Gula pasir"
    },
    kunci: "C",
    penjelasan: "Beras! Beras menyumbang lebih dari 19-23% terhadap garis kemiskinan di perkotaan maupun perdesaan."
  },
  {
    pertanyaan: "Selain makanan dan sewa perumahan, komoditas non-makanan manakah yang menyumbang persentase garis kemiskinan sangat besar di Indonesia?",
    opsi: {
      A: "Rokok kretek filter",
      B: "Bensin pertalite",
      C: "Pulsa kuota HP",
      D: "Deterjen pencuci"
    },
    kunci: "A",
    penjelasan: "Rokok kretek filter! Pengeluaran untuk rokok kretek filter secara konsisten menempati posisi kedua terbesar dalam garis kemiskinan."
  },
  {
    pertanyaan: "Dalam total Garis Kemiskinan (GK) BPS, komponen makanan (GKM) mendominasi dengan kontribusi sekitar berapa persen?",
    opsi: {
      A: "Sekitar 30 - 35 persen",
      B: "Sekitar 50 persen",
      C: "Sekitar 73 - 75 persen",
      D: "Sekitar 95 persen"
    },
    kunci: "C",
    penjelasan: "Sekitar 74 persen! Ini menunjukkan pemenuhan kebutuhan kalori makanan masih menjadi komponen biaya paling vital bagi masyarakat miskin."
  },
  {
    pertanyaan: "Indeks statistik yang mengukur rata-rata kesenjangan pengeluaran masing-masing penduduk miskin terhadap garis kemiskinan dinamakan...",
    opsi: {
      A: "Indeks Kedalaman Kemiskinan (P1)",
      B: "Indeks Keparahan Kemiskinan (P2)",
      C: "Headcount Index (P0)",
      D: "Gini Ratio Kemiskinan"
    },
    kunci: "A",
    penjelasan: "Indeks Kedalaman Kemiskinan (P1)! Semakin besar nilai P1, semakin jauh rata-rata pengeluaran penduduk miskin dari garis kemiskinan."
  },
  {
    pertanyaan: "Indeks statistik yang memberikan gambaran mengenai ketimpangan pengeluaran di antara penduduk miskin itu sendiri dinamakan...",
    opsi: {
      A: "Indeks Kedalaman Kemiskinan (P1)",
      B: "Indeks Keparahan Kemiskinan (P2)",
      C: "Indeks Williamson",
      D: "Koefisien Variasi"
    },
    kunci: "B",
    penjelasan: "Indeks Keparahan Kemiskinan (P2)! Semakin tinggi P2, ketimpangan pengeluaran di antara sesama warga miskin semakin melebar."
  },
  {
    pertanyaan: "Dalam struktur PDB Indonesia menurut pendekatan pengeluaran, komponen pendorong ekonomi dengan porsi terbesar (>53%) adalah...",
    opsi: {
      A: "Belanja Pemerintah (G)",
      B: "Ekspor Neto (X - M)",
      C: "Konsumsi Rumah Tangga (C)",
      D: "Pembentukan Modal Tetap Bruto (Investasi)"
    },
    kunci: "C",
    penjelasan: "Konsumsi Rumah Tangga! Belanja konsumsi harian ratusan juta rakyat Indonesia menjadi roda penggerak utama perekonomian nasional."
  },
  {
    pertanyaan: "Berdasarkan Produk Domestik Bruto (PDB) menurut lapangan usaha, sektor yang menyumbang kontribusi nilai tambah terbesar di Indonesia adalah...",
    opsi: {
      A: "Sektor Industri Pengolahan (Manufaktur)",
      B: "Sektor Pertambangan dan Penggalian",
      C: "Sektor Konstruksi",
      D: "Sektor Jasa Keuangan"
    },
    kunci: "A",
    penjelasan: "Industri Pengolahan (Manufaktur)! Sektor industri menyumbang sekitar 18-19% dari total PDB Indonesia."
  },
  {
    pertanyaan: "Menurut data Sakernas BPS, sektor lapangan usaha yang paling banyak menyerap tenaga kerja di Indonesia adalah...",
    opsi: {
      A: "Sektor Informasi dan Komunikasi",
      B: "Sektor Pertanian, Kehutanan, dan Perikanan",
      C: "Sektor Jasa Keuangan dan Asuransi",
      D: "Sektor Real Estate"
    },
    kunci: "B",
    penjelasan: "Pertanian, Kehutanan, dan Perikanan! Sektor ini mempekerjakan sekitar 28-29% dari total seluruh pekerja di Indonesia."
  },
  {
    pertanyaan: "Tingkat Pengangguran Terbuka (TPT) nasional di Indonesia pada tahun 2023-2024 rata-rata berada pada rentang angka...",
    opsi: {
      A: "1,2 persen - 2,0 persen",
      B: "4,8 persen - 5,3 persen",
      C: "10,5 persen - 12,0 persen",
      D: "18,0 persen - 20,5 persen"
    },
    kunci: "B",
    penjelasan: "Sekitar 4,8% - 5,3%! Angka pengangguran terbuka terus mengalami pemulihan bertahap menuju level sebelum pandemi."
  },
  {
    pertanyaan: "Rasio Ketergantungan (Dependency Ratio) dalam demografi mengukur perbandingan antara...",
    opsi: {
      A: "Jumlah pria dengan jumlah wanita",
      B: "Jumlah penduduk usia non-produktif terhadap usia produktif",
      C: "Jumlah pengangguran terhadap angkatan kerja",
      D: "Jumlah pendatang baru terhadap warga asli"
    },
    kunci: "B",
    penjelasan: "Usia non-produktif (<15 & 65+) terhadap usia produktif (15-64)! Semakin rendah rasio ini, peluang bonus demografi semakin terbuka."
  },
  {
    pertanyaan: "Indonesia mulai dikategorikan memasuki era 'Aging Population' (struktur penduduk tua) apabila persentase lansia (usia 60+) telah mencapai...",
    opsi: {
      A: "Lebih dari 3 persen",
      B: "Lebih dari 5 persen",
      C: "Lebih dari 10 persen",
      D: "Lebih dari 30 persen"
    },
    kunci: "C",
    penjelasan: "Lebih dari 10 persen! Sensus Penduduk 2020 mencatat proporsi lansia Indonesia mencapai 9,78% dan terus merangkak melampaui 10%."
  },
  {
    pertanyaan: "Dua gugus kepulauan di Indonesia yang bila digabungkan hanya dihuni sekitar 3,17 persen dari total penduduk Indonesia adalah...",
    opsi: {
      A: "Kalimantan dan Sulawesi",
      B: "Bali dan Nusa Tenggara",
      C: "Maluku dan Papua",
      D: "Sumatera dan Jawa"
    },
    kunci: "C",
    penjelasan: "Maluku dan Papua! Meski wilayah daratan dan lautannya sangat luas, persebaran penduduk di kawasan ini hanya sekitar 3% nasional."
  },
  {
    pertanyaan: "Dalam konsep Koefisien Gini (Gini Ratio), jika nilai koefisiennya mendekati angka 0 (nol), maka artinya...",
    opsi: {
      A: "Terjadi ketimpangan pengeluaran yang sempurna (sangat timpang)",
      B: "Terjadi pemerataan pengeluaran yang sempurna (sangat merata)",
      C: "Jumlah orang miskin mencapai 100 persen",
      D: "Tidak ada aktivitas ekonomi sama sekali"
    },
    kunci: "B",
    penjelasan: "Pemerataan sempurna! Skala Gini Ratio adalah 0 (paling merata sempurna) hingga 1 (satu orang menguasai semua pengeluaran)."
  },
  {
    pertanyaan: "Berdasarkan standar BPS, wilayah yang memiliki capaian Indeks Pembangunan Manusia (IPM) sebesar 80 atau lebih masuk dalam kategori...",
    opsi: {
      A: "Sedang",
      B: "Tinggi",
      C: "Sangat Tinggi",
      D: "Sempurna"
    },
    kunci: "C",
    penjelasan: "Sangat Tinggi! Daerah dengan IPM >= 80 (seperti DKI Jakarta, DI Yogyakarta) tergolong memiliki pembangunan manusia level sangat tinggi."
  },
  {
    pertanyaan: "Wilayah dengan capaian angka IPM di antara 70,00 sampai 79,99 dimasukkan oleh BPS ke dalam status kategori...",
    opsi: {
      A: "Rendah",
      B: "Sedang",
      C: "Tinggi",
      D: "Sangat Tinggi"
    },
    kunci: "C",
    penjelasan: "Tinggi! Sebagian besar provinsi di Pulau Jawa dan Sumatera saat ini berada pada kelompok kategori IPM Tinggi (70 - 79,99)."
  },
  {
    pertanyaan: "Dua indikator komposit yang digunakan BPS untuk mengukur dimensi pengetahuan (pendidikan) pada penghitungan IPM adalah...",
    opsi: {
      A: "Tingkat kelulusan SD dan persentase sarjana",
      B: "Rata-rata Lama Sekolah (RLS) dan Harapan Lama Sekolah (HLS)",
      C: "Angka Buta Huruf dan jumlah gedung sekolah",
      D: "Rasio guru-murid dan anggaran dana BOS"
    },
    kunci: "B",
    penjelasan: "RLS dan HLS! Kombinasi keduanya mencerminkan capaian stok pendidikan masa kini dan prospek pendidikan generasi mendatang."
  },
  {
    pertanyaan: "Berapa batas usia penduduk yang dihitung dalam indikator Rata-rata Lama Sekolah (RLS) oleh BPS?",
    opsi: {
      A: "Usia 7 tahun ke atas",
      B: "Usia 15 tahun ke atas",
      C: "Usia 25 tahun ke atas",
      D: "Usia 60 tahun ke atas"
    },
    kunci: "C",
    penjelasan: "Penduduk usia 25 tahun ke atas! Pada usia ini diasumsikan seseorang telah menyelesaikan jalur pendidikan formal dasarnya."
  },
  {
    pertanyaan: "Indikator Harapan Lama Sekolah (HLS) menghitung lamanya sekolah yang diharapkan akan dicapai oleh anak yang berusia...",
    opsi: {
      A: "Usia 0 tahun (bayi baru lahir)",
      B: "Usia 5 tahun (usia PAUD)",
      C: "Usia 7 tahun (usia masuk SD)",
      D: "Usia 17 tahun (usia lulus SMA)"
    },
    kunci: "C",
    penjelasan: "Usia 7 tahun! Usia 7 tahun adalah titik mula standar anak memasuki jenjang wajib belajar sekolah dasar di Indonesia."
  },
  {
    pertanyaan: "Standar kecukupan kalori minimum per kapita per hari yang ditetapkan BPS untuk menghitung Garis Kemiskinan Makanan adalah...",
    opsi: {
      A: "1.500 kkal",
      B: "1.800 kkal",
      C: "2.100 kkal",
      D: "2.500 kkal"
    },
    kunci: "C",
    penjelasan: "2.100 kilokalori (kkal)! Standar ini mengacu pada rekomendasi Widyakarya Nasional Pangan dan Gizi (WNPG)."
  },
  {
    pertanyaan: "Apa kepanjangan dari PDRB yang dihitung BPS untuk mengukur nilai tambah ekonomi di tingkat provinsi/kabupaten/kota?",
    opsi: {
      A: "Pendapatan Daerah Rata-rata Bersih",
      B: "Produk Domestik Regional Bruto",
      C: "Pajak Daerah dan Retribusi Bersama",
      D: "Perhitungan Distribusi Riil Bisnis"
    },
    kunci: "B",
    penjelasan: "Produk Domestik Regional Bruto! PDRB mengukur total nilai tambah barang dan jasa yang dihasilkan di suatu wilayah dalam periode tertentu."
  },
  {
    pertanyaan: "BPS merilis angka Produk Domestik Bruto (PDB) nasional dan laju pertumbuhan ekonomi secara berkala setiap...",
    opsi: {
      A: "Satu bulan sekali",
      B: "Tiga bulan sekali (Triwulanan)",
      C: "Enam bulan sekali",
      D: "Dua tahun sekali"
    },
    kunci: "B",
    penjelasan: "Tiga bulan sekali (Kuartalan/Triwulanan)! Rilis ini memantau tren ekspansi atau kontraksi ekonomi Indonesia sepanjang tahun."
  },
  {
    pertanyaan: "Dalam konsep pendataan sensus penduduk, pencatatan warga berdasarkan tempat mereka tinggal sehari-hari saat sensus dinamakan...",
    opsi: {
      A: "Sensus De Jure",
      B: "Sensus De Facto",
      C: "Sensus Registrasi",
      D: "Sensus Kanvasing"
    },
    kunci: "B",
    penjelasan: "Sensus De Facto! Pendekatan ini mencatat keberadaan riil penduduk di lapangan pada saat waktu sensus berlangsung."
  },
  {
    pertanyaan: "Sebaliknya, pencatatan warga hanya di alamat domisili resmi sesuai dokumen kependudukan (KTP/KK) disebut...",
    opsi: {
      A: "Sensus De Facto",
      B: "Sensus De Jure",
      C: "Sensus Sampling",
      D: "Sensus Monografi"
    },
    kunci: "B",
    penjelasan: "Sensus De Jure! Menghitung penduduk berdasarkan domisili yuridis formal yang tercantum di kartu identitas resmi."
  },
  {
    pertanyaan: "Dalam teknik wawancara lapangan modern BPS, metode wawancara tatap muka menggunakan gawai/tablet disebut...",
    opsi: {
      A: "PAPI (Paper-and-Pencil Interviewing)",
      B: "CAPI (Computer-Assisted Personal Interviewing)",
      C: "CAWI (Computer-Assisted Web Interviewing)",
      D: "CATI (Computer-Assisted Telephone Interviewing)"
    },
    kunci: "B",
    penjelasan: "CAPI (Computer-Assisted Personal Interviewing)! Menggantikan kuesioner kertas sehingga validasi data langsung terjadi saat wawancara."
  },
  {
    pertanyaan: "Metode survei mandiri di mana responden mengisi kuesioner secara daring melalui browser internet dinamakan...",
    opsi: {
      A: "CAWI (Computer-Assisted Web Interviewing)",
      B: "CAPI (Computer-Assisted Personal Interviewing)",
      C: "CATI (Computer-Assisted Telephone Interviewing)",
      D: "PAPI (Paper and Pencil)"
    },
    kunci: "A",
    penjelasan: "CAWI (Computer-Assisted Web Interviewing)! Diterapkan sukses pada Sensus Penduduk Online 2020 di mana masyarakat mengisi mandiri."
  },
  {
    pertanyaan: "Dokumen rilis berkala resmi yang diterbitkan BPS saat mengumumkan data inflasi dan pertumbuhan ekonomi dinamakan...",
    opsi: {
      A: "Nota Keuangan Negara",
      B: "Berita Resmi Statistik (BRS)",
      C: "Lembaran Berita Negara",
      D: "Jurnal Analisis Makro"
    },
    kunci: "B",
    penjelasan: "Berita Resmi Statistik (BRS)! BRS disiarkan langsung melalui live streaming YouTube BPS dan dapat diunduh di website BPS."
  },
  {
    pertanyaan: "Kapan jadwal rutin penayangan Berita Resmi Statistik (BRS) untuk rilis inflasi dan neraca perdagangan bulanan oleh BPS?",
    opsi: {
      A: "Hari kerja pertama setiap awal bulan",
      B: "Tanggal 15 setiap pertengahan bulan",
      C: "Hari Jumat terakhir setiap bulan",
      D: "Tergantung keputusan rapat DPR"
    },
    kunci: "A",
    penjelasan: "Hari kerja pertama setiap bulan! Pukul 11.00 WIB, BPS merilis angka inflasi dan statistik ekspor-impor bulan sebelumnya."
  },
  {
    pertanyaan: "Indikator statistik yang mengukur daya beli petani dengan membandingkan indeks harga yang diterima dengan harga yang dibayar petani adalah...",
    opsi: {
      A: "Nilai Tukar Petani (NTP)",
      B: "Indeks Paritas Beli",
      C: "Upah Riil Buruh Tani",
      D: "Produktivitas Panen Riil"
    },
    kunci: "A",
    penjelasan: "Nilai Tukar Petani (NTP)! Jika NTP > 100, berarti kenaikan harga jual produk tani lebih besar dari kenaikan harga kebutuhan petani."
  },
  {
    pertanyaan: "Komponen inflasi yang dipengaruhi oleh cuaca, kegagalan panen, dan pasokan bahan makanan segar disebut sebagai...",
    opsi: {
      A: "Inflasi Inti (Core Inflation)",
      B: "Inflasi Harga Bergejolak (Volatile Food)",
      C: "Inflasi Harga Diatur Pemerintah (Administered Prices)",
      D: "Inflasi Impor (Imported Inflation)"
    },
    kunci: "B",
    penjelasan: "Inflasi Volatile Food! Komponen ini mencakup komoditas cabai, bawang, dan telur yang harganya rentan berfluktuasi musiman."
  },
  {
    pertanyaan: "Komponen inflasi yang pergerakannya dipengaruhi oleh penetapan tarif atau regulasi tarif oleh pemerintah dinamakan...",
    opsi: {
      A: "Inflasi Inti",
      B: "Inflasi Volatile Food",
      C: "Inflasi Harga Diatur Pemerintah (Administered Prices)",
      D: "Inflasi Moneter"
    },
    kunci: "C",
    penjelasan: "Administered Prices! Contohnya adalah penyesuaian tarif listrik, tiket kereta api, cukai rokok, dan harga BBM bersubsidi."
  },
  {
    pertanyaan: "Berdasarkan data BPS dan Kemendagri terkini, jumlah total kabupaten dan kota di seluruh Indonesia adalah...",
    opsi: {
      A: "340 kabupaten/kota",
      B: "416 kabupaten/kota",
      C: "514 kabupaten/kota",
      D: "620 kabupaten/kota"
    },
    kunci: "C",
    penjelasan: "514 kabupaten/kota! Terdiri atas 416 kabupaten dan 98 kota yang tersebar di 38 provinsi di Indonesia."
  },
  {
    pertanyaan: "Sebelum dinamakan Badan Pusat Statistik pada tahun 1997, lembaga ini dahulunya bernama...",
    opsi: {
      A: "Biro Pusat Statistik",
      B: "Dinas Sensus Nasional",
      C: "Badan Registrasi Penduduk",
      D: "Inspektorat Statistik Umum"
    },
    kunci: "A",
    penjelasan: "Biro Pusat Statistik! Berubah menjadi Badan Pusat Statistik melalui UU No. 16 Tahun 1997 untuk memperkuat peran dan fungsinya."
  },
  {
    pertanyaan: "Mengapa Hari Statistik Nasional (HSN) diperingati setiap tanggal 26 September?",
    opsi: {
      A: "Hari ulang tahun Kepala BPS pertama",
      B: "Hari lahirnya UU No. 7 Tahun 1960 tentang Statistik",
      C: "Selesainya Sensus Penduduk pertama di Indonesia",
      D: "Hari peresmian gedung kantor BPS di Pasar Baru"
    },
    kunci: "B",
    penjelasan: "Pengesahan UU No. 7 Tahun 1960! UU ini merupakan tonggak awal kemerdekaan kegiatan statistik dari pengaruh kolonial Hindia Belanda."
  },
  {
    pertanyaan: "Publikasi tahunan paling populer dan lengkap yang diterbitkan oleh BPS di setiap kabupaten/kota dan provinsi bertajuk...",
    opsi: {
      A: "Profil Kemiskinan Terkini",
      B: "[Nama Wilayah] Dalam Angka",
      C: "Buku Panduan Statistik Dasar",
      D: "Katalog Indikator Ekonomi"
    },
    kunci: "B",
    penjelasan: "[Daerah] Dalam Angka (contoh: Indonesia Dalam Angka / Demak Dalam Angka)! Menjadi rujukan utama perencanaan RPJMD dan riset."
  },
  {
    pertanyaan: "Apakah data mikro mentah (raw data perorangan) yang diberikan BPS kepada peneliti mencantumkan NIK, nama lengkap, dan nomor kontak?",
    opsi: {
      A: "Ya, lengkap tanpa sensor",
      B: "Tidak, telah dianonimkan (anonymized) demi privasi responden",
      C: "Hanya jika peneliti membayar biaya mahal",
      D: "Tergantung izin kepala desa"
    },
    kunci: "B",
    penjelasan: "Telah dianonimkan (anonymized)! Kerahasiaan identitas perorangan dijamin undang-undang sehingga data yang dirilis bebas dari identitas pribadi."
  },
  {
    pertanyaan: "Survei berkala BPS yang khusus meneliti pergerakan ekonomi sektor pariwisata dan tingkat penghunian kamar hotel dinamakan...",
    opsi: {
      A: "Survei Wisatawan Mancanegara (VFR)",
      B: "Survei Tingkat Penghunian Kamar (TPK) Hotel",
      C: "Sensus Tempat Hiburan",
      D: "Indeks Kunjungan Kuliner"
    },
    kunci: "B",
    penjelasan: "Survei TPK Hotel! Mengukur persentase malam kamar yang dihuni tamu terhadap ketersediaan kamar hotel setiap bulan."
  },
  {
    pertanyaan: "Sensus Ekonomi (SE) yang merekam seluruh geliat bisnis non-pertanian di Indonesia diadakan rutin pada tahun berakhiran angka...",
    opsi: {
      A: "Angka 0",
      B: "Angka 3",
      C: "Angka 6",
      D: "Angka 9"
    },
    kunci: "C",
    penjelasan: "Tahun berakhiran 6 (1986, 1996, 2006, 2016, 2026)! Menjadi peta penting bagi pertumbuhan UMKM dan industri digital nasional."
  },
  {
    pertanyaan: "Metode pemotretan batas wilayah desa dan blok sensus yang digunakan BPS berbasis peta digital dan satelit dinamakan kegiatan...",
    opsi: {
      A: "Wilkerstat (Wilayah Kerja Statistik)",
      B: "Geolokasi Satelit Mandiri",
      C: "Peta Drone Pertanahan",
      D: "Zonasi Radar Penduduk"
    },
    kunci: "A",
    penjelasan: "Wilkerstat (Wilayah Kerja Statistik)! Pemetaan wilayah spasial berbasis GIS untuk memastikan tidak ada rumah yang terlewat dicatat."
  },
  {
    pertanyaan: "Tiga warna utama yang menghiasi logo resmi Badan Pusat Statistik (BPS) adalah...",
    opsi: {
      A: "Merah, Putih, dan Hitam",
      B: "Biru, Hijau, dan Oranye",
      C: "Kuning, Abu-abu, dan Cokelat",
      D: "Emas, Perak, dan Perunggu"
    },
    kunci: "B",
    penjelasan: "Biru, Hijau, dan Oranye! Masing-masing melambangkan kegiatan sensus: Biru (Penduduk), Hijau (Pertanian), dan Oranye (Ekonomi)."
  },
  {
    pertanyaan: "Kode wilayah BPS untuk mengidentifikasi tingkat provinsi, kabupaten/kota, dan kecamatan secara standar tertuang dalam sistem...",
    opsi: {
      A: "Master File Desa (MFD)",
      B: "Nomor Registrasi KTP",
      C: "Sistem Kode Pajak Wilayah",
      D: "Zonasi Pos Indonesia"
    },
    kunci: "A",
    penjelasan: "Master File Desa (MFD)! Sistem pengkodean wilayah ini menjadi acuan baku interoperabilitas data spasial di Indonesia."
  },
  {
    pertanyaan: "Ketika BPS mengukur inflasi bulanan sebesar 0,25%, artinya secara umum terjadi...",
    opsi: {
      A: "Penurunan harga barang-barang kebutuhan pokok",
      B: "Kenaikan tingkat harga barang dan jasa sebesar 0,25 persen",
      C: "Pengurangan jumlah uang yang beredar",
      D: "Kenaikan nilai kurs dolar terhadap rupiah"
    },
    kunci: "B",
    penjelasan: "Kenaikan tingkat harga barang dan jasa rata-rata sebesar 0,25%! Sebaliknya, jika bernilai negatif disebut deflasi."
  },
  {
    pertanyaan: "Kondisi penurunan harga-harga barang dan jasa secara umum dan terus menerus diukur oleh BPS sebagai angka inflasi negatif yang disebut...",
    opsi: {
      A: "Resesi",
      B: "Stagflasi",
      C: "Deflasi",
      D: "Depresiasi"
    },
    kunci: "C",
    penjelasan: "Deflasi! Terjadi ketika indeks harga konsumen periode berjalan lebih rendah dibanding indeks periode sebelumnya."
  },
  {
    pertanyaan: "Survei BPS yang mengukur tingkat kepuasan masyarakat terhadap mutu layanan instansi pemerintah di kantor BPS dinamakan...",
    opsi: {
      A: "Survei Kebutuhan Data (SKD)",
      B: "Survei Ulasan Pelanggan Mandiri",
      C: "Sensus Kepuasan Pengguna",
      D: "Indeks Layanan Digital"
    },
    kunci: "A",
    penjelasan: "Survei Kebutuhan Data (SKD)! Dilakukan berkala untuk menjaring evaluasi konsumen terhadap kemudahan akses data BPS."
  },
  {
    pertanyaan: "Berdasarkan rujukan geografis resmi, Indonesia dilintasi oleh garis khayal ekuator atau yang sering disebut sebagai...",
    opsi: {
      A: "Garis Bujur Greenwich",
      B: "Garis Balik Utara",
      C: "Garis Khatulistiwa",
      D: "Garis Wallace"
    },
    kunci: "C",
    penjelasan: "Garis Khatulistiwa! Kota Pontianak dan Bonjol merupakan contoh wilayah yang persis dilalui garis khatulistiwa."
  },
  {
    pertanyaan: "Dalam rilis ketenagakerjaan BPS, penduduk yang digolongkan sebagai 'Bukan Angkatan Kerja' antara lain mencakup...",
    opsi: {
      A: "Pencari kerja dan buruh lepas",
      B: "Sekolah/kuliah, mengurus rumah tangga, dan penerima pensiun",
      C: "Wirausaha dan pedagang keliling",
      D: "Karyawan swasta yang bekerja paruh waktu"
    },
    kunci: "B",
    penjelasan: "Penduduk yang bersekolah, mengurus rumah tangga, dan lainnya! Mereka tidak bekerja dan tidak sedang aktif mencari pekerjaan."
  },
  {
    pertanyaan: "Satuan data Produk Domestik Bruto (PDB) atas dasar harga konstan digunakan oleh BPS untuk mengukur...",
    opsi: {
      A: "Pertumbuhan ekonomi riil (bebas pengaruh inflasi harga)",
      B: "Total nominal uang beredar saat transaksi berlangsung",
      C: "Perkiraan penerimaan pajak daerah",
      D: "Nilai tukar mata uang asing"
    },
    kunci: "A",
    penjelasan: "Pertumbuhan ekonomi riil! Menggunakan harga tahun dasar konstan sehingga kenaikan angka benar-benar mencerminkan kenaikan volume output fisik."
  },
  {
    pertanyaan: "Sedangkan PDB atas dasar harga berlaku (ADHB) mencerminkan nilai barang dan jasa yang dihitung berdasarkan...",
    opsi: {
      A: "Tingkat harga pada tahun dasar lama",
      B: "Tingkat harga yang berlaku pada tahun berjalan",
      C: "Harga patokan perkiraan Bank Dunia",
      D: "Harga rata-rata sepuluh tahun terakhir"
    },
    kunci: "B",
    penjelasan: "Tingkat harga tahun berjalan! Berguna untuk melihat struktur perekonomian nominal dan perbandingan skala makro ekonomi."
  },
  {
    pertanyaan: "Indikator sosial BPS yang mengukur persentase penduduk usia 15 tahun ke atas yang dapat membaca dan menulis huruf latin/lainnya dinamakan...",
    opsi: {
      A: "Angka Melek Huruf (AMH)",
      B: "Rasio Literasi Digital",
      C: "Indeks Edukasi Dasar",
      D: "Tingkat Partisipasi Sekolah"
    },
    kunci: "A",
    penjelasan: "Angka Melek Huruf (AMH)! Menjadi salah satu indikator dasar kemampuan literasi dan kemajuan pendidikan dasar masyarakat."
  },
  {
    pertanyaan: "Metode penarikan sampel di mana setiap elemen dalam populasi memiliki peluang yang sama dan diketahui untuk terpilih disebut...",
    opsi: {
      A: "Convenience Sampling",
      B: "Probability Sampling",
      C: "Quota Sampling",
      D: "Snowball Sampling"
    },
    kunci: "B",
    penjelasan: "Probability Sampling! Menjadi standar utama BPS agar hasil survei sampel dapat diestimasi dan digeneralisasi ke tingkat populasi."
  },
  {
    pertanyaan: "Dalam teknik sampling BPS, pembagian populasi menjadi beberapa kelompok homogen (seperti perkotaan vs perdesaan) sebelum ditarik sampel disebut...",
    opsi: {
      A: "Stratifikasi (Stratified Sampling)",
      B: "Klasterisasi Bebas",
      C: "Purposive Sampling",
      D: "Systematic Bias"
    },
    kunci: "A",
    penjelasan: "Stratified Sampling (Sampling Terstratifikasi)! Mengurangi varians estimasi sehingga hasil survei lebih presisi dan efisien."
  },
  {
    pertanyaan: "Slogan pelayanan BPS yang mencerminkan komitmen terhadap data statistik yang berkualitas dan tepercaya adalah...",
    opsi: {
      A: "Cepat, Murah, dan Terjangkau",
      B: "Melayani dengan Hati, Menyajikan Data Berkualitas untuk Indonesia Maju",
      C: "Satu Orang Satu Angka Pasti",
      D: "Data Unggul Bisnis Makmur"
    },
    kunci: "B",
    penjelasan: "Melayani dengan Hati, Menyajikan Data Berkualitas untuk Indonesia Maju! Menjadi nafas pengabdian seluruh insan BPS di pelosok negeri."
  }
];

console.log("Total Data questions prepared:", dataQuestions.length);
fs.writeFileSync(path.join(__dirname, 'questions_data_70.json'), JSON.stringify(dataQuestions, null, 2));
