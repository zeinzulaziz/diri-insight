/*
 * Bank pertanyaan Diri Insight.
 * Setiap opsi punya nilai 1-5: 5 = pola yang paling menopang, 1 = pola yang paling menguras.
 * Satu pertanyaan bisa menyumbang ke beberapa dimensi sekaligus.
 * Urutan opsi diacak saat kuis dimulai, jadi posisi tidak membocorkan jawaban "terbaik".
 */
window.DIRI_DATA = {
  dimensions: {
    akar: {
      name: 'Akar & Rasa Aman',
      short: 'Akar',
      description: 'Seberapa aman kamu tumbuh, dan seberapa besar dunia terasa bisa diandalkan.',
      high: 'Kamu punya dasar rasa aman yang cukup untuk dekat tanpa terus waspada.',
      low: 'Kamu belajar waspada lebih awal daripada belajar merasa aman.'
    },
    sadar: {
      name: 'Kesadaran Diri',
      short: 'Kesadaran',
      description: 'Seberapa jujur kamu melihat perasaan, motif, dan pola yang kamu ulangi.',
      high: 'Kamu bisa melihat isi kepalamu tanpa langsung diperintah olehnya.',
      low: 'Banyak dorongan bergerak lebih cepat daripada pemahamanmu tentangnya.'
    },
    regulasi: {
      name: 'Regulasi Emosi',
      short: 'Regulasi',
      description: 'Kemampuan menampung gelombang tanpa meledak, membeku, atau menghilang.',
      high: 'Kamu punya ruang antara rasa dan respons.',
      low: 'Emosi besar sering tiba sebelum kamu sempat menyiapkan tempat untuknya.'
    },
    empati: {
      name: 'Empati & Belas Kasih',
      short: 'Empati',
      description: 'Kemampuan membaca pengalaman orang lain tanpa kehilangan diri sendiri.',
      high: 'Kamu peka pada yang tak terucap, dan tahu kapan harus bertanya.',
      low: 'Kamu bisa memahami orang lain, tetapi sering baru setelah situasinya lewat.'
    },
    komunikasi: {
      name: 'Komunikasi & Asertivitas',
      short: 'Komunikasi',
      description: 'Kemampuan mengatakan hal sulit tanpa menyerang atau menghilang.',
      high: 'Kamu bisa jujur tanpa membuat hubungan menjadi medan perang.',
      low: 'Hal penting lebih sering kamu tahan, tunda, atau ubah sampai kehilangan bentuk.'
    },
    pikir: {
      name: 'Pola Pikir & Fleksibilitas',
      short: 'Pola pikir',
      description: 'Cara kamu memperlakukan keyakinan sendiri saat bukti berubah.',
      high: 'Kamu nyaman memperbarui cara, bukan hanya mempertahankannya.',
      low: 'Kesimpulan lama sering kamu lindungi dari informasi yang mengganggu.'
    },
    batas: {
      name: 'Batas Diri & Relasi',
      short: 'Batas',
      description: 'Kemampuan dekat tanpa kehilangan ruang, dan menolak tanpa rasa bersalah berlebih.',
      high: 'Kedekatan tidak membuatmu kehilangan diri.',
      low: 'Batasmu lebih sering ditentukan rasa takut mengecewakan daripada pilihan sadar.'
    },
    resiliensi: {
      name: 'Ketahanan & Pemulihan',
      short: 'Ketahanan',
      description: 'Cara kamu bertahan di bawah tekanan, lalu kembali ke ritme yang cukup stabil.',
      high: 'Kamu bisa pulih tanpa harus mengencang sepanjang waktu.',
      low: 'Di bawah tekanan, kamu bertahan dengan menahan napas, bukan memulihkan tenaga.'
    }
  },

  sections: [
    {
      id: 'keluarga',
      name: 'Pola Asuh & Keluarga',
      short: 'Pola asuh',
      intro: 'Tempat pertama kamu belajar apa yang aman, apa yang harus disembunyikan, dan bagaimana cinta ditunjukkan.'
    },
    {
      id: 'lingkungan',
      name: 'Lingkungan Tumbuh & Budaya',
      short: 'Lingkungan',
      intro: 'Sekolah, pertemanan, dan norma di sekitarmu ikut menulis versi dirimu yang bertahan sampai sekarang.'
    },
    {
      id: 'komunikasi',
      name: 'Gaya Komunikasi',
      short: 'Komunikasi',
      intro: 'Bukan hanya apa yang kamu katakan, tetapi juga apa yang kamu tahan dan bagaimana kamu menanggapinya.'
    },
    {
      id: 'ei',
      name: 'Kecerdasan Emosional',
      short: 'Emosi',
      intro: 'Empat lapis: mengenali, menampung, membaca orang lain, dan membangun hubungan.'
    },
    {
      id: 'pikir',
      name: 'Pola Pikir & Respons',
      short: 'Pola pikir',
      intro: 'Cara kamu menjelaskan kegagalan, menghadapi ketidakpastian, dan memperlakukan keyakinan sendiri.'
    },
    {
      id: 'relasi',
      name: 'Memperlakukan Orang Lain & Batas',
      short: 'Relasi',
      intro: 'Bagaimana kamu menempatkan kebutuhan orang lain di sekitar kebutuhanmu sendiri.'
    },
    {
      id: 'bawah-sadar',
      name: 'Pola Bawah Sadar & Coping',
      short: 'Pola bawah sadar',
      intro: 'Strategi yang dulu menyelamatkanmu, lalu diam-diam mengambil alih saat tidak lagi dibutuhkan.'
    },
    {
      id: 'nilai',
      name: 'Nilai Hidup & Motivasi',
      short: 'Nilai',
      intro: 'Apa yang membuat hidup terasa berarti, dan apa yang kamu kejar ketika tidak ada yang melihat.'
    },
    {
      id: 'pengalaman',
      name: 'Pengalaman yang Membentuk',
      short: 'Pengalaman',
      intro: 'Dibaca dengan hati-hati, tanpa diagnosis: bagaimana masa lalu masih hadir di responsmu hari ini.'
    }
  ],

  questions: [
    /* A. Pola Asuh & Keluarga */
    {
      id: 'A1',
      section: 'keluarga',
      dims: ['akar'],
      prompt: 'Saat kamu masih kecil, bagaimana perasaan sulit seperti sedih atau takut biasanya disikapi di rumah?',
      options: [
        { text: 'Dibicarakan, ditanyakan, dan ditampung tanpa harus buru-buru selesai.', v: 5 },
        { text: 'Kadang ditanyakan, tetapi sering berhenti di "sudah, jangan dipikir".', v: 4 },
        { text: 'Lebih sering diselesaikan dengan nasihat atau solusi, bukan didengar.', v: 3 },
        { text: 'Dianggap berlebihan atau dibalas dengan kemarahan.', v: 1 },
        { text: 'Aku tidak ingat pernah membicarakannya.', v: 2 }
      ]
    },
    {
      id: 'A2',
      section: 'keluarga',
      dims: ['akar'],
      prompt: 'Ketika kamu melakukan kesalahan yang cukup besar saat kecil, apa yang paling sering terjadi?',
      options: [
        { text: 'Dibahas tanpa membuatku merasa buruk sebagai pribadi.', v: 5 },
        { text: 'Ada kekecewaan, tetapi juga ruang untuk memperbaiki.', v: 4 },
        { text: 'Dikritik panjang, lalu masalahnya selesai di situ.', v: 2 },
        { text: 'Dihukum atau dipermalukan di depan orang lain.', v: 1 },
        { text: 'Tidak ada yang membahasnya, semuanya berpura-pura tidak terjadi.', v: 2 }
      ]
    },
    {
      id: 'A3',
      section: 'keluarga',
      dims: ['akar', 'batas'],
      prompt: 'Seberapa besar keputusanmu tentang sekolah, pertemanan, atau penampilan ditentukan oleh orang tua?',
      options: [
        { text: 'Aku punya ruang untuk memilih, dengan bimbingan yang cukup.', v: 5 },
        { text: 'Aku bisa berpendapat, meski keputusan akhir sering ada di mereka.', v: 4 },
        { text: 'Banyak hal harus mengikuti keinginan mereka agar tidak ada masalah.', v: 2 },
        { text: 'Hampir semua ditentukan, dan membantah tidak banyak berguna.', v: 1 },
        { text: 'Mereka sibuk, jadi aku belajar memutuskan sendiri tanpa banyak arahan.', v: 3 }
      ]
    },
    {
      id: 'A4',
      section: 'keluarga',
      dims: ['akar', 'komunikasi'],
      prompt: 'Bagaimana orang tua merespons ketika kamu berbeda pendapat dengan mereka?',
      options: [
        { text: 'Mendengarkan, lalu menjelaskan sudut pandang mereka.', v: 5 },
        { text: 'Bisa menerima, meski kadang dengan nada kesal.', v: 4 },
        { text: 'Menanggapinya sebagai pembangkangan.', v: 2 },
        { text: 'Memakai rasa bersalah atau diam panjang untuk menunjukkan kekecewaan.', v: 1 },
        { text: 'Tidak ada ruang untuk berbeda; topik itu dihindari.', v: 2 }
      ]
    },
    {
      id: 'A5',
      section: 'keluarga',
      dims: ['akar'],
      prompt: 'Di rumahmu dulu, seberapa sering pujian atau pengakuan diucapkan?',
      options: [
        { text: 'Cukup sering, untuk hal kecil maupun besar.', v: 5 },
        { text: 'Kadang, biasanya saat ada pencapaian.', v: 4 },
        { text: 'Jarang; kasih sayang lebih ditunjukkan lewat tindakan.', v: 3 },
        { text: 'Hampir tidak pernah; yang diingat justru kekurangannya.', v: 1 },
        { text: 'Pujian terasa seperti jebakan atau pemicu masalah.', v: 2 }
      ]
    },
    {
      id: 'A6',
      section: 'keluarga',
      dims: ['akar', 'resiliensi'],
      prompt: 'Apa peran yang paling sering kamu ambil di keluarga saat masih kecil?',
      options: [
        { text: 'Anak yang bisa menjadi diri sendiri, tanpa harus menanggung suasana.', v: 5 },
        { text: 'Anak yang cukup mandiri, meski kadang kesepian.', v: 3 },
        { text: 'Anak yang menenangkan orang tua atau menjaga adik.', v: 2 },
        { text: 'Anak yang harus berprestasi agar keluarga terlihat baik.', v: 2 },
        { text: 'Anak yang tidak terlihat, karena masalah orang dewasa lebih besar.', v: 1 }
      ]
    },
    {
      id: 'A7',
      section: 'keluarga',
      dims: ['akar', 'regulasi'],
      prompt: 'Seberapa aman kamu untuk marah atau kecewa di rumah dulu?',
      options: [
        { text: 'Aman; kemarahan bisa dibicarakan tanpa merusak hubungan.', v: 5 },
        { text: 'Cukup aman, asal tidak terlalu lama atau terlalu keras.', v: 4 },
        { text: 'Aku belajar menahan marah karena hasilnya selalu lebih buruk.', v: 2 },
        { text: 'Marah dibalas dengan ancaman, hukuman, atau kekerasan.', v: 1 },
        { text: 'Aku tidak pernah tahu kapan marah akan diterima dan kapan tidak.', v: 2 }
      ]
    },
    {
      id: 'A8',
      section: 'keluarga',
      dims: ['akar', 'resiliensi'],
      prompt: 'Seberapa bisa diprediksi suasana rumahmu saat kamu tumbuh?',
      options: [
        { text: 'Cukup stabil; aku tahu apa yang bisa kuharapkan.', v: 5 },
        { text: 'Ada masa sulit, tetapi ada juga rutinitas yang menopang.', v: 4 },
        { text: 'Suasana sering berubah dan aku harus membaca tanda-tandanya.', v: 2 },
        { text: 'Sangat tidak stabil; hal baik bisa berubah cepat tanpa alasan jelas.', v: 1 },
        { text: 'Rumah terasa seperti tempat yang harus segera kutinggalkan.', v: 1 }
      ]
    },
    {
      id: 'A9',
      section: 'keluarga',
      dims: ['akar', 'empati'],
      prompt: 'Bagaimana keluargamu membicarakan orang di luar keluarga?',
      options: [
        { text: 'Dengan rasa ingin tahu dan cukup adil.', v: 5 },
        { text: 'Kadang menghakimi, tetapi tidak menjadi kebiasaan.', v: 4 },
        { text: 'Sering mengomentari kekurangan orang lain.', v: 2 },
        { text: 'Dunia dibagi jelas antara "kita" dan "mereka".', v: 1 },
        { text: 'Aku tidak banyak mendengar percakapan seperti itu.', v: 3 }
      ]
    },
    {
      id: 'A10',
      section: 'keluarga',
      dims: ['akar', 'batas'],
      prompt: 'Saat ada konflik antara orang dewasa di rumah, apa yang biasanya kamu lakukan?',
      options: [
        { text: 'Aku tidak perlu ikut campur; mereka menyelesaikannya sendiri.', v: 5 },
        { text: 'Aku tahu ada masalah, tetapi tetap merasa cukup aman.', v: 4 },
        { text: 'Aku berusaha menengahi atau menghibur salah satu pihak.', v: 2 },
        { text: 'Aku menyembunyikan diri dan berharap semuanya cepat selesai.', v: 2 },
        { text: 'Aku menjadi tempat curhat, meski belum mampu menanggungnya.', v: 1 }
      ]
    },
    {
      id: 'A11',
      section: 'keluarga',
      dims: ['akar', 'batas', 'komunikasi'],
      prompt: 'Apa yang paling kamu bawa dari cara keluargamu memperlakukan satu sama lain?',
      options: [
        { text: 'Cara mendengarkan dan memperbaiki kesalahan.', v: 5 },
        { text: 'Rasa tanggung jawab untuk menjaga keharmonisan.', v: 3 },
        { text: 'Kebiasaan menahan hal yang mengganggu agar tidak ada keributan.', v: 2 },
        { text: 'Kecurigaan bahwa kedekatan selalu punya harga.', v: 1 },
        { text: 'Keyakinan bahwa aku harus berguna agar dicintai.', v: 1 }
      ]
    },

    /* B. Lingkungan Tumbuh & Budaya */
    {
      id: 'B1',
      section: 'lingkungan',
      dims: ['akar', 'pikir'],
      prompt: 'Di lingkungan tempatmu tumbuh, seberapa kuat pesan bahwa kamu harus mengikuti cara yang sudah ada?',
      options: [
        { text: 'Ada ruang untuk bertanya dan memilih jalan sendiri.', v: 5 },
        { text: 'Ada tuntutan, tetapi masih bisa dinegosiasikan.', v: 4 },
        { text: 'Menyimpang sedikit saja langsung menjadi bahan pembicaraan.', v: 2 },
        { text: 'Mengikuti aturan adalah harga untuk diterima.', v: 1 },
        { text: 'Aku tidak pernah tahu aturan mana yang berlaku.', v: 2 }
      ]
    },
    {
      id: 'B2',
      section: 'lingkungan',
      dims: ['empati', 'pikir'],
      prompt: 'Bagaimana lingkunganmu memperlakukan orang yang berbeda, misalnya berbeda agama, kelas, atau cara hidup?',
      options: [
        { text: 'Penasaran dan cukup terbuka.', v: 5 },
        { text: 'Sopan, meski ada jarak yang tidak diucapkan.', v: 3 },
        { text: 'Sering dijadikan bahan lelucon atau kecurigaan.', v: 2 },
        { text: 'Dianggap ancaman atau harus disingkirkan.', v: 1 },
        { text: 'Aku dibesarkan untuk tidak membicarakannya.', v: 2 }
      ]
    },
    {
      id: 'B3',
      section: 'lingkungan',
      dims: ['akar', 'batas'],
      prompt: 'Seberapa sering kamu merasa harus mewakili keluarga atau kelompokmu di luar rumah?',
      options: [
        { text: 'Hampir tidak pernah; aku bisa menjadi diriku sendiri.', v: 5 },
        { text: 'Kadang, terutama saat ada acara atau tamu.', v: 4 },
        { text: 'Sering; perilakuku dianggap mencerminkan nama keluarga.', v: 2 },
        { text: 'Selalu; kesalahan kecil bisa memalukan banyak orang.', v: 1 },
        { text: 'Aku justru merasa harus melawan citra yang sudah melekat.', v: 2 }
      ]
    },
    {
      id: 'B4',
      section: 'lingkungan',
      dims: ['akar', 'sadar'],
      prompt: 'Saat kecil, seberapa aman kamu menunjukkan hal yang membuatmu berbeda dari teman sebaya?',
      options: [
        { text: 'Aman; perbedaan tidak dijadikan masalah.', v: 5 },
        { text: 'Cukup aman, meski aku tetap memilih diam di beberapa hal.', v: 4 },
        { text: 'Aku belajar menyembunyikan bagian tertentu agar tidak ditargetkan.', v: 2 },
        { text: 'Perbedaan membuatku dipermalukan atau dijauhi.', v: 1 },
        { text: 'Aku tidak yakin apa yang "berbeda" dari diriku.', v: 2 }
      ]
    },
    {
      id: 'B5',
      section: 'lingkungan',
      dims: ['akar', 'empati', 'resiliensi'],
      prompt: 'Bagaimana pengalaman pertemananmu di sekolah dasar dan menengah?',
      options: [
        { text: 'Ada beberapa teman dekat dan rasa memiliki yang cukup.', v: 5 },
        { text: 'Ada masa kesepian, tetapi juga koneksi yang berarti.', v: 4 },
        { text: 'Aku sering merasa di pinggir, meski tidak selalu sendirian.', v: 2 },
        { text: 'Aku pernah menjadi sasaran ejekan atau kekerasan sosial.', v: 1 },
        { text: 'Aku lebih sering menjadi pengamat daripada bagian dari kelompok.', v: 2 }
      ]
    },
    {
      id: 'B6',
      section: 'lingkungan',
      dims: ['pikir', 'resiliensi'],
      prompt: 'Apa pesan yang paling sering kamu dengar tentang uang dan kerja saat tumbuh?',
      options: [
        { text: 'Kerja penting, tetapi bukan satu-satunya ukuran nilai seseorang.', v: 5 },
        { text: 'Harus aman dan stabil, jangan mengambil risiko.', v: 3 },
        { text: 'Kamu harus berhasil agar tidak menjadi beban.', v: 2 },
        { text: 'Uang adalah satu-satunya cara untuk dihormati.', v: 1 },
        { text: 'Tidak ada yang membicarakannya secara terbuka.', v: 2 }
      ]
    },
    {
      id: 'B7',
      section: 'lingkungan',
      dims: ['resiliensi', 'pikir'],
      prompt: 'Seberapa sering lingkunganmu memberi ruang untuk membicarakan kegagalan tanpa mempermalukan?',
      options: [
        { text: 'Kegagalan dibahas sebagai pelajaran.', v: 5 },
        { text: 'Bisa dibicarakan, tetapi tetap ada rasa malu.', v: 3 },
        { text: 'Kegagalan lebih sering disembunyikan.', v: 2 },
        { text: 'Kegagalan dipakai sebagai bukti bahwa kamu tidak cukup.', v: 1 },
        { text: 'Tidak ada yang mau mendengarnya.', v: 2 }
      ]
    },
    {
      id: 'B8',
      section: 'lingkungan',
      dims: ['pikir', 'empati'],
      prompt: 'Apa yang paling memengaruhi cara kamu melihat "orang luar" saat ini?',
      options: [
        { text: 'Pengalaman nyata bertemu orang yang berbeda.', v: 5 },
        { text: 'Didikan keluarga yang menekankan sopan santun.', v: 3 },
        { text: 'Cerita dan stereotip yang diulang di lingkungan.', v: 2 },
        { text: 'Rasa takut yang tidak pernah aku periksa.', v: 1 },
        { text: 'Aku masih mencari jawabannya.', v: 3 }
      ]
    },

    /* C. Gaya Komunikasi */
    {
      id: 'C1',
      section: 'komunikasi',
      dims: ['komunikasi', 'regulasi'],
      prompt: 'Saat kamu perlu menyampaikan hal yang tidak nyaman, apa yang biasanya terjadi?',
      options: [
        { text: 'Aku mengatakannya cukup langsung, dengan usaha menjaga hubungan.', v: 5 },
        { text: 'Aku menunggu momen yang tepat dan menyampaikannya sebagian.', v: 3 },
        { text: 'Aku menunda sampai rasanya sudah terlalu besar.', v: 2 },
        { text: 'Aku menghindari, lalu berharap orang lain menebak.', v: 1 },
        { text: 'Aku menyampaikannya, tetapi dengan cara yang akhirnya melukai.', v: 2 }
      ]
    },
    {
      id: 'C2',
      section: 'komunikasi',
      dims: ['empati', 'komunikasi'],
      prompt: 'Ketika orang lain sedang bercerita, apa yang paling sering kamu lakukan?',
      options: [
        { text: 'Mendengar sampai selesai, lalu bertanya apa yang dia butuhkan.', v: 5 },
        { text: 'Mendengar sambil mencari solusi yang bisa kusampaikan.', v: 3 },
        { text: 'Membandingkan dengan pengalamanku sendiri.', v: 2 },
        { text: 'Menunggu giliran bicara.', v: 2 },
        { text: 'Sulit fokus karena pikiranku sibuk dengan hal lain.', v: 1 }
      ]
    },
    {
      id: 'C3',
      section: 'komunikasi',
      dims: ['regulasi', 'komunikasi', 'sadar'],
      prompt: 'Bagaimana kamu merespons kritik yang menurutmu tidak adil?',
      options: [
        { text: 'Aku bertanya untuk memahami, lalu menjelaskan bagian yang tidak tepat.', v: 5 },
        { text: 'Aku merasa tersinggung, tetapi mencoba menanggapinya dengan tenang.', v: 4 },
        { text: 'Aku diam dan menyimpannya lama.', v: 2 },
        { text: 'Aku langsung membela diri atau menyerang balik.', v: 1 },
        { text: 'Aku setuju saja agar percakapan cepat selesai.', v: 2 }
      ]
    },
    {
      id: 'C4',
      section: 'komunikasi',
      dims: ['komunikasi', 'batas', 'regulasi'],
      prompt: 'Saat kamu tidak setuju dengan orang yang penting bagimu, bagaimana kamu menunjukkannya?',
      options: [
        { text: 'Bisa berbeda pendapat tanpa membuatnya menjadi pertarungan.', v: 5 },
        { text: 'Aku menyampaikannya dengan hati-hati, kadang terlalu hati-hati.', v: 4 },
        { text: 'Aku mengalah dulu, lalu menyimpan kesal.', v: 2 },
        { text: 'Aku meledak setelah menahan terlalu lama.', v: 1 },
        { text: 'Aku menghindari topik itu sepenuhnya.', v: 1 }
      ]
    },
    {
      id: 'C5',
      section: 'komunikasi',
      dims: ['batas', 'komunikasi'],
      prompt: 'Seberapa mudah kamu mengatakan "tidak" tanpa memberikan alasan panjang?',
      options: [
        { text: 'Cukup mudah; "tidak" bisa berdiri sendiri.', v: 5 },
        { text: 'Bisa, tetapi aku biasanya menjelaskan banyak hal.', v: 4 },
        { text: 'Sulit; aku merasa harus punya alasan yang diterima.', v: 2 },
        { text: 'Hampir tidak bisa; aku sering mengatakan "iya" lalu menyesal.', v: 1 },
        { text: 'Aku tidak pernah merasa punya pilihan untuk menolak.', v: 1 }
      ]
    },
    {
      id: 'C6',
      section: 'komunikasi',
      dims: ['sadar', 'regulasi'],
      prompt: 'Apa yang biasanya kamu lakukan setelah percakapan yang terasa canggung?',
      options: [
        { text: 'Aku memeriksa apa yang terjadi, lalu melanjutkan hari.', v: 5 },
        { text: 'Aku memikirkannya sebentar, lalu bisa melepasnya.', v: 4 },
        { text: 'Aku mengulang kalimatku dan mencari kesalahan diri.', v: 2 },
        { text: 'Aku menghubungi orang itu untuk memastikan semuanya baik.', v: 2 },
        { text: 'Aku menghindari orang itu untuk sementara waktu.', v: 1 }
      ]
    },
    {
      id: 'C7',
      section: 'komunikasi',
      dims: ['komunikasi', 'batas', 'sadar'],
      prompt: 'Bagaimana kamu menyampaikan kebutuhanmu dalam hubungan dekat?',
      options: [
        { text: 'Cukup jelas, sebelum menjadi tuntutan atau ledakan.', v: 5 },
        { text: 'Aku menyampaikannya, tetapi sering menunggu sampai yakin aman.', v: 3 },
        { text: 'Aku memberi petunjuk dan berharap dipahami.', v: 2 },
        { text: 'Aku menahan sampai orang lain menyadarinya sendiri.', v: 1 },
        { text: 'Aku tidak yakin kebutuhanku cukup penting untuk disampaikan.', v: 1 }
      ]
    },
    {
      id: 'C8',
      section: 'komunikasi',
      dims: ['komunikasi', 'regulasi', 'batas'],
      prompt: 'Saat terjadi konflik, apa tujuan utamamu?',
      options: [
        { text: 'Menyelesaikan masalah tanpa merusak hubungan.', v: 5 },
        { text: 'Meredakan ketegangan secepat mungkin.', v: 3 },
        { text: 'Membuktikan bahwa aku benar.', v: 2 },
        { text: 'Menghindari pembicaraan sampai semuanya reda.', v: 1 },
        { text: 'Memastikan orang lain tidak meninggalkanku.', v: 1 }
      ]
    },

    /* D. Kecerdasan Emosional */
    {
      id: 'D1',
      section: 'ei',
      dims: ['sadar', 'regulasi'],
      prompt: 'Seberapa cepat kamu menyadari bahwa sesuatu sedang mengganggumu?',
      options: [
        { text: 'Cukup cepat; aku bisa menamai perasaannya sebelum bertindak.', v: 5 },
        { text: 'Aku sadar, tetapi biasanya setelah beberapa saat.', v: 4 },
        { text: 'Aku baru sadar ketika sudah meledak atau menarik diri.', v: 2 },
        { text: 'Aku sering bingung apa yang sebenarnya kurasakan.', v: 1 },
        { text: 'Aku lebih sering menjelaskannya sebagai "capek" atau "biasa saja".', v: 2 }
      ]
    },
    {
      id: 'D2',
      section: 'ei',
      dims: ['regulasi', 'resiliensi'],
      prompt: 'Ketika emosi besar muncul, apa yang biasanya kamu lakukan?',
      options: [
        { text: 'Memberi ruang untuk merasakannya, lalu memilih respons.', v: 5 },
        { text: 'Menenangkan diri dulu, meski butuh waktu.', v: 4 },
        { text: 'Sibuk dengan sesuatu agar tidak merasakannya.', v: 2 },
        { text: 'Mengikuti dorongan saat itu juga.', v: 1 },
        { text: 'Membeku dan tidak bisa melakukan apa pun.', v: 2 }
      ]
    },
    {
      id: 'D3',
      section: 'ei',
      dims: ['empati', 'sadar'],
      prompt: 'Seberapa akurat kamu bisa menebak apa yang orang lain rasakan?',
      options: [
        { text: 'Cukup akurat, dan aku tahu kapan harus bertanya.', v: 5 },
        { text: 'Kadang akurat, kadang aku memproyeksikan pengalamanku.', v: 4 },
        { text: 'Aku sering salah membaca, terutama saat orang menyembunyikan sesuatu.', v: 2 },
        { text: 'Aku lebih fokus pada kata-kata daripada nada dan bahasa tubuh.', v: 2 },
        { text: 'Aku sengaja tidak membaca terlalu dalam agar tidak terbebani.', v: 1 }
      ]
    },
    {
      id: 'D4',
      section: 'ei',
      dims: ['regulasi', 'sadar', 'pikir'],
      prompt: 'Apa yang terjadi ketika kamu merasa dikritik?',
      options: [
        { text: 'Aku bisa memisahkan isi kritik dari perasaan tidak nyaman.', v: 5 },
        { text: 'Aku tersinggung, tetapi bisa kembali ke isinya.', v: 4 },
        { text: 'Aku mendengar semuanya sebagai penilaian tentang diriku.', v: 1 },
        { text: 'Aku langsung mencari pembenaran.', v: 2 },
        { text: 'Aku mematikan perasaan dan setuju dengan semuanya.', v: 2 }
      ]
    },
    {
      id: 'D5',
      section: 'ei',
      dims: ['sadar', 'batas'],
      prompt: 'Seberapa sering kamu menyadari bahwa kamu sedang memakai "topeng"?',
      options: [
        { text: 'Cukup sering; aku tahu kapan aku menyesuaikan diri dan mengapa.', v: 5 },
        { text: 'Kadang, terutama setelah percakapan yang melelahkan.', v: 4 },
        { text: 'Aku baru menyadarinya ketika sudah terlalu lelah.', v: 2 },
        { text: 'Aku tidak yakin mana yang topeng dan mana yang asli.', v: 1 },
        { text: 'Aku merasa topeng itu sudah menjadi diriku.', v: 1 }
      ]
    },
    {
      id: 'D6',
      section: 'ei',
      dims: ['regulasi', 'sadar'],
      prompt: 'Saat kamu merasa bersalah, bagaimana kamu meresponsnya?',
      options: [
        { text: 'Memeriksa apakah ada yang perlu kuperbaiki, lalu bergerak.', v: 5 },
        { text: 'Merasakannya, meminta maaf bila perlu, lalu melepaskannya.', v: 4 },
        { text: 'Mengulanginya di kepala sampai berhari-hari.', v: 2 },
        { text: 'Menghindari orang yang membuatku merasa bersalah.', v: 1 },
        { text: 'Menyangkal atau menyalahkan orang lain.', v: 1 }
      ]
    },
    {
      id: 'D7',
      section: 'ei',
      dims: ['regulasi', 'pikir'],
      prompt: 'Seberapa nyaman kamu berada dalam ketidakpastian?',
      options: [
        { text: 'Cukup nyaman; aku bisa mengambil keputusan dengan informasi terbatas.', v: 5 },
        { text: 'Bisa, tetapi aku butuh rencana cadangan.', v: 4 },
        { text: 'Aku sering mencari kepastian berulang kali.', v: 2 },
        { text: 'Aku menunda keputusan sampai semua terasa pasti.', v: 1 },
        { text: 'Aku membuat skenario terburuk agar tidak kaget.', v: 1 }
      ]
    },
    {
      id: 'D8',
      section: 'ei',
      dims: ['empati', 'komunikasi'],
      prompt: 'Ketika seseorang dekat denganmu sedang sedih, apa yang biasanya kamu lakukan?',
      options: [
        { text: 'Hadir, mendengarkan, dan bertanya apa yang membantu.', v: 5 },
        { text: 'Memberi saran atau solusi agar dia cepat baik.', v: 3 },
        { text: 'Merasa ikut sedih dan terbawa suasana.', v: 2 },
        { text: 'Menghindar karena tidak tahu harus berbuat apa.', v: 1 },
        { text: 'Mengalihkan pembicaraan ke hal yang lebih ringan.', v: 2 }
      ]
    },
    {
      id: 'D9',
      section: 'ei',
      dims: ['resiliensi', 'batas', 'komunikasi'],
      prompt: 'Seberapa sering kamu meminta bantuan ketika benar-benar membutuhkannya?',
      options: [
        { text: 'Cukup sering; aku bisa menyebutkan apa yang kubutuhkan.', v: 5 },
        { text: 'Kadang, setelah mencoba sendiri dulu.', v: 4 },
        { text: 'Jarang; aku merasa merepotkan.', v: 2 },
        { text: 'Hampir tidak pernah; aku lebih memilih menanggung sendiri.', v: 1 },
        { text: 'Aku menunggu orang lain menawarkan bantuan.', v: 2 }
      ]
    },
    {
      id: 'D10',
      section: 'ei',
      dims: ['sadar', 'regulasi', 'resiliensi'],
      prompt: 'Apa yang paling sering kamu lakukan saat sendirian dengan pikiranmu?',
      options: [
        { text: 'Aku bisa beristirahat, merenung, atau melakukan hal yang menenangkan.', v: 5 },
        { text: 'Pikiranku ramai, tetapi aku punya cara untuk menenangkannya.', v: 4 },
        { text: 'Aku mengulang percakapan dan kesalahan lama.', v: 2 },
        { text: 'Aku mencari distraksi agar tidak sendirian dengan pikiranku.', v: 1 },
        { text: 'Aku merencanakan banyak kemungkinan buruk.', v: 1 }
      ]
    },

    /* E. Pola Pikir & Respons */
    {
      id: 'E1',
      section: 'pikir',
      dims: ['pikir', 'sadar'],
      prompt: 'Ketika keyakinanmu terbukti salah, apa yang biasanya terjadi?',
      options: [
        { text: 'Aku bisa mengubahnya tanpa merasa kehilangan identitas.', v: 5 },
        { text: 'Aku butuh waktu, tetapi akhirnya bisa menerima.', v: 4 },
        { text: 'Aku mencari alasan agar keyakinanku tetap benar.', v: 2 },
        { text: 'Aku merasa dipermalukan dan bertahan lebih keras.', v: 1 },
        { text: 'Aku menghindari situasi yang bisa membuktikan aku salah.', v: 1 }
      ]
    },
    {
      id: 'E2',
      section: 'pikir',
      dims: ['pikir', 'resiliensi'],
      prompt: 'Bagaimana kamu menjelaskan kegagalan?',
      options: [
        { text: 'Sebagai hasil dari banyak faktor, termasuk hal yang bisa kuubah.', v: 5 },
        { text: 'Sebagai pelajaran, meski awalnya terasa menyakitkan.', v: 4 },
        { text: 'Sebagai bukti bahwa aku memang kurang.', v: 1 },
        { text: 'Sebagai kesalahan orang lain atau keadaan.', v: 2 },
        { text: 'Aku berhenti mencoba agar tidak gagal lagi.', v: 1 }
      ]
    },
    {
      id: 'E3',
      section: 'pikir',
      dims: ['pikir', 'resiliensi'],
      prompt: 'Saat menghadapi masalah baru, langkah pertamamu biasanya...',
      options: [
        { text: 'Mengumpulkan informasi dan mencoba cara kecil.', v: 5 },
        { text: 'Membuat rencana sebelum bergerak.', v: 4 },
        { text: 'Menunggu sampai masalahnya mendesak.', v: 2 },
        { text: 'Membayangkan semua hal yang bisa salah.', v: 1 },
        { text: 'Meminta orang lain mengambil keputusan.', v: 2 }
      ]
    },
    {
      id: 'E4',
      section: 'pikir',
      dims: ['pikir', 'regulasi'],
      prompt: 'Seberapa mudah kamu mengubah cara saat cara lama tidak lagi bekerja?',
      options: [
        { text: 'Cukup mudah; aku lebih peduli hasil daripada ego.', v: 5 },
        { text: 'Bisa, setelah aku yakin cara itu benar-benar gagal.', v: 4 },
        { text: 'Sulit; aku bertahan karena sudah berinvestasi banyak.', v: 2 },
        { text: 'Aku tetap melakukannya meski tahu itu merugikan.', v: 1 },
        { text: 'Aku bingung harus mulai dari mana.', v: 2 }
      ]
    },
    {
      id: 'E5',
      section: 'pikir',
      dims: ['sadar', 'pikir', 'resiliensi'],
      prompt: 'Ketika kamu membandingkan dirimu dengan orang lain, apa yang paling sering muncul?',
      options: [
        { text: 'Rasa kagum yang bisa kujadikan arah, bukan bukti kekurangan.', v: 5 },
        { text: 'Sedikit iri, tetapi aku bisa kembali ke jalanku.', v: 4 },
        { text: 'Rasa tertinggal yang sulit kulepaskan.', v: 2 },
        { text: 'Keyakinan bahwa aku selalu kalah.', v: 1 },
        { text: 'Aku menghindari media sosial agar tidak merasakannya.', v: 2 }
      ]
    },
    {
      id: 'E6',
      section: 'pikir',
      dims: ['regulasi', 'resiliensi'],
      prompt: 'Apa yang kamu lakukan ketika pikiranmu terus mengulang skenario buruk?',
      options: [
        { text: 'Menyadari polanya, mencatat, lalu mengarahkan perhatian.', v: 5 },
        { text: 'Mencoba menenangkan diri dengan aktivitas.', v: 3 },
        { text: 'Membiarkannya sampai kelelahan sendiri.', v: 2 },
        { text: 'Mencari jaminan dari orang lain berulang kali.', v: 1 },
        { text: 'Aku tenggelam dan sulit keluar.', v: 1 }
      ]
    },
    {
      id: 'E7',
      section: 'pikir',
      dims: ['sadar', 'pikir'],
      prompt: 'Seberapa sering kamu bertanya "apa yang sebenarnya aku inginkan" sebelum mengambil keputusan penting?',
      options: [
        { text: 'Cukup sering; aku memeriksa motif dan nilai yang terlibat.', v: 5 },
        { text: 'Kadang, terutama saat keputusannya besar.', v: 4 },
        { text: 'Jarang; aku mengikuti apa yang diharapkan orang lain.', v: 2 },
        { text: 'Hampir tidak pernah; aku tidak yakin jawabannya.', v: 1 },
        { text: 'Aku bertanya, tetapi tetap memilih yang aman.', v: 2 }
      ]
    },
    {
      id: 'E8',
      section: 'pikir',
      dims: ['regulasi', 'pikir', 'resiliensi'],
      prompt: 'Ketika rencanamu berubah mendadak, apa respons pertamamu?',
      options: [
        { text: 'Menyesuaikan diri dan mencari langkah berikutnya.', v: 5 },
        { text: 'Kesal, tetapi bisa pulih cukup cepat.', v: 4 },
        { text: 'Merasa kacau dan butuh waktu lama.', v: 2 },
        { text: 'Menyalahkan diri atau orang lain.', v: 1 },
        { text: 'Membatalkan semuanya karena rencananya sudah rusak.', v: 1 }
      ]
    },

    /* F. Memperlakukan Orang Lain & Batas */
    {
      id: 'F1',
      section: 'relasi',
      dims: ['batas', 'komunikasi'],
      prompt: 'Ketika seseorang meminta bantuan yang sebenarnya memberatkanmu, apa yang biasanya kamu lakukan?',
      options: [
        { text: 'Menilai kapasitasku, lalu menjawab jujur.', v: 5 },
        { text: 'Membantu, tetapi menyampaikan batasku.', v: 4 },
        { text: 'Membantu meski kesal, lalu menyesal.', v: 2 },
        { text: 'Membantu tanpa bertanya apakah aku sanggup.', v: 1 },
        { text: 'Menghindari orang itu agar tidak diminta.', v: 1 }
      ]
    },
    {
      id: 'F2',
      section: 'relasi',
      dims: ['empati', 'batas'],
      prompt: 'Bagaimana kamu memperlakukan orang yang tidak bisa memberimu sesuatu?',
      options: [
        { text: 'Sama seperti orang lain; aku tidak menghitung untung rugi.', v: 5 },
        { text: 'Cukup baik, meski aku sadar ada perbedaan.', v: 4 },
        { text: 'Aku lebih menghargai orang yang berguna.', v: 2 },
        { text: 'Aku bisa mengabaikan mereka tanpa merasa bersalah.', v: 1 },
        { text: 'Aku merasa tidak nyaman dan menghindar.', v: 2 }
      ]
    },
    {
      id: 'F3',
      section: 'relasi',
      dims: ['batas', 'empati'],
      prompt: 'Saat kamu tahu seseorang menyimpan rahasia yang tidak berhubungan denganmu, apa yang kamu lakukan?',
      options: [
        { text: 'Menghormati ruangnya; aku tidak perlu tahu semuanya.', v: 5 },
        { text: 'Penasaran, tetapi aku menahan diri.', v: 4 },
        { text: 'Aku mencari petunjuk atau bertanya ke orang lain.', v: 2 },
        { text: 'Aku mendesaknya sampai dia memberi tahu.', v: 1 },
        { text: 'Aku menjauh karena tidak suka hal yang tidak jelas.', v: 2 }
      ]
    },
    {
      id: 'F4',
      section: 'relasi',
      dims: ['batas', 'komunikasi', 'regulasi'],
      prompt: 'Apa yang biasanya kamu lakukan ketika orang lain melanggar batasmu?',
      options: [
        { text: 'Menyebutkannya dengan jelas, sedini mungkin.', v: 5 },
        { text: 'Menyindir atau memberi tanda, berharap dia paham.', v: 3 },
        { text: 'Diam dan menjauh perlahan.', v: 2 },
        { text: 'Meledak setelah lama menahan.', v: 1 },
        { text: 'Aku merasa itu salahku karena tidak tegas.', v: 1 }
      ]
    },
    {
      id: 'F5',
      section: 'relasi',
      dims: ['batas', 'komunikasi'],
      prompt: 'Seberapa sering kamu menyetujui sesuatu hanya agar suasana tetap nyaman?',
      options: [
        { text: 'Jarang; aku bisa menolak tanpa merasa bersalah.', v: 5 },
        { text: 'Kadang, terutama dengan orang yang tidak dekat.', v: 4 },
        { text: 'Sering; konflik terasa lebih mahal daripada ketidaknyamananku.', v: 2 },
        { text: 'Hampir selalu; aku baru sadar setelahnya.', v: 1 },
        { text: 'Aku tidak pernah merasa punya pilihan lain.', v: 1 }
      ]
    },
    {
      id: 'F6',
      section: 'relasi',
      dims: ['batas', 'empati'],
      prompt: 'Ketika orang yang kamu sayangi membuat pilihan yang menurutmu salah, apa yang kamu lakukan?',
      options: [
        { text: 'Menyampaikan pandanganku sekali, lalu menghormati keputusannya.', v: 5 },
        { text: 'Memberi saran, tetapi tetap mendukung.', v: 4 },
        { text: 'Mengulang nasihat sampai dia mengikuti.', v: 2 },
        { text: 'Menarik dukungan agar dia berubah.', v: 1 },
        { text: 'Diam, lalu menyimpan kekecewaan.', v: 2 }
      ]
    },
    {
      id: 'F7',
      section: 'relasi',
      dims: ['sadar', 'komunikasi', 'empati'],
      prompt: 'Apa yang kamu lakukan setelah menyakiti seseorang tanpa sengaja?',
      options: [
        { text: 'Mengakui, mendengarkan dampaknya, dan memperbaiki.', v: 5 },
        { text: 'Meminta maaf, meski aku ingin menjelaskan dulu.', v: 4 },
        { text: 'Menjelaskan bahwa niatku baik, berharap itu cukup.', v: 2 },
        { text: 'Menunggu dia melupakan atau memaafkan sendiri.', v: 1 },
        { text: 'Aku menghindari pembicaraan karena malu.', v: 1 }
      ]
    },
    {
      id: 'F8',
      section: 'relasi',
      dims: ['batas', 'empati'],
      prompt: 'Seberapa nyaman kamu dekat dengan orang tanpa harus menyelesaikan masalahnya?',
      options: [
        { text: 'Nyaman; kedekatan tidak berarti aku harus memperbaiki semuanya.', v: 5 },
        { text: 'Cukup nyaman, meski aku ingin membantu.', v: 4 },
        { text: 'Aku merasa tidak berguna jika tidak bisa membantu.', v: 2 },
        { text: 'Aku mengambil alih masalahnya agar dia baik.', v: 1 },
        { text: 'Aku menjauh karena tidak tahan melihatnya sulit.', v: 1 }
      ]
    },

    /* G. Pola Bawah Sadar & Coping */
    {
      id: 'G1',
      section: 'bawah-sadar',
      dims: ['regulasi', 'resiliensi', 'sadar'],
      prompt: 'Saat stres meningkat, apa yang paling sering kamu lakukan tanpa sadar?',
      options: [
        { text: 'Aku menyadarinya dan memilih cara yang cukup sehat.', v: 5 },
        { text: 'Aku sibuk, olahraga, atau mengalihkan perhatian untuk sementara.', v: 4 },
        { text: 'Aku makan, belanja, atau scrolling lebih dari yang kubutuhkan.', v: 2 },
        { text: 'Aku menarik diri dan menghilang dari orang lain.', v: 2 },
        { text: 'Aku mengencang dan menyelesaikan semuanya sendiri.', v: 1 }
      ]
    },
    {
      id: 'G2',
      section: 'bawah-sadar',
      dims: ['sadar', 'resiliensi'],
      prompt: 'Ketika kamu merasa tidak cukup, apa yang biasanya kamu lakukan?',
      options: [
        { text: 'Memeriksa suara itu dan mengingatkan diri pada bukti yang nyata.', v: 5 },
        { text: 'Bekerja lebih keras untuk membuktikan bahwa aku mampu.', v: 3 },
        { text: 'Menyibukkan diri agar tidak mendengarnya.', v: 2 },
        { text: 'Menyalahkan diri dan menarik diri.', v: 1 },
        { text: 'Membandingkan diri dengan orang yang lebih berhasil.', v: 1 }
      ]
    },
    {
      id: 'G3',
      section: 'bawah-sadar',
      dims: ['batas', 'akar', 'resiliensi'],
      prompt: 'Apa yang paling kamu takutkan dalam hubungan dekat?',
      options: [
        { text: 'Aku bisa menghadapi ketakutan itu tanpa harus dikendalikan.', v: 5 },
        { text: 'Kehilangan, tetapi aku masih bisa membuka diri.', v: 4 },
        { text: 'Ditinggalkan atau dikhianati, sehingga aku waspada.', v: 2 },
        { text: 'Menjadi terlalu bergantung dan kehilangan diri.', v: 2 },
        { text: 'Aku tidak tahu; aku menghindari kedekatan sebelum itu terjadi.', v: 1 }
      ]
    },
    {
      id: 'G4',
      section: 'bawah-sadar',
      dims: ['resiliensi', 'sadar', 'batas'],
      prompt: 'Saat kamu sendirian terlalu lama, apa yang terjadi?',
      options: [
        { text: 'Aku bisa menikmatinya dan kembali ke orang lain dengan segar.', v: 5 },
        { text: 'Kadang kesepian, tetapi bisa kukelola.', v: 4 },
        { text: 'Aku mulai merasa tidak berharga atau tidak dibutuhkan.', v: 2 },
        { text: 'Aku mencari distraksi apa pun agar tidak merasa hampa.', v: 1 },
        { text: 'Aku merasa lega karena tidak harus menyesuaikan diri.', v: 2 }
      ]
    },
    {
      id: 'G5',
      section: 'bawah-sadar',
      dims: ['regulasi', 'komunikasi', 'sadar'],
      prompt: 'Apa yang biasanya kamu lakukan dengan kemarahan yang tidak bisa kamu ungkapkan?',
      options: [
        { text: 'Mengenali, memberi nama, dan menyalurkannya dengan cara yang tidak merusak.', v: 5 },
        { text: 'Menulis atau bergerak sampai reda.', v: 4 },
        { text: 'Menyimpannya sampai menjadi dingin dan jauh.', v: 2 },
        { text: 'Meledak pada orang yang salah.', v: 1 },
        { text: 'Mengalihkannya menjadi sarkasme atau sindiran.', v: 2 }
      ]
    },
    {
      id: 'G6',
      section: 'bawah-sadar',
      dims: ['resiliensi', 'akar', 'regulasi'],
      prompt: 'Seberapa sering kamu merasa harus "selalu siap" untuk hal buruk?',
      options: [
        { text: 'Jarang; aku bisa beristirahat dalam keadaan aman.', v: 5 },
        { text: 'Kadang, terutama saat hidup sedang tenang.', v: 4 },
        { text: 'Sering; ketenangan terasa seperti jebakan.', v: 2 },
        { text: 'Hampir selalu; aku tidak percaya pada hal baik tanpa syarat.', v: 1 },
        { text: 'Aku tidak pernah merasa aman, bahkan saat tidak ada masalah.', v: 1 }
      ]
    },
    {
      id: 'G7',
      section: 'bawah-sadar',
      dims: ['sadar', 'akar'],
      prompt: 'Ketika seseorang memuji kamu, apa reaksi pertamamu?',
      options: [
        { text: 'Menerimanya dan menganggapnya tulus.', v: 5 },
        { text: 'Berterima kasih, meski sedikit tidak nyaman.', v: 4 },
        { text: 'Merasa mereka sedang sopan atau punya maksud lain.', v: 2 },
        { text: 'Mengalihkan pujian atau merendahkan diri.', v: 2 },
        { text: 'Aku tidak percaya pada pujian.', v: 1 }
      ]
    },
    {
      id: 'G8',
      section: 'bawah-sadar',
      dims: ['sadar', 'resiliensi', 'pikir'],
      prompt: 'Apa yang kamu lakukan ketika kamu menyadari sedang mengulang pola yang sama?',
      options: [
        { text: 'Mencari bantuan, mencatat pemicu, dan mencoba langkah berbeda.', v: 5 },
        { text: 'Aku sadar, tetapi sering kembali ke pola lama.', v: 3 },
        { text: 'Aku menyalahkan diri karena sudah tahu tetapi tetap mengulang.', v: 2 },
        { text: 'Aku merasa pola itu adalah takdirku.', v: 1 },
        { text: 'Aku pura-pura tidak melihatnya.', v: 1 }
      ]
    },

    /* H. Nilai Hidup & Motivasi */
    {
      id: 'H1',
      section: 'nilai',
      dims: ['pikir', 'sadar', 'resiliensi'],
      prompt: 'Apa yang paling membuat hidupmu terasa berarti?',
      options: [
        { text: 'Hubungan yang jujur dan kontribusi yang selaras dengan nilainya.', v: 5 },
        { text: 'Rasa berguna bagi orang lain.', v: 3 },
        { text: 'Pencapaian dan pengakuan.', v: 2 },
        { text: 'Keamanan dan ketenangan.', v: 4 },
        { text: 'Aku belum menemukan jawabannya.', v: 1 }
      ]
    },
    {
      id: 'H2',
      section: 'nilai',
      dims: ['pikir', 'resiliensi'],
      prompt: 'Ketika harus memilih antara aman dan tumbuh, apa yang biasanya kamu pilih?',
      options: [
        { text: 'Tumbuh dengan risiko yang sudah kuhitung.', v: 5 },
        { text: 'Aman dulu, lalu tumbuh perlahan.', v: 4 },
        { text: 'Aman, karena risiko terasa terlalu besar.', v: 2 },
        { text: 'Aku menunggu sampai tidak ada pilihan lain.', v: 1 },
        { text: 'Aku memilih tumbuh, lalu panik dan berhenti.', v: 2 }
      ]
    },
    {
      id: 'H3',
      section: 'nilai',
      dims: ['sadar', 'pikir', 'batas'],
      prompt: 'Seberapa jelas kamu bisa menjelaskan nilai yang kamu pegang?',
      options: [
        { text: 'Cukup jelas; aku bisa menyebutkan dan memberi contohnya.', v: 5 },
        { text: 'Aku tahu rasanya, meski sulit menjelaskan.', v: 3 },
        { text: 'Aku mengikuti nilai keluarga tanpa banyak bertanya.', v: 2 },
        { text: 'Aku menyesuaikan nilai dengan situasi agar diterima.', v: 1 },
        { text: 'Aku tidak yakin punya nilai sendiri.', v: 1 }
      ]
    },
    {
      id: 'H4',
      section: 'nilai',
      dims: ['sadar', 'resiliensi'],
      prompt: 'Apa yang kamu lakukan ketika pencapaianmu tidak diakui?',
      options: [
        { text: 'Aku tetap bisa menghargai prosesnya sendiri.', v: 5 },
        { text: 'Kecewa, tetapi tidak lama.', v: 4 },
        { text: 'Aku bekerja lebih keras agar akhirnya diakui.', v: 2 },
        { text: 'Aku merasa usahaku tidak berarti.', v: 1 },
        { text: 'Aku menyalahkan orang yang tidak mengakui.', v: 2 }
      ]
    },
    {
      id: 'H5',
      section: 'nilai',
      dims: ['pikir', 'sadar', 'resiliensi'],
      prompt: 'Jika hidupmu berjalan sesuai rencana lima tahun ke depan, apa yang paling penting untukmu?',
      options: [
        { text: 'Menjadi lebih utuh, bukan hanya lebih sukses.', v: 5 },
        { text: 'Punya hubungan dan pekerjaan yang cukup stabil.', v: 4 },
        { text: 'Diakui dan dianggap berhasil oleh orang lain.', v: 2 },
        { text: 'Tidak mengulangi kesalahan orang tuaku.', v: 3 },
        { text: 'Aku tidak berani membayangkannya.', v: 1 }
      ]
    },

    /* I. Pengalaman yang Membentuk */
    {
      id: 'I1',
      section: 'pengalaman',
      dims: ['resiliensi', 'sadar'],
      prompt: 'Seberapa besar pengalaman sulit di masa lalu masih memengaruhi responsmu hari ini?',
      options: [
        { text: 'Aku sudah bisa memisahkan masa lalu dari pilihan saat ini.', v: 5 },
        { text: 'Masih terasa, tetapi aku punya cara untuk tidak dikendalikannya.', v: 4 },
        { text: 'Cukup besar; beberapa situasi masih memicu reaksi kuat.', v: 2 },
        { text: 'Sangat besar; aku sering bereaksi seperti sedang di masa lalu.', v: 1 },
        { text: 'Aku tidak tahu, karena aku tidak pernah menoleh ke belakang.', v: 2 }
      ]
    },
    {
      id: 'I2',
      section: 'pengalaman',
      dims: ['akar', 'batas', 'resiliensi'],
      prompt: 'Apakah ada pengalaman yang membuatmu sulit mempercayai orang?',
      options: [
        { text: 'Tidak ada yang dominan; aku bisa membangun kepercayaan.', v: 5 },
        { text: 'Ada luka, tetapi aku masih bisa membuka diri.', v: 4 },
        { text: 'Aku waspada hampir setiap saat.', v: 2 },
        { text: 'Aku lebih memilih tidak bergantung pada siapa pun.', v: 1 },
        { text: 'Aku tidak yakin; aku belum pernah mengujinya.', v: 2 }
      ]
    },
    {
      id: 'I3',
      section: 'pengalaman',
      dims: ['sadar', 'resiliensi'],
      prompt: 'Bagaimana kamu memahami hal yang paling menyakitkan dalam hidupmu?',
      options: [
        { text: 'Sebagai bagian dari cerita yang sudah kuolah, bukan identitasku.', v: 5 },
        { text: 'Aku masih mengolahnya, tetapi tidak lagi setiap hari.', v: 4 },
        { text: 'Aku belum bisa membicarakannya tanpa terbawa.', v: 2 },
        { text: 'Aku menyimpannya dan berpura-pura tidak ada.', v: 1 },
        { text: 'Aku merasa pengalaman itu menjelaskan mengapa aku rusak.', v: 1 }
      ]
    },
    {
      id: 'I4',
      section: 'pengalaman',
      dims: ['sadar', 'batas', 'resiliensi'],
      prompt: 'Apa yang kamu butuhkan untuk merasa lebih utuh saat ini?',
      options: [
        { text: 'Ruang untuk mengenal diri, dukungan yang tepat, dan waktu.', v: 5 },
        { text: 'Seseorang yang mau mendengar tanpa menghakimi.', v: 4 },
        { text: 'Bukti bahwa aku mampu berdiri sendiri.', v: 3 },
        { text: 'Pengakuan dari orang yang dulu tidak memberikannya.', v: 2 },
        { text: 'Aku tidak tahu; aku hanya ingin merasa tidak begini terus.', v: 1 }
      ]
    }
  ]
};
