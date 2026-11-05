const fs = require('fs');
const path = require('path');

// 1. Read Claude v1
const rawV1 = fs.readFileSync('c:\\Users\\bpsde\\Downloads\\soal_kuis_stis.json', 'utf8');
const questionsV1 = JSON.parse(rawV1);

// 2. Read Claude v2
const rawV2 = fs.readFileSync('c:\\Users\\bpsde\\Downloads\\soal_kuis_stis_v2.json', 'utf8');
const questionsV2 = JSON.parse(rawV2);

// 3. ChatGPT questions from prompt response
const questionsGPT = [
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Coba pecahkan pola angka ini! 2, 6, 12, 20, 30, ... Angka berikutnya berapa?",
    "opsi": { "A": "42", "B": "40", "C": "44", "D": "38" },
    "kunci": "A",
    "penjelasan": "Jawabannya 42! Selisih angkanya berturut-turut +4, +6, +8, +10, lalu +12. Jadi 30 + 12 = 42. Polanya makin naik!"
  },
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Ada 5 printer identik yang bekerja bersamaan. Mereka bisa mencetak 5 poster dalam 5 menit. Kalau ada 100 printer, berapa menit untuk mencetak 100 poster?",
    "opsi": { "A": "100 menit", "B": "20 menit", "C": "5 menit", "D": "50 menit" },
    "kunci": "C",
    "penjelasan": "Jawabannya 5 menit! Satu printer menghasilkan satu poster dalam 5 menit. Jadi 100 printer bisa menghasilkan 100 poster secara bersamaan dalam waktu yang sama. Kerja cerdas, bukan kerja lebih lama!"
  },
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Harga satu bat dan satu bola totalnya Rp110.000. Harga bat Rp100.000 lebih mahal daripada bola. Berapa harga bolanya?",
    "opsi": { "A": "Rp10.000", "B": "Rp5.000", "C": "Rp15.000", "D": "Rp1.000" },
    "kunci": "B",
    "penjelasan": "Jawabannya Rp5.000! Kalau bola Rp5.000, bat-nya Rp105.000. Totalnya tepat Rp110.000. Hati-hati, jawaban Rp10.000 sering menjebak karena kita terlalu cepat menghitung!"
  },
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Kamu sedang ikut lomba lari. Tiba-tiba kamu berhasil menyalip pelari yang ada di posisi kedua. Sekarang kamu ada di posisi berapa?",
    "opsi": { "A": "Pertama", "B": "Ketiga", "C": "Terakhir", "D": "Kedua" },
    "kunci": "D",
    "penjelasan": "Jawabannya posisi kedua! Saat menyalip orang yang berada di posisi kedua, kamu mengambil posisinya, bukan langsung menjadi juara pertama. Jangan sampai terkecoh!"
  },
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Seorang peternak punya 17 ekor kambing. Semua kambingnya kabur kecuali 9 ekor. Berapa kambing yang masih tersisa?",
    "opsi": { "A": "9 ekor", "B": "8 ekor", "C": "17 ekor", "D": "0 ekor" },
    "kunci": "A",
    "penjelasan": "Jawabannya 9 ekor! Perhatikan kata kecuali. Artinya, semua kambing pergi selain 9 ekor yang masih tinggal. Kadang yang bikin salah bukan hitungannya, tapi cara membaca soal!"
  },
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Dua ayah dan dua anak pergi memancing. Masing-masing berhasil mendapatkan satu ikan. Anehnya, mereka hanya membutuhkan 3 ikan. Kok bisa?",
    "opsi": { "A": "Satu ikan dimakan bersama", "B": "Salah satu tidak mendapatkan ikan", "C": "Mereka sebenarnya hanya tiga orang", "D": "Mereka membawa ikan dari rumah" },
    "kunci": "C",
    "penjelasan": "Benar! Mereka adalah kakek, ayah, dan anak. Kakek dan ayah adalah dua ayah, sedangkan ayah dan anak adalah dua anak. Jadi hanya ada tiga orang!"
  },
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Lanjutkan deret angka berikut: 3, 6, 11, 18, 27, ... Berapa angka selanjutnya?",
    "opsi": { "A": "36", "B": "38", "C": "40", "D": "37" },
    "kunci": "B",
    "penjelasan": "Jawabannya 38! Selisih setiap angka adalah +3, +5, +7, +9, dan berikutnya +11. Jadi 27 + 11 = 38. Selisihnya membentuk deret bilangan ganjil!"
  },
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Ada sebuah bilangan dua digit. Jumlah kedua digitnya adalah 9. Digit puluhannya tiga kali digit satuannya. Berapakah bilangannya?",
    "opsi": { "A": "36", "B": "72", "C": "81", "D": "63" },
    "kunci": "D",
    "penjelasan": "Jawabannya 63! Digit 6 adalah tiga kali digit 3, dan 6 + 3 = 9. Dua petunjuk sederhana bisa langsung menghasilkan satu jawaban!"
  },
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Hari ini hari Rabu. Kalau 100 hari lagi, hari apa?",
    "opsi": { "A": "Kamis", "B": "Minggu", "C": "Jumat", "D": "Sabtu" },
    "kunci": "C",
    "penjelasan": "Jawabannya Jumat! Satu minggu terdiri dari 7 hari. Setelah 98 hari, kita kembali ke Rabu. Tambah 2 hari lagi berarti Jumat. Tidak perlu menghitung kalender satu per satu!"
  },
  {
    "kategori_kode": "logika",
    "kategori_label": "The Logic Master",
    "pertanyaan": "Pola angka ini punya rahasia: 1, 4, 9, 16, 25, ... Berapa angka berikutnya?",
    "opsi": { "A": "36", "B": "30", "C": "49", "D": "32" },
    "kunci": "A",
    "penjelasan": "Jawabannya 36! Semua angka adalah hasil kuadrat bilangan berurutan: 1², 2², 3², 4², 5². Selanjutnya 6² = 36. Matematika ternyata penuh pola tersembunyi!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "Coba tebak! Berdasarkan Sensus Penduduk 2020, berapa jumlah penduduk Indonesia saat itu?",
    "opsi": { "A": "170,5 juta jiwa", "B": "320,2 juta jiwa", "C": "270,2 juta jiwa", "D": "200,1 juta jiwa" },
    "kunci": "C",
    "penjelasan": "Betul! Hasil Sensus Penduduk 2020 mencatat sekitar 270,20 juta penduduk Indonesia. Bayangkan, lebih dari 270 juta cerita kehidupan yang bisa dipelajari melalui data!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "Gen Z ternyata menjadi generasi dengan proporsi terbesar dalam Sensus Penduduk 2020. Kira-kira berapa persentasenya dari total penduduk Indonesia?",
    "opsi": { "A": "27,94%", "B": "15,20%", "C": "35,50%", "D": "12,75%" },
    "kunci": "A",
    "penjelasan": "Yes! Gen Z menyumbang 27,94% dari penduduk Indonesia berdasarkan SP2020. Generasi yang lahir pada 1997–2012 ini bahkan menjadi kelompok generasi terbesar saat itu. Gen Z literally mendominasi data!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "Ternyata penduduk Indonesia tidak tersebar merata di semua pulau. Berdasarkan SP2020, berapa persen penduduk Indonesia tinggal di Pulau Jawa?",
    "opsi": { "A": "35,10%", "B": "56,10%", "C": "42,50%", "D": "70,20%" },
    "kunci": "B",
    "penjelasan": "Jawabannya 56,10%! Sekitar 151,59 juta penduduk Indonesia tinggal di Pulau Jawa berdasarkan SP2020. Lebih dari separuh penduduk Indonesia terkonsentrasi di satu pulau saja!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "Indonesia dikenal sebagai negara kepulauan. Berdasarkan data jumlah pulau yang dirujuk BPS dari Kemendagri, berapa jumlah pulau Indonesia?",
    "opsi": { "A": "8.500 pulau", "B": "12.500 pulau", "C": "25.000 pulau", "D": "17.001 pulau" },
    "kunci": "D",
    "penjelasan": "Benar! Angka yang digunakan BPS berdasarkan Keputusan Mendagri Tahun 2022 adalah 17.001 pulau. Jumlah ini menggambarkan betapa luas dan beragamnya wilayah Indonesia!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "Sensus Penduduk yang dilakukan BPS itu bukan setiap tahun, lho. Idealnya, kegiatan besar ini dilakukan berapa tahun sekali?",
    "opsi": { "A": "5 tahun sekali", "B": "10 tahun sekali", "C": "15 tahun sekali", "D": "20 tahun sekali" },
    "kunci": "B",
    "penjelasan": "Betul! Sensus Penduduk dilaksanakan setiap 10 tahun sekali. Indonesia telah melaksanakan SP2020, dan sensus berikutnya secara periodik dijadwalkan pada 2030. Sensus membantu pemerintah mengetahui kondisi penduduk secara menyeluruh!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "BPS punya survei bernama Susenas. Kira-kira seberapa sering survei ini dilaksanakan?",
    "opsi": { "A": "Setiap 5 tahun", "B": "Setiap 10 tahun", "C": "Setiap bulan tanpa jeda", "D": "Setiap tahun" },
    "kunci": "D",
    "penjelasan": "Tepat! Susenas atau Survei Sosial Ekonomi Nasional dilaksanakan setiap tahun. Survei ini mengumpulkan informasi seperti pendidikan, kesehatan, pengeluaran rumah tangga, dan kondisi perumahan masyarakat. Data yang dekat banget dengan kehidupan sehari-hari!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "Bonus demografi adalah salah satu peluang besar Indonesia. Berdasarkan SP2020, berapa persen penduduk Indonesia yang berada di kelompok usia produktif (15–64 tahun)?",
    "opsi": { "A": "45,20%", "B": "55,50%", "C": "70,72%", "D": "90,10%" },
    "kunci": "C",
    "penjelasan": "Jawabannya 70,72%! Artinya, mayoritas penduduk Indonesia pada 2020 berada dalam kelompok usia produktif. Ini menjadi peluang besar bagi Indonesia apabila didukung pendidikan, keterampilan, dan lapangan kerja yang memadai!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "Dalam statistik kependudukan, ada istilah sex ratio atau rasio jenis kelamin. Berdasarkan SP2020, berapa rasio jenis kelamin Indonesia?",
    "opsi": { "A": "102 laki-laki per 100 perempuan", "B": "100 laki-laki per 102 perempuan", "C": "150 laki-laki per 100 perempuan", "D": "100 laki-laki per 100 perempuan" },
    "kunci": "A",
    "penjelasan": "Benar! Sex ratio Indonesia pada SP2020 adalah 102. Artinya, terdapat sekitar 102 penduduk laki-laki untuk setiap 100 penduduk perempuan. Statistik bisa membantu kita memahami komposisi penduduk secara lebih detail!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "Berdasarkan SP2020, berapa rata-rata kepadatan penduduk Indonesia? Artinya, berapa orang yang tinggal di setiap 1 km² wilayah daratan Indonesia?",
    "opsi": { "A": "50 jiwa/km²", "B": "141 jiwa/km²", "C": "500 jiwa/km²", "D": "1.000 jiwa/km²" },
    "kunci": "B",
    "penjelasan": "Jawabannya 141 jiwa per km²! Angka ini merupakan rata-rata nasional, bukan berarti semua wilayah memiliki kepadatan yang sama. Jakarta tentu jauh lebih padat dibandingkan banyak wilayah di Kalimantan atau Papua!"
  },
  {
    "kategori_kode": "data",
    "kategori_label": "Detektif Data Indonesia",
    "pertanyaan": "BPS ternyata tidak hanya mengumpulkan data lewat wawancara langsung. Berikut ini yang juga bisa menjadi sumber data statistik BPS adalah...",
    "opsi": { "A": "Rumor yang viral di media sosial", "B": "Tebakan netizen di kolom komentar", "C": "Polling spontan tanpa metode yang jelas", "D": "Data administrasi dari kementerian dan lembaga pemerintah" },
    "kunci": "D",
    "penjelasan": "Tepat! Selain sensus dan survei, BPS juga memanfaatkan data administrasi dari kementerian dan lembaga pemerintah. Contohnya, data pendidikan, kesehatan, dan administrasi kependudukan. Data yang baik tidak selalu harus dikumpulkan dari nol!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Politeknik Statistika STIS merupakan perguruan tinggi kedinasan yang berada di bawah naungan instansi pemerintah apa?",
    "opsi": { "A": "Kementerian Pendidikan Dasar dan Menengah", "B": "Badan Pusat Statistik (BPS)", "C": "Bank Indonesia", "D": "Kementerian Keuangan" },
    "kunci": "B",
    "penjelasan": "Betul! Politeknik Statistika STIS berada di bawah Badan Pusat Statistik (BPS). Jadi, mahasiswa STIS dipersiapkan menjadi talenta profesional yang mendukung pengembangan statistik resmi negara!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Saat ini Politeknik Statistika STIS punya tiga program studi. Mana kombinasi yang benar?",
    "opsi": { "A": "Matematika, Informatika, dan Ekonomi", "B": "Statistika, Akuntansi, dan Manajemen", "C": "Sains Data, Teknologi Informasi, dan Matematika", "D": "D-III Statistika, D-IV Statistika, dan D-IV Komputasi Statistik" },
    "kunci": "D",
    "penjelasan": "Yes! Ada tiga program studi, yaitu D-III Statistika, D-IV Statistika, dan D-IV Komputasi Statistik. Masing-masing punya fokus pembelajaran dan profil lulusan yang berbeda. Pilih sesuai minat dan cita-citamu!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Kamu suka angka, menganalisis fenomena sosial-ekonomi, dan penasaran bagaimana data dikumpulkan lewat survei? Program studi mana yang paling sesuai dengan bidang tersebut?",
    "opsi": { "A": "Statistika", "B": "Teknik Mesin", "C": "Ilmu Hukum", "D": "Desain Komunikasi Visual" },
    "kunci": "A",
    "penjelasan": "Benar! Program Studi Statistika mempelajari metode statistika, perancangan survei, pengolahan data, hingga analisis data sosial dan ekonomi. Lulusannya dipersiapkan untuk mendukung penghasilan statistik resmi negara sebagai tenaga statistisi!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Kalau kamu lebih tertarik coding, membangun sistem informasi, mengolah big data, dan mengembangkan teknologi untuk mendukung statistik, program studi yang cocok adalah...",
    "opsi": { "A": "D-IV Statistika", "B": "D-III Statistika", "C": "D-IV Komputasi Statistik", "D": "Ilmu Komunikasi" },
    "kunci": "C",
    "penjelasan": "Yup! D-IV Komputasi Statistik menggabungkan kemampuan komputasi, pengelolaan data, sains data, dan sistem informasi statistik. Lulusannya dipersiapkan antara lain untuk berperan sebagai pengembang sistem informasi statistik dan pengelola infrastruktur teknologi informasi!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Katanya kuliah di STIS bebas biaya pendidikan. Apakah itu berarti semua mahasiswa otomatis mendapatkan uang saku bulanan juga?",
    "opsi": { "A": "Iya, semua mahasiswa mendapat uang saku besar", "B": "Tidak. Biaya pendidikan dibebaskan, tetapi tidak otomatis mendapatkan uang saku", "C": "Iya, semua kebutuhan hidup ditanggung pemerintah", "D": "Tidak, mahasiswa wajib membayar uang kuliah setiap semester" },
    "kunci": "B",
    "penjelasan": "Jawabannya B! Mahasiswa STIS dibebaskan dari biaya pendidikan berdasarkan ketentuan ikatan dinas, tetapi bukan berarti otomatis mendapat uang saku. Jadi, kuliah bebas biaya pendidikan bukan berarti semua kebutuhan hidup ditanggung!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Apa sih sebenarnya arti ikatan dinas di sekolah kedinasan seperti Politeknik Statistika STIS?",
    "opsi": { "A": "Mahasiswa bebas memilih bekerja di perusahaan mana saja setelah lulus", "B": "Mahasiswa wajib membayar biaya pendidikan setelah lulus", "C": "Mahasiswa otomatis mendapat jabatan pimpinan setelah wisuda", "D": "Lulusan memiliki kewajiban pengabdian atau penempatan kerja sesuai ketentuan ikatan dinas" },
    "kunci": "D",
    "penjelasan": "Tepat! Ikatan dinas berarti ada komitmen untuk menjalankan kewajiban kedinasan setelah menyelesaikan pendidikan sesuai perjanjian dan ketentuan yang berlaku. Jadi, kuliah kedinasan bukan sekadar kuliah gratis, tetapi juga tentang tanggung jawab pengabdian!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Untuk penerimaan mahasiswa baru STIS Tahun Akademik 2026/2027, ada tiga jalur penerimaan. Mana yang termasuk jalur resminya?",
    "opsi": { "A": "Jalur Prestasi Olahraga, Jalur Mandiri, dan Jalur Beasiswa", "B": "Jalur SNBP, SNBT, dan Jalur Mandiri", "C": "Jalur Reguler/Umum, Afirmasi Kewilayahan, dan Pembibitan", "D": "Jalur Undangan, Jalur Prestasi, dan Jalur Rapor" },
    "kunci": "C",
    "penjelasan": "Benar! Pada penerimaan TA 2026/2027, STIS membuka tiga jalur, yaitu Reguler/Umum, Afirmasi Kewilayahan, dan Pembibitan. Setiap jalur memiliki sasaran formasi dan persyaratan masing-masing. Selalu cek pengumuman resmi SPMB sebelum mendaftar!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Ada jalur Pembibitan di penerimaan STIS. Sebenarnya jalur ini merupakan hasil kerja sama antara STIS dengan siapa?",
    "opsi": { "A": "Pemerintah Daerah mitra kerja sama", "B": "Perusahaan swasta", "C": "Universitas luar negeri", "D": "Organisasi olahraga nasional" },
    "kunci": "A",
    "penjelasan": "Tepat! Jalur Pembibitan merupakan jalur penerimaan mahasiswa melalui kerja sama dengan pemerintah daerah untuk memenuhi formasi pegawai di pemerintah daerah mitra. Jadi, ada kebutuhan SDM statistik yang dipersiapkan untuk mendukung daerah!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Mitos atau fakta: Siswa SMK atau MA tidak bisa mendaftar ke Politeknik Statistika STIS karena hanya menerima lulusan SMA IPA. Bagaimana faktanya untuk SPMB TA 2026/2027?",
    "opsi": { "A": "Benar, hanya SMA IPA yang boleh mendaftar", "B": "Salah, lulusan SMA/MA/SMK/MAK semua jurusan dapat mendaftar jika memenuhi persyaratan", "C": "Benar, hanya lulusan SMK jurusan komputer yang boleh mendaftar", "D": "Benar, hanya SMA IPS yang boleh mendaftar" },
    "kunci": "B",
    "penjelasan": "Fakta! Persyaratan SPMB STIS TA 2026/2027 menerima lulusan kelas XII SMA/MA/SMK/MAK semua jurusan. Namun, tetap ada persyaratan akademik dan administrasi lainnya yang wajib dipenuhi. Jadi, jangan minder dulu sebelum cek syaratnya!"
  },
  {
    "kategori_kode": "stis",
    "kategori_label": "STIS Warrior",
    "pertanyaan": "Sudah lolos Seleksi Kompetensi Dasar (SKD) dalam seleksi STIS TA 2026/2027? Salah satu tahapan seleksi lanjutan pertama yang harus dihadapi adalah...",
    "opsi": { "A": "Tes menyanyi", "B": "Tes menggambar bebas", "C": "Tes Matematika", "D": "Tes memasak" },
    "kunci": "C",
    "penjelasan": "Correct! Setelah SKD, peserta menghadapi Seleksi Lanjutan I berupa tes Matematika, kemudian psikotes dan wawancara, serta pemeriksaan kesehatan dan kebugaran. Persiapkan kemampuan akademik sekaligus kondisi fisikmu!"
  }
];

const allSources = [...questionsV1, ...questionsV2, ...questionsGPT];
const seenQuestions = new Set();
const merged = [];

let nextId = 1;

for (const q of allSources) {
  // Normalize question text to check duplicates
  const simplified = q.pertanyaan.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (seenQuestions.has(simplified)) {
    continue;
  }
  seenQuestions.add(simplified);

  let katKode = q.kategori_kode.toLowerCase();
  let katLabel = 'The Logic Master';
  if (katKode.includes('data')) {
    katKode = 'data';
    katLabel = 'Detektif Data Indonesia';
  } else if (katKode.includes('stis')) {
    katKode = 'stis';
    katLabel = 'Pejuang STIS';
  } else {
    katKode = 'logika';
    katLabel = 'The Logic Master';
  }

  merged.push({
    id: nextId++,
    kategori_kode: katKode,
    kategori_label: katLabel,
    pertanyaan: q.pertanyaan.trim(),
    opsi: {
      A: q.opsi.A.trim(),
      B: q.opsi.B.trim(),
      C: q.opsi.C.trim(),
      D: q.opsi.D.trim()
    },
    kunci: q.kunci.trim().toUpperCase(),
    penjelasan: q.penjelasan.trim()
  });
}

// Group counts
const counts = { logika: 0, data: 0, stis: 0 };
merged.forEach(q => counts[q.kategori_kode]++);
console.log('Total merged questions:', merged.length);
console.log('Breakdown by category:', counts);

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/questions.json', JSON.stringify(merged, null, 2), 'utf8');
console.log('Wrote to src/data/questions.json successfully!');
