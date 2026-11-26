/*
 * Mesin penilaian dan penyusun narasi.
 * Tidak menyentuh DOM. Bisa diuji terpisah dari antarmuka.
 */
(function (global) {
  'use strict';

  var DATA = global.DIRI_DATA;
  var DIM_KEYS = Object.keys(DATA.dimensions);
  var QUESTION_BY_ID = {};
  var SECTION_BY_ID = {};

  DATA.questions.forEach(function (question) {
    QUESTION_BY_ID[question.id] = question;
  });
  DATA.sections.forEach(function (section) {
    SECTION_BY_ID[section.id] = section;
  });

  /* ---------- Utilitas ---------- */

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value) {
    return Math.round(value);
  }

  function band(score) {
    if (score >= 70) return 'high';
    if (score >= 45) return 'mid';
    return 'low';
  }

  function bandLabel(score) {
    if (score >= 70) return 'Kuat';
    if (score >= 45) return 'Cukup berkembang';
    return 'Butuh perhatian';
  }

  function countWords(text) {
    return String(text).trim().split(/\s+/).filter(Boolean).length;
  }

  function answerValue(answers, id) {
    var question = QUESTION_BY_ID[id];
    var index = answers[id];
    if (!question || typeof index !== 'number' || !question.options[index]) return null;
    return question.options[index].v;
  }

  function isLow(answers, id) {
    var value = answerValue(answers, id);
    return value !== null && value <= 2;
  }

  function isHigh(answers, id) {
    var value = answerValue(answers, id);
    return value !== null && value >= 4;
  }

  /* ---------- Skor ---------- */

  function scoreQuestions(questions, answers) {
    var sum = 0;
    var count = 0;

    questions.forEach(function (question) {
      var index = answers[question.id];
      if (typeof index !== 'number' || !question.options[index]) return;
      sum += question.options[index].v;
      count += 1;
    });

    if (!count) return null;
    return round(((sum - count) / (count * 4)) * 100);
  }

  function computeScores(answers) {
    var dimensions = {};

    DIM_KEYS.forEach(function (key) {
      var questions = DATA.questions.filter(function (question) {
        return question.dims.indexOf(key) !== -1;
      });
      dimensions[key] = scoreQuestions(questions, answers);
    });

    var sections = {};
    DATA.sections.forEach(function (section) {
      var questions = DATA.questions.filter(function (question) {
        return question.section === section.id;
      });
      sections[section.id] = scoreQuestions(questions, answers);
    });

    return { dimensions: dimensions, sections: sections };
  }

  function computeSignals(answers) {
    return {
      rumahDingin: isLow(answers, 'A1') || isLow(answers, 'A5'),
      kritikKeras: isLow(answers, 'A2') || isLow(answers, 'A5'),
      emosiTidakAman: isLow(answers, 'A1') || isLow(answers, 'A4') || isLow(answers, 'A7'),
      kontrolKuat: isLow(answers, 'A3') || isLow(answers, 'A6'),
      rumahTakStabil: isLow(answers, 'A8') || isLow(answers, 'A10'),
      peranMenengahi: isLow(answers, 'A6') || isLow(answers, 'A10'),
      tekananBudaya: isLow(answers, 'B1') || isLow(answers, 'B3'),
      pernahDibully: isLow(answers, 'B4') || isLow(answers, 'B5'),
      kritikDiri: isLow(answers, 'D6') || isLow(answers, 'E5') || isLow(answers, 'G2') || isLow(answers, 'G7'),
      ruminasi: isLow(answers, 'C6') || isLow(answers, 'D10') || isLow(answers, 'E6'),
      menghindarKonflik: isLow(answers, 'C1') || isLow(answers, 'C4') || isLow(answers, 'C8') || isLow(answers, 'F4'),
      peoplePleasing: isLow(answers, 'C5') || isLow(answers, 'F1') || isLow(answers, 'F5') || isLow(answers, 'F8'),
      menyimpanSendiri: isLow(answers, 'D9') || isLow(answers, 'G1') || isLow(answers, 'G5'),
      waspada: isLow(answers, 'G6') || isLow(answers, 'I2'),
      lukaBelumOlah: isLow(answers, 'I1') || isLow(answers, 'I3'),
      tidakAmanSendiri: isLow(answers, 'G4'),
      pujianSulit: isLow(answers, 'G7'),
      nilaiKabur: isLow(answers, 'H1') || isLow(answers, 'H3'),
      arahHidup: isLow(answers, 'H2') || isLow(answers, 'H5')
    };
  }

  function isComplete(answers) {
    return DATA.questions.every(function (question) {
      var index = answers[question.id];
      return typeof index === 'number' && !!question.options[index];
    });
  }

  function answeredCount(answers) {
    return DATA.questions.filter(function (question) {
      var index = answers[question.id];
      return typeof index === 'number' && !!question.options[index];
    }).length;
  }

  /* ---------- Urutan opsi ---------- */

  function hashString(text) {
    var hash = 2166136261;
    for (var i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    return function () {
      var t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffledIndexes(length, seed) {
    var result = [];
    var random = mulberry32(seed);

    for (var i = 0; i < length; i += 1) result.push(i);

    for (var j = result.length - 1; j > 0; j -= 1) {
      var k = Math.floor(random() * (j + 1));
      var temp = result[j];
      result[j] = result[k];
      result[k] = temp;
    }

    return result;
  }

  function getOptionOrder(question, seed) {
    return shuffledIndexes(question.options.length, hashString(seed + ':' + question.id));
  }

  /* ---------- Bahan narasi ---------- */

  var DIM_OPEN = {
    akar: {
      high: 'Kamu membawa rasa dasar bahwa dunia, setidaknya sebagian, bisa diandalkan. Kedekatan tidak otomatis terasa seperti ancaman, dan kamu cukup percaya bahwa konflik bisa diperbaiki.',
      mid: 'Ada pengalaman aman yang cukup untuk menopangmu, tetapi juga momen ketika kamu belajar waspada. Rasa amanmu lebih sering datang dari bukti daripada dari keyakinan bawaan.',
      low: 'Kamu belajar lebih awal bahwa rasa aman bukan sesuatu yang otomatis. Kamu memindai suasana, menebak kebutuhan orang lain, dan bersiap sebelum hal buruk terjadi, karena itu dulu membantu.'
    },
    sadar: {
      high: 'Kamu cukup jujur melihat motif sendiri, termasuk bagian yang tidak ingin kamu akui. Kamu bisa berkata "aku sedang takut" tanpa harus langsung menyalahkan orang lain.',
      mid: 'Kamu bisa menamai perasaan besar, tetapi masih ada sudut yang kamu lewati. Kadang kamu baru memahami apa yang terjadi setelah reaksinya selesai.',
      low: 'Kamu lebih sering bergerak dari reaksi daripada dari pemahaman. Bukan karena kamu tidak mau melihat, tetapi karena isi kepalamu mungkin dulu tidak aman untuk diperiksa.'
    },
    regulasi: {
      high: 'Saat gelombang datang, kamu punya cara untuk tidak langsung hanyut. Kamu bisa merasakan tanpa harus segera bertindak, dan itu memberi orang di sekitarmu ruang untuk bernapas.',
      mid: 'Kamu bisa menahan diri, meski butuh waktu dan kondisi yang tepat. Di hari yang tenang kamu cukup lentur, tetapi di bawah tekanan cara lamamu bisa kembali.',
      low: 'Emosi besar sering datang lebih cepat daripada kemampuanmu untuk menampungnya. Responsmu mungkin meledak, membeku, atau menghilang, dan semuanya adalah cara bertahan, bukan bukti bahwa kamu lemah.'
    },
    empati: {
      high: 'Kamu membaca suasana dan kebutuhan orang lain hampir otomatis. Kamu tahu kapan seseorang sedang baik-baik saja dan kapan dia hanya tidak mau merepotkan.',
      mid: 'Kamu peduli, tetapi tidak selalu yakin harus berbuat apa. Kadang kamu menangkap sinyal dengan tepat, kadang kamu mengisinya dengan pengalamanmu sendiri.',
      low: 'Kamu bisa memahami sudut pandang orang lain, tetapi sering baru setelah situasinya selesai. Di saat penting, kata-kata dan kebutuhanmu sendiri lebih dulu mengambil ruang.'
    },
    komunikasi: {
      high: 'Kamu mampu mengatakan hal sulit tanpa harus menyerang atau menghilang. Kamu tahu bahwa jujur dan menjaga hubungan bukan dua hal yang saling meniadakan.',
      mid: 'Kamu punya momen jujur, tetapi masih memilih aman di banyak percakapan penting. Kamu sering menyampaikan sebagian, lalu berharap sisanya dipahami.',
      low: 'Kata-kata sulit cenderung kamu tunda, ubah, atau tahan sampai mengendap. Kamu mungkin sangat jelas di kepalamu, tetapi suaranya tidak selalu keluar saat dibutuhkan.'
    },
    pikir: {
      high: 'Kamu nyaman mempertanyakan keyakinan sendiri dan mengganti cara saat bukti berubah. Kamu tidak perlu merasa kecil untuk mengakui bahwa kamu belum tahu.',
      mid: 'Kamu terbuka pada sudut baru, meski butuh waktu untuk melepas cara lama. Kamu bisa berubah, tetapi biasanya setelah rasa aman atau bukti yang cukup.',
      low: 'Kamu cenderung mencari konfirmasi daripada informasi yang mengganggu kesimpulan. Menjaga keyakinan terasa seperti menjaga diri, sehingga bukti baru mudah dianggap serangan.'
    },
    batas: {
      high: 'Kamu bisa dekat tanpa kehilangan ruang sendiri. Kamu tahu bahwa mengatakan tidak bukan berarti menolak orangnya, dan kamu bisa menolak tanpa harus berperang.',
      mid: 'Kamu tahu batas itu perlu, tetapi sering baru menyadarinya setelah lewat. Kamu bisa tegas di beberapa area, lalu melebur di area lain.',
      low: 'Batasmu lebih sering ditentukan oleh rasa takut mengecewakan daripada pilihan sadar. Kamu mungkin baru menyadari bahwa kamu sudah terlalu jauh setelah tubuhmu lelah atau marah.'
    },
    resiliensi: {
      high: 'Kamu pulih dengan ritme yang cukup stabil setelah tekanan. Kamu tetap bisa berfungsi, tetapi tidak dengan harga kehilangan seluruh hidupmu.',
      mid: 'Kamu bertahan, meski pemulihanmu bergantung pada banyak hal di luar kendali. Kadang kamu bangkit cepat, kadang butuh waktu lebih lama dari yang kamu izinkan.',
      low: 'Di bawah tekanan, kamu cenderung bertahan dengan mengencang, bukan memulihkan. Kamu bisa terus berjalan, tetapi tubuh dan pikiranmu menyimpan utang yang menumpuk.'
    }
  };

  /*
   * Varian kedua dipakai ketika teks pembuka dimensi yang sama sudah muncul
   * di bagian lain. Tanpa ini, narasi bisa mengulang paragraf yang identik.
   */
  var DIM_ALT = {
    akar: {
      high: 'Rasa amanmu tidak dibangun dari janji bahwa semuanya akan baik, tetapi dari pengalaman bahwa hubungan bisa bertahan saat ada masalah.',
      mid: 'Kamu punya cukup pengalaman dekat untuk tidak selalu curiga, tetapi juga cukup pengalaman kecewa untuk tetap memeriksa.',
      low: 'Kedekatan sejak awal datang dengan syarat: kamu harus membaca dulu apakah aman. Kepekaan itu masih bekerja, bahkan ketika tidak lagi diperlukan.'
    },
    sadar: {
      high: 'Kamu bisa melihat reaksi sendiri dari jarak yang cukup dekat, tanpa langsung membela diri atau menghilang.',
      mid: 'Kesadaranmu muncul lebih kuat setelah gelombang lewat. Di tengah situasi, kamu masih sering mengikuti reaksi pertama.',
      low: 'Sebagian besar pikiranmu bergerak di bawah permukaan. Kamu baru mengenali perasaan setelah ia keluar sebagai tindakan atau kelelahan.'
    },
    regulasi: {
      high: 'Kamu punya jeda antara merasa dan bertindak, dan jeda itu cukup lebar untuk membuat pilihan yang tidak kamu sesali.',
      mid: 'Ketenanganmu cukup untuk hari biasa, tetapi belum tentu cukup saat tekanan datang dari beberapa arah sekaligus.',
      low: 'Saat tekanan naik, tubuhmu mengambil alih lebih dulu. Kata-kata menyusul kemudian, sering setelah situasinya selesai.'
    },
    empati: {
      high: 'Kamu menangkap perubahan kecil pada orang lain sebelum mereka menjelaskannya, dan itu membuatmu mudah dipercaya.',
      mid: 'Kamu peduli pada pengalaman orang lain, tetapi kadang memakai pengalamanmu sendiri sebagai petunjuk utama.',
      low: 'Empatimu lebih mudah muncul setelah kamu tenang. Saat terdesak, kebutuhanmu sendiri menutup ruang untuk membaca orang lain.'
    },
    komunikasi: {
      high: 'Kamu bisa menyampaikan hal yang tidak nyaman tanpa membuat percakapan berubah menjadi pertarungan.',
      mid: 'Kamu sering tahu apa yang ingin kamu katakan, tetapi memilih versi yang lebih aman agar hubungan tidak terganggu.',
      low: 'Hal-hal penting sering tertinggal di tengah jalan: kamu mulai bicara, lalu mengubah arah atau berhenti sebelum intinya keluar.'
    },
    pikir: {
      high: 'Kamu memperlakukan keyakinan sebagai hipotesis, bukan identitas, sehingga bukti baru tidak terasa seperti ancaman.',
      mid: 'Kamu bisa mengubah pikiran, tetapi biasanya setelah kamu merasa cukup aman untuk tidak terlihat goyah.',
      low: 'Kesimpulanmu cepat mengeras, dan bukti yang bertentangan lebih mudah dijelaskan sebagai pengecualian.'
    },
    batas: {
      high: 'Kamu bisa menjaga jarak yang perlu tanpa membuatnya terasa seperti hukuman bagi orang lain.',
      mid: 'Kamu menetapkan batas, lalu sering meninjau ulang karena rasa bersalah atau kasihan.',
      low: 'Kamu sering berkata ya sebelum sempat bertanya apakah kamu punya ruang untuk itu.'
    },
    resiliensi: {
      high: 'Setelah tekanan, kamu kembali ke ritme yang cukup cepat tanpa harus memaksa tubuhmu melewati batas.',
      mid: 'Pemulihanmu berjalan, tetapi sering bergantung pada cuti, dukungan, atau keadaan yang kebetulan membaik.',
      low: 'Kamu bisa bertahan lama, tetapi pemulihan sering ditunda sampai tubuhmu mengambil keputusan sendiri.'
    }
  };

  function openDim(key, value, used) {
    var level = band(value);
    var primary = DIM_OPEN[key][level];
    var alt = DIM_ALT[key] && DIM_ALT[key][level];

    if (used && used[primary]) {
      if (alt && !used[alt]) {
        used[alt] = true;
        return alt;
      }
      return '';
    }

    if (used) used[primary] = true;
    return primary;
  }

  var ARCHETYPES = {
    akar: {
      title: 'Yang Berakar',
      line: 'Kamu bergerak dari rasa aman yang cukup, dan itu membuatmu bisa dekat tanpa terus waspada.'
    },
    sadar: {
      title: 'Pengamat yang Jujur',
      line: 'Kamu cenderung ingin memahami sebelum bereaksi, dan itu memberimu ruang untuk memilih.'
    },
    regulasi: {
      title: 'Penjaga Ketenangan',
      line: 'Kamu bisa menampung gelombang tanpa harus segera menuruti dorongannya.'
    },
    empati: {
      title: 'Pembaca Ruang',
      line: 'Kamu membaca ruang dengan halus, dan orang sering merasa dilihat olehmu.'
    },
    komunikasi: {
      title: 'Jembatan Terbuka',
      line: 'Kamu bisa membuat hal sulit terasa bisa dibicarakan.'
    },
    pikir: {
      title: 'Pembongkar Pola',
      line: 'Kamu tidak cepat puas dengan penjelasan pertama, termasuk penjelasanmu sendiri.'
    },
    batas: {
      title: 'Penjaga Ambang',
      line: 'Kamu tahu kedekatan tidak seharusnya menghapus ruangmu.'
    },
    resiliensi: {
      title: 'Pemulih',
      line: 'Kamu punya kebiasaan bangkit, meski tidak selalu dengan cara yang terlihat heroik.'
    }
  };

  var TENSION = {
    'empati-batas': 'Kamu sangat mudah memahami kebutuhan orang lain, tetapi sulit membedakan mana yang tanggung jawabmu. Kedekatan bisa terasa seperti kewajiban untuk terus tersedia.',
    'komunikasi-batas': 'Kamu bisa menyuarakan banyak hal, tetapi sering menyerah pada batas sendiri agar percakapan tetap aman.',
    'sadar-regulasi': 'Kamu melihat pola sendiri dengan cukup jelas, tetapi belum selalu punya cara untuk menghentikannya saat sedang terjadi. Wawasanmu lebih cepat daripada tubuhmu.',
    'pikir-regulasi': 'Kamu bisa menganalisis pengalaman sampai detail, tetapi analisis itu kadang menjadi cara menunda perasaan yang belum selesai.',
    'akar-resiliensi': 'Kamu belajar bertahan lebih dulu sebelum merasa aman. Ketangguhanmu nyata, tetapi dibangun di atas kewaspadaan yang jarang benar-benar istirahat.',
    'akar-batas': 'Kamu terbiasa aman saat menyenangkan orang, sehingga batas bisa terasa seperti pengkhianatan.',
    'regulasi-empati': 'Kamu bisa tetap tenang, tetapi ketenangan itu kadang membuat orang lain merasa kamu jauh.',
    'komunikasi-empati': 'Kamu menangkap banyak hal tentang orang lain, tetapi menyimpannya sendiri sampai penuh.',
    'batas-empati': 'Kamu menjaga ruang dengan tegas, tetapi kadang lupa bahwa kelembutan bukan kehilangan batas.',
    'resiliensi-sadar': 'Kamu tahu apa yang seharusnya dilakukan, tetapi tubuh dan emosimu bergerak dengan tempo berbeda.',
    'sadar-batas': 'Kamu tahu batasmu secara intelektual, tetapi momen ketika harus mengucapkannya masih terasa berbahaya.',
    'pikir-batas': 'Kamu bisa menjelaskan pola dengan rapi, tetapi tetap sulit menolak saat seseorang membutuhkanmu.',
    'akar-sadar': 'Akar yang waspada membuatmu sangat peka pada perubahan, tetapi kadang kamu membaca ancaman yang belum tentu ada.',
    'komunikasi-pikir': 'Kamu bisa berbicara dengan jelas, tetapi keyakinanmu kadang lebih cepat mengeras daripada pemahamanmu.',
    'empati-resiliensi': 'Kamu menyerap banyak beban orang lain, sehingga pemulihanmu sering tertunda oleh kebutuhan mereka.',
    'regulasi-batas': 'Kamu bisa menahan reaksi, tetapi menahan bukan berarti batasmu sudah aman.'
  };

  function tension(topKey, lowKey) {
    return TENSION[topKey + '-' + lowKey] ||
      'Kekuatan terbesarmu ada di ' + DATA.dimensions[topKey].name + ', sementara ' + DATA.dimensions[lowKey].name + ' adalah tempat kamu paling sering kembali belajar. Kombinasi ini membuat profilmu terasa kontradiktif di beberapa momen, dan itu wajar.';
  }

  var SIGNAL_TEXT = {
    rumahDingin: 'Perasaan mungkin bukan bahasa utama di rumah. Kamu belajar bahwa yang penting adalah semuanya beres, bukan bagaimana rasanya.',
    kritikKeras: 'Kesalahan mungkin lebih sering dibahas daripada usaha. Akibatnya, suara pengkritik dari luar bisa berubah menjadi suara di dalam kepalamu.',
    emosiTidakAman: 'Marah, sedih, atau takut mungkin tidak selalu punya tempat yang aman. Kamu belajar menyimpan, menunda, atau mengubah bentuk perasaan agar tidak menimbulkan masalah.',
    kontrolKuat: 'Keputusan besar mungkin lebih sering ditentukan untukmu. Kamu bisa tumbuh sangat mampu, tetapi kesulitan tahu apa yang benar-benar kamu inginkan.',
    rumahTakStabil: 'Rumah mungkin terasa seperti cuaca yang berubah cepat. Kamu belajar memindai suasana sebelum masuk ruangan, dan kepekaan itu masih bekerja sekarang.',
    peranMenengahi: 'Kamu mungkin pernah menjadi anak yang tidak merepotkan, atau yang menenangkan orang dewasa. Pola itu sering bertahan menjadi kebiasaan mengurus suasana orang lain.',
    tekananBudaya: 'Pesan tentang menjaga harmoni, nama keluarga, atau "cara yang benar" kemungkinan masih bekerja di kepalamu. Kadang itu membantumu hidup, kadang itu membuatmu ragu pada suaramu sendiri.',
    pernahDibully: 'Pengalaman merasa berbeda atau pernah dipermalukan meninggalkan pelajaran tentang kapan kamu boleh terlihat. Kamu bisa menjadi sangat ahli menyesuaikan diri, tetapi juga cepat merasa terancam.',
    kritikDiri: 'Suara pengkritik internalmu mungkin lebih keras daripada suara orang lain. Kamu bisa menyebutnya standar tinggi, tetapi harganya adalah rasa lelah yang tidak pernah cukup.',
    ruminasi: 'Pikiranmu sering mengulang percakapan untuk mencari versi yang lebih aman. Yang kamu cari bukan jawaban, tetapi rasa kendali.',
    menghindarKonflik: 'Menghindari konflik mungkin menjaga kedamaian jangka pendek, tetapi memindahkan biayanya ke tubuh dan hubungan jangka panjang.',
    peoplePleasing: 'Kamu mungkin menyebutnya baik, tetapi sebagian dari kebaikan itu adalah strategi agar tidak ditinggalkan atau dikritik.',
    menyimpanSendiri: 'Kamu sangat mampu menanggung sendiri, tetapi kemampuan itu bisa menjadi tembok yang membuat orang lain tidak pernah tahu kapan kamu butuh bantuan.',
    waspada: 'Kamu mungkin sulit percaya pada periode tenang. Saat tidak ada masalah, kamu bisa mencari masalah agar tetap siap.',
    lukaBelumOlah: 'Ada bagian masa lalu yang masih bekerja sebagai alarm. Reaksimu hari ini bisa lebih besar dari situasinya karena yang merespons bukan hanya dirimu yang sekarang.',
    tidakAmanSendiri: 'Kesendirian mungkin cepat berubah menjadi pertanyaan tentang nilai dirimu. Kamu bisa mengisi waktu, tetapi tidak selalu bisa mengisi ruangnya.',
    pujianSulit: 'Pujian mungkin terasa seperti sesuatu yang harus dicurigai atau dibayar. Kamu bisa lebih mudah mempercayai kritik daripada penghargaan.',
    nilaiKabur: 'Nilai hidupmu mungkin masih lebih banyak diwarisi daripada dipilih. Kamu bisa mengikuti arah yang jelas tanpa yakin bahwa itu benar-benar arahmu.',
    arahHidup: 'Kamu mungkin lebih sering menunggu rasa pasti sebelum bergerak. Padahal arah sering terbentuk setelah langkah kecil, bukan sebelum langkah pertama.'
  };

  var PRACTICES = {
    akar: {
      title: 'Bangun bukti kecil bahwa kamu aman',
      why: 'Rasa aman tidak kembali lewat satu percakapan besar, tetapi lewat pengalaman kecil yang diulang.',
      steps: [
        'Pilih satu orang yang cukup aman, lalu ceritakan satu hal kecil yang sedang mengganggumu. Tidak perlu seluruh cerita.',
        'Setelah bercerita, perhatikan apa yang terjadi pada tubuhmu. Beri waktu, jangan langsung menilai.',
        'Lakukan sekali minggu ini. Kalau terlalu berat, mulai dengan menulisnya untuk dirimu sendiri.'
      ]
    },
    sadar: {
      title: 'Catat tiga baris sebelum bereaksi',
      why: 'Kesadaran tumbuh saat kamu punya jeda antara peristiwa dan respons.',
      steps: [
        'Tulis apa yang terjadi, apa yang kamu rasakan, dan apa yang kamu butuhkan. Masing-masing satu baris.',
        'Lakukan saat kamu merasa terganggu, bukan hanya saat sedang tenang.',
        'Setelah seminggu, baca ulang dan cari satu pola yang berulang.'
      ]
    },
    regulasi: {
      title: 'Latih jeda 90 detik',
      why: 'Gelombang emosi biasanya memuncak lalu turun. Kamu tidak perlu memutuskan apa pun di puncaknya.',
      steps: [
        'Saat dorongan muncul, berhenti sejenak dan beri nama perasaannya.',
        'Tarik napas lebih panjang daripada embusan, selama sekitar satu menit.',
        'Baru setelah itu pilih respons. Kalau belum bisa, tunda percakapan 20 menit.'
      ]
    },
    empati: {
      title: 'Tanya sebelum menebak',
      why: 'Empati yang akurat dibangun dengan rasa ingin tahu, bukan dengan keyakinan bahwa kamu sudah tahu.',
      steps: [
        'Saat seseorang bercerita, tahan keinginan untuk langsung memberi solusi.',
        'Tanyakan satu pertanyaan terbuka: "Apa yang paling kamu butuhkan sekarang?"',
        'Dengarkan jawabannya tanpa mengoreksi atau membandingkan dengan pengalamanmu.'
      ]
    },
    komunikasi: {
      title: 'Satu kalimat jujur, tanpa pidato',
      why: 'Komunikasi asertif tidak berarti mengatakan semuanya sekaligus. Satu kalimat yang jelas sudah cukup untuk memulai.',
      steps: [
        'Gunakan pola: "Saat X terjadi, aku merasa Y, dan aku butuh Z."',
        'Sampaikan satu hal saja, bukan daftar keluhan yang sudah menumpuk.',
        'Beri ruang bagi orang lain untuk merespons, termasuk ruang untuk tidak setuju.'
      ]
    },
    pikir: {
      title: 'Cari satu bukti yang membantah',
      why: 'Pola pikir lentur dilatih dengan memperlakukan kesimpulan sebagai hipotesis, bukan identitas.',
      steps: [
        'Tulis satu keyakinan yang sedang kuat, misalnya "aku selalu gagal".',
        'Cari satu bukti nyata yang tidak cocok dengan keyakinan itu.',
        'Tulis versi yang lebih akurat, bukan versi yang lebih positif. Akurat lebih menenangkan daripada optimis palsu.'
      ]
    },
    batas: {
      title: 'Satu "tidak" kecil setiap minggu',
      why: 'Batas tumbuh lewat latihan berskala kecil, bukan lewat satu percakapan heroik.',
      steps: [
        'Pilih satu permintaan kecil yang sebenarnya memberatkanmu.',
        'Jawab dengan kalimat pendek: "Aku tidak bisa minggu ini." Tidak perlu penjelasan panjang.',
        'Perhatikan bahwa dunia biasanya tidak berakhir. Catat apa yang kamu rasakan setelahnya.'
      ]
    },
    resiliensi: {
      title: 'Rancang pemulihan 24 jam',
      why: 'Ketahanan bukan hanya kemampuan bertahan, tetapi kemampuan kembali ke ritme setelah tekanan.',
      steps: [
        'Setelah hari yang berat, pilih satu hal kecil yang membantu tubuhmu merasa aman: tidur cukup, makan, jalan, atau mandi air hangat.',
        'Kurangi satu tuntutan yang bisa ditunda pada hari itu.',
        'Besoknya, tanyakan: apa yang perlu kukembalikan, dan apa yang boleh kulepaskan?'
      ]
    }
  };

  var SIGNAL_PRACTICES = {
    peoplePleasing: {
      title: 'Tunda jawaban "iya" selama 10 menit',
      why: 'Kebiasaan menyetujui sering berjalan lebih cepat daripada kesadaran. Jeda kecil memutus otomatisasinya.',
      steps: [
        'Saat diminta sesuatu, jawab: "Aku cek dulu, nanti kukabari."',
        'Tunggu sepuluh menit, lalu tanyakan apakah kamu benar-benar punya kapasitas.',
        'Kalau tidak, gunakan satu kalimat penolakan yang pendek dan sopan.'
      ]
    },
    kritikDiri: {
      title: 'Ganti label dengan perilaku',
      why: 'Kritik diri terasa seperti standar, tetapi sering hanya mengulang label lama yang tidak memberi langkah baru.',
      steps: [
        'Saat kamu berkata "aku bodoh" atau "aku selalu salah", tulis kalimat itu.',
        'Ubah menjadi perilaku yang spesifik: "Aku belum punya cara untuk ini."',
        'Tulis satu langkah kecil yang bisa dilakukan hari ini.'
      ]
    },
    ruminasi: {
      title: 'Beri ruang cemas, lalu tutup',
      why: 'Menekan pikiran biasanya membuatnya lebih kuat. Memberi jadwal membuatnya tidak menguasai seluruh hari.',
      steps: [
        'Sisihkan 15 menit untuk menulis semua kekhawatiran dan skenario.',
        'Setelah waktu habis, tutup catatan dan lakukan aktivitas fisik singkat.',
        'Kalau pikiran kembali, ingatkan: "Sudah kucatat, kita bahas lagi besok."'
      ]
    },
    menghindarKonflik: {
      title: 'Buka satu percakapan yang tertunda',
      why: 'Konflik yang dihindari tidak hilang. Ia hanya berpindah ke jarak, sindiran, atau kelelahan.',
      steps: [
        'Pilih satu masalah yang cukup kecil dan cukup penting.',
        'Minta waktu 10 menit, lalu sampaikan satu hal saja tanpa menyalahkan.',
        'Tujuan latihan ini bukan menang, tetapi berlatih tetap hadir saat tidak nyaman.'
      ]
    },
    waspada: {
      title: 'Latih mengenali keadaan aman',
      why: 'Tubuh yang terbiasa waspada perlu bukti berulang bahwa tidak setiap jeda adalah ancaman.',
      steps: [
        'Saat tidak ada masalah, berhenti sejenak dan perhatikan lima hal nyata di sekitarmu.',
        'Catat satu bukti bahwa saat ini tidak ada bahaya yang sedang terjadi.',
        'Lakukan sebelum tidur selama seminggu, terutama saat hari terasa terlalu tenang.'
      ]
    },
    lukaBelumOlah: {
      title: 'Cari dukungan yang tepat, bukan jawaban instan',
      why: 'Sebagian pengalaman tidak selesai hanya dengan berpikir lebih keras. Ia butuh ruang yang aman dan waktu.',
      steps: [
        'Tulis satu pengalaman yang masih membuat tubuhmu bereaksi.',
        'Tentukan apakah kamu butuh teman yang mendengar, atau bantuan profesional.',
        'Kalau memilih profesional, cari satu langkah konkret hari ini: bertanya, mencari nama, atau membuat janji.'
      ]
    },
    menyimpanSendiri: {
      title: 'Minta bantuan sebelum krisis',
      why: 'Meminta bantuan saat sudah habis tenaga jauh lebih sulit daripada meminta saat masih punya ruang.',
      steps: [
        'Pilih satu orang dan satu kebutuhan yang spesifik, bukan "aku butuh bantuan" secara umum.',
        'Kirim pesan singkat: "Aku sedang berat di bagian ini. Boleh aku cerita?"',
        'Latih menerima bantuan tanpa langsung membalasnya dengan sesuatu.'
      ]
    }
  };

  /* ---------- Penyusun narasi ---------- */

  function sortedDimensions(scores) {
    return DIM_KEYS.map(function (key) {
      return { key: key, value: scores.dimensions[key], meta: DATA.dimensions[key] };
    }).sort(function (a, b) {
      return b.value - a.value;
    });
  }

  function pickPattern(signals) {
    if (signals.peoplePleasing) return 'Menjaga kedamaian dengan mengorbankan ruang sendiri';
    if (signals.menghindarKonflik) return 'Menunda percakapan sulit sampai biayanya menumpuk';
    if (signals.kritikDiri) return 'Mengubah standar tinggi menjadi kritik yang tidak selesai';
    if (signals.ruminasi) return 'Mengulang skenario untuk mencari rasa aman';
    if (signals.waspada) return 'Tetap waspada bahkan saat tidak ada ancaman';
    if (signals.menyimpanSendiri) return 'Menanggung sendiri agar tidak merepotkan';
    if (signals.lukaBelumOlah) return 'Merespons situasi sekarang dengan alarm masa lalu';
    return 'Menjaga keseimbangan antara kebutuhan sendiri dan orang lain';
  }

  function pickSignals(signals, keys, limit, used) {
    var result = [];
    keys.forEach(function (key) {
      if (signals[key] && result.length < limit && !(used && used[key])) result.push(key);
    });
    if (used) {
      result.forEach(function (key) { used[key] = true; });
    }
    return result;
  }

  function buildSectionOne(sorted, signals, usedOpen) {
    var top = sorted[0];
    var second = sorted[1];
    var low = sorted[sorted.length - 1];
    var low2 = sorted[sorted.length - 2];
    var average = sorted.reduce(function (sum, item) { return sum + item.value; }, 0) / sorted.length;
    var paragraphs = [];

    paragraphs.push(
      'Kamu paling sering bergerak dari ' + top.meta.name.toLowerCase() + '. ' +
      openDim(top.key, top.value, usedOpen)
    );

    paragraphs.push(
      openDim(second.key, second.value, usedOpen) + ' ' +
      tension(top.key, low.key)
    );

    var overall;
    if (average >= 70) {
      overall = 'Secara keseluruhan, delapan dimensimu berada di sisi yang cukup menopang. Ini bukan berarti tidak ada luka, tetapi kamu punya cukup alat untuk tidak dikendalikan sepenuhnya oleh luka itu.';
    } else if (average >= 50) {
      overall = 'Secara keseluruhan, profilmu berada di tengah: ada kekuatan yang jelas, ada juga lapisan yang belum selesai. Kamu bukan orang yang tinggi di semua hal, dan itu justru membuat peta ini berguna.';
    } else {
      overall = 'Secara keseluruhan, banyak dimensimu masih berada di sisi yang waspada. Itu bukan vonis tentang siapa kamu. Itu petunjuk tentang seberapa banyak energi yang selama ini kamu pakai untuk bertahan.';
    }

    paragraphs.push(
      overall + ' ' +
      'Kekuatan relatif terbesarmu ada di ' + top.meta.name + ', sementara ' + low.meta.name +
      ' dan ' + low2.meta.name + ' adalah dua lapisan yang paling sering meminta perhatian.'
    );

    paragraphs.push(
      'Penting untuk diingat: skor ini adalah potret jawabanmu hari ini, bukan norma populasi dan bukan takdir. ' +
      'Yang kamu sebut "diri" bukan hasil akhir dari masa lalu, melainkan pola yang terus kamu ulangi atau ubah sedikit demi sedikit.'
    );

    return paragraphs;
  }

  function buildSectionTwo(scores, signals, usedOpen, usedSignals) {
    var akar = scores.dimensions.akar;
    var lingkungan = scores.sections.lingkungan;
    var pengalaman = scores.sections.pengalaman;
    var paragraphs = [];

    paragraphs.push(openDim('akar', akar, usedOpen));

    var familySignals = pickSignals(signals, [
      'emosiTidakAman', 'kritikKeras', 'kontrolKuat', 'rumahTakStabil', 'peranMenengahi', 'rumahDingin'
    ], 2, usedSignals);

    if (familySignals.length) {
      paragraphs.push(
        familySignals.map(function (key) { return SIGNAL_TEXT[key]; }).join(' ') +
        ' Pola ini tidak muncul untuk menyalahkan orang tua. Ia muncul karena kamu perlu tahu dari mana kebiasaanmu berasal, agar tidak lagi terasa seperti kepribadian yang tidak bisa diubah.'
      );
    } else {
      paragraphs.push(
        'Yang menonjol bukan satu peristiwa besar, melainkan cara hal-hal kecil diulang: siapa yang didengar, siapa yang harus mengalah, dan bagaimana kesalahan diperlakukan. ' +
        'Akar yang cukup aman tidak berarti masa kecil yang sempurna. Ia berarti kamu punya cukup pengalaman bahwa hubungan bisa diperbaiki.'
      );
    }

    if (lingkungan >= 70) {
      paragraphs.push(
        'Lingkungan tumbuhmu memberi kamu rasa memiliki yang cukup. Kamu punya pengalaman diterima, dan itu menjadi bukti bahwa kamu bisa menjadi bagian tanpa harus menghilangkan diri. ' +
        'Sekarang, saat kamu merasa berbeda, kamu punya pengalaman lama yang bisa dipakai untuk mengingatkan bahwa perbedaan tidak selalu berakhir dengan penolakan.'
      );
    } else if (lingkungan >= 45) {
      paragraphs.push(
        'Kamu tumbuh di antara dua tuntutan: menjadi diri sendiri dan tetap diterima. Kamu belajar membaca kapan bisa terbuka dan kapan harus menyesuaikan. ' +
        'Kemampuan itu berguna, tetapi juga membuatmu sering mendahulukan keselamatan sosial daripada kejujuran.'
      );
    } else {
      paragraphs.push(
        'Lingkunganmu lebih banyak menuntut penyesuaian daripada memberi ruang. Kamu belajar bahwa perbedaan bisa berbahaya, dan kepekaanmu pada suasana adalah hasil latihan panjang. ' +
        'Yang dulu menyelamatkanmu sekarang bisa membuatmu terlalu cepat menyerah pada kebutuhan sendiri.'
      );
    }

    if (signals.tekananBudaya || signals.pernahDibully) {
      paragraphs.push(
        [signals.tekananBudaya ? SIGNAL_TEXT.tekananBudaya : '', signals.pernahDibully ? SIGNAL_TEXT.pernahDibully : '']
          .filter(Boolean).join(' ')
      );
    }

    if (pengalaman >= 70) {
      paragraphs.push(
        'Bagian pengalaman yang menyakitkan tampaknya sudah cukup kamu olah. Kamu masih bisa tersentuh olehnya, tetapi tidak lagi hidup di dalamnya setiap hari. ' +
        'Itu bukan berarti semuanya selesai, hanya berarti kamu punya lebih banyak pilihan daripada reaksi lamamu.'
      );
    } else if (pengalaman >= 45) {
      paragraphs.push(
        'Ada pengalaman yang masih kamu bawa, meski tidak selalu terlihat. Kamu mungkin sudah punya cara untuk melanjutkan hidup, tetapi beberapa pemicu masih membuat reaksi lama muncul. ' +
        'Reaksi itu bukan kemunduran. Ia sering muncul justru karena kamu sekarang cukup aman untuk merasakannya.'
      );
    } else {
      paragraphs.push(
        'Beberapa pengalaman tampaknya masih sangat dekat dengan permukaan. Ini bukan berarti kamu rapuh. Ini berarti ada bagian dari dirimu yang belum pernah mendapat ruang untuk selesai. ' +
        'Kalau bagian ini terasa berat, mencari bantuan profesional bukan tanda gagal, melainkan cara memberi ruang yang lebih layak untuknya.'
      );
    }

    return paragraphs;
  }

  function buildSectionThree(scores, signals, usedOpen, usedSignals) {
    var komunikasi = scores.dimensions.komunikasi;
    var empati = scores.dimensions.empati;
    var batas = scores.dimensions.batas;
    var relasi = scores.sections.relasi;
    var paragraphs = [];

    paragraphs.push(openDim('komunikasi', komunikasi, usedOpen) + ' ' + openDim('empati', empati, usedOpen));

    paragraphs.push(
      openDim('batas', batas, usedOpen) + ' ' +
      (batas < 50 && empati >= 60
        ? 'Kombinasi ini sering terlihat seperti orang yang "terlalu baik": cepat memahami, cepat membantu, tetapi lambat menyadari bahwa dirinya juga sedang membutuhkan sesuatu.'
        : 'Dalam hubungan, batas dan empati bekerja bersama. Tanpa batas, empati berubah menjadi tanggung jawab yang tidak pernah selesai. Tanpa empati, batas berubah menjadi tembok.')
    );

    var relationSignals = pickSignals(signals, ['peoplePleasing', 'menghindarKonflik', 'menyimpanSendiri', 'ruminasi'], 2, usedSignals);
    if (relationSignals.length) {
      paragraphs.push(
        relationSignals.map(function (key) { return SIGNAL_TEXT[key]; }).join(' ') +
        ' Di permukaan, strategi ini terlihat seperti menjaga hubungan. Di bawahnya, ada kebutuhan untuk merasa aman yang belum pernah benar-benar diucapkan.'
      );
    }

    if (relasi >= 70) {
      paragraphs.push(
        'Cara kamu memperlakukan orang lain cukup adil. Kamu bisa memberi tanpa menghitung, tetapi juga tidak menuntut orang lain mengisi kekosonganmu. ' +
        'Kamu cenderung membiarkan orang lain menjadi dirinya sendiri, dan itu jarang kamu sadari sebagai bentuk cinta yang besar.'
      );
    } else if (relasi >= 45) {
      paragraphs.push(
        'Kamu memberi dengan tulus, tetapi kadang berharap imbalan yang tidak pernah kamu sebutkan. Ketika harapan itu tidak terpenuhi, kekecewaanmu bisa terasa tidak proporsional bagi orang lain. ' +
        'Menyebutkan kebutuhan lebih awal akan menghemat banyak jarak yang tidak perlu.'
      );
    } else {
      paragraphs.push(
        'Kamu bisa sangat perhatian, tetapi perhatian itu kadang menjadi cara menjaga orang tetap dekat, bukan pilihan yang bebas. ' +
        'Kamu mungkin sulit membedakan antara "aku ingin" dan "aku takut kehilangan". Perbedaan itu kecil di kepala, tetapi besar di hubungan.'
      );
    }

    return paragraphs;
  }

  function buildSectionFour(sorted, usedOpen) {
    var eiKeys = ['sadar', 'regulasi', 'empati', 'komunikasi'];
    var eiDims = sorted.filter(function (item) { return eiKeys.indexOf(item.key) !== -1; });
    var strongest = eiDims[0];
    var second = eiDims[1];
    var weakest = eiDims[eiDims.length - 1];
    var paragraphs = [];

    var strongestText = openDim(strongest.key, strongest.value, usedOpen);
    var secondText = openDim(second.key, second.value, usedOpen);
    var strengthParts = [
      'Kekuatan kecerdasan emosionalmu paling terlihat di ' + strongest.meta.name.toLowerCase() + '.'
    ];

    if (strongestText) strengthParts.push(strongestText);
    if (secondText) strengthParts.push(secondText);

    paragraphs.push(strengthParts.join(' '));

    paragraphs.push(
      'Kecerdasan emosional bukan tentang selalu tenang atau selalu baik. Ia tentang dua hal yang lebih membosankan: akurasi dan pilihan. ' +
      'Akurasi berarti kamu bisa membedakan apa yang benar-benar terjadi dari apa yang kamu takutkan. Pilihan berarti kamu punya ruang untuk tidak menuruti dorongan pertama.'
    );

    if (weakest.value < 50) {
      paragraphs.push(
        'Bagian yang paling perlu dilatih adalah ' + weakest.meta.name.toLowerCase() + '. ' +
        'Bukan karena kamu tidak peduli, tetapi karena keterampilan ini paling sering terlewat saat kamu sedang sibuk bertahan. ' +
        'Ini bukan kekurangan tetap. Keterampilan emosional bisa dilatih, terutama lewat latihan kecil yang diulang dalam situasi nyata.'
      );
    } else {
      paragraphs.push(
        'Yang menarik, tidak ada satu bagian yang sangat tertinggal. Kekuatanmu cukup merata, dan itu berarti tantanganmu bukan menambal satu lubang besar, melainkan menjaga konsistensi saat tekanan datang. ' +
        'Di saat tenang kamu cukup lentur. Pertanyaannya adalah apakah lentur itu tetap ada ketika kamu lelah, takut, atau merasa tidak didengar.'
      );
    }

    return paragraphs;
  }

  function buildSectionFive(sorted, signals, usedOpen, usedSignals) {
    var low = sorted[sorted.length - 1];
    var low2 = sorted[sorted.length - 2];
    var paragraphs = [];

    var lowText = openDim(low.key, low.value, usedOpen);
    paragraphs.push(
      'Blind spot paling jelas ada di ' + low.meta.name.toLowerCase() + '. ' +
      (lowText ? lowText + ' ' : '') +
      'Yang membuatnya menjadi blind spot bukan ketidaktahuan, melainkan kebiasaan. Kamu mungkin sudah tahu secara umum, tetapi belum melihatnya saat sedang terjadi.'
    );

    var low2Text = openDim(low2.key, low2.value, usedOpen);
    paragraphs.push(
      'Lapisan berikutnya adalah ' + low2.meta.name.toLowerCase() + '. ' +
      (low2Text ? low2Text + ' ' : '') +
      'Dua dimensi terendah ini sering saling menutupi: yang satu membuatmu sibuk, yang lain membuatmu ragu untuk memeriksanya.'
    );

    var blindSignals = pickSignals(signals, [
      'kritikDiri', 'ruminasi', 'peoplePleasing', 'menghindarKonflik', 'waspada', 'lukaBelumOlah', 'menyimpanSendiri', 'pujianSulit'
    ], 2, usedSignals);

    if (blindSignals.length) {
      paragraphs.push(
        blindSignals.map(function (key) { return SIGNAL_TEXT[key]; }).join(' ') +
        ' Pola-pola ini tidak sepenuhnya salah. Mereka dulu membantu kamu melewati sesuatu. Masalahnya, mereka sekarang berjalan tanpa izin, bahkan saat situasinya sudah berbeda.'
      );
    } else {
      paragraphs.push(
        'Tidak ada satu pola bawah sadar yang sangat menonjol dalam jawabanmu. Itu kabar baik, tetapi bukan berarti tidak ada pola. ' +
        'Pola yang paling sulit dilihat biasanya yang paling diterima oleh lingkunganmu, karena ia terasa seperti "memang begitu seharusnya".'
      );
    }

    var price;
    if (low.key === 'batas') {
      price = 'Harga yang paling sering kamu bayar adalah kelelahan yang tidak terlihat: kamu masih hadir, masih membantu, tetapi semakin jauh dari kebutuhanmu sendiri.';
    } else if (low.key === 'regulasi') {
      price = 'Harga yang paling sering kamu bayar adalah kepercayaan pada diri sendiri. Setelah reaksi besar, kamu mungkin merasa malu dan berjanji tidak mengulanginya, tanpa punya alat yang cukup untuk melakukannya.';
    } else if (low.key === 'komunikasi') {
      price = 'Harga yang paling sering kamu bayar adalah jarak. Orang lain tidak tahu apa yang kamu butuhkan, bukan karena mereka tidak peduli, tetapi karena kamu belum pernah memberinya kesempatan untuk tahu.';
    } else if (low.key === 'resiliensi') {
      price = 'Harga yang paling sering kamu bayar adalah tubuhmu. Kamu bisa terus terlihat kuat, tetapi pemulihan yang ditunda akan menagih dalam bentuk tidur, energi, atau rasa hampa.';
    } else if (low.key === 'pikir') {
      price = 'Harga yang paling sering kamu bayar adalah kesempatan untuk berubah. Kamu bisa sangat yakin pada satu cara, lalu melewatkan bukti bahwa cara lain mungkin lebih baik.';
    } else if (low.key === 'sadar') {
      price = 'Harga yang paling sering kamu bayar adalah pengulangan. Kamu bisa mengalami hal yang sama berkali-kali tanpa melihat bahwa yang berubah hanya tokohnya, bukan polanya.';
    } else {
      price = 'Harga yang paling sering kamu bayar adalah energi yang habis untuk menjaga sesuatu yang sebenarnya bisa dibicarakan.';
    }

    paragraphs.push(
      'Blind spot bukan kelemahan moral. Ia adalah bagian yang dulu tidak aman untuk dilihat, sehingga sekarang berjalan otomatis. ' +
      price + ' ' +
      'Kamu tidak perlu membongkarnya sekaligus. Cukup mulai dari satu momen ketika pola itu muncul, lalu beri nama tanpa langsung menghakimi diri.'
    );

    return paragraphs;
  }

  function buildPractices(sorted, signals) {
    var chosen = [];
    var used = {};

    function addPractice(key) {
      if (!key || used[key] || chosen.length >= 4) return;
      var practice = PRACTICES[key];
      if (!practice) return;
      used[key] = true;
      chosen.push(practice);
    }

    addPractice(sorted[sorted.length - 1].key);
    addPractice(sorted[sorted.length - 2].key);

    var signalPriority = [
      'peoplePleasing', 'kritikDiri', 'ruminasi', 'menghindarKonflik', 'waspada', 'lukaBelumOlah', 'menyimpanSendiri'
    ];

    signalPriority.some(function (key) {
      if (!signals[key] || chosen.length >= 4) return false;
      var practice = SIGNAL_PRACTICES[key];
      if (!practice || used['signal-' + key]) return false;
      used['signal-' + key] = true;
      chosen.push(practice);
      return chosen.length >= 4;
    });

    for (var i = sorted.length - 1; i >= 0 && chosen.length < 4; i -= 1) {
      addPractice(sorted[i].key);
    }

    return chosen.slice(0, 4);
  }

  function buildNarrative(scores, signals) {
    var sorted = sortedDimensions(scores);
    var top = sorted[0];
    var low = sorted[sorted.length - 1];
    var archetype = ARCHETYPES[top.key];
    var average = sorted.reduce(function (sum, item) { return sum + item.value; }, 0) / sorted.length;
    var usedOpen = {};
    var usedSignals = {};

    var sections = [
      {
        id: 'sekarang',
        kicker: '01',
        title: 'Siapa kamu sekarang',
        paragraphs: buildSectionOne(sorted, signals, usedOpen)
      },
      {
        id: 'akar',
        kicker: '02',
        title: 'Akar yang membentukmu',
        paragraphs: buildSectionTwo(scores, signals, usedOpen, usedSignals)
      },
      {
        id: 'komunikasi',
        kicker: '03',
        title: 'Cara kamu berkomunikasi dan menjaga relasi',
        paragraphs: buildSectionThree(scores, signals, usedOpen, usedSignals)
      },
      {
        id: 'ei',
        kicker: '04',
        title: 'Kekuatan kecerdasan emosionalmu',
        paragraphs: buildSectionFour(sorted, usedOpen)
      },
      {
        id: 'blind-spot',
        kicker: '05',
        title: 'Blind spot dan pola bawah sadar',
        paragraphs: buildSectionFive(sorted, signals, usedOpen, usedSignals)
      },
      {
        id: 'langkah',
        kicker: '06',
        title: 'Langkah yang bisa kamu coba',
        paragraphs: [
          'Saran di bawah ini tidak dibuat untuk mengubah seluruh dirimu dalam seminggu. Ia dibuat untuk memberi satu pengalaman berbeda yang cukup kecil untuk dimulai dan cukup nyata untuk diingat. ' +
          'Pilih satu, bukan empat. Kamu bisa kembali ke yang lain setelah yang pertama terasa lebih ringan.'
        ]
      }
    ];

    var practices = buildPractices(sorted, signals);
    var wordCount = sections.reduce(function (total, section) {
      return total + section.paragraphs.reduce(function (sum, paragraph) {
        return sum + countWords(paragraph);
      }, 0);
    }, 0);

    return {
      archetype: {
        title: archetype.title,
        line: archetype.line,
        summary: 'Kekuatan relatif terbesarmu ada di ' + top.meta.name + '. Titik yang paling sering menguras energimu adalah ' + low.meta.name + '. Profilmu bergerak di antara keduanya, bukan di salah satunya saja.',
        strength: top,
        friction: low,
        average: round(average)
      },
      narrative: sections,
      practices: practices,
      pattern: pickPattern(signals),
      wordCount: wordCount
    };
  }

  function buildResult(answers) {
    var scores = computeScores(answers);
    var signals = computeSignals(answers);
    var narrative = buildNarrative(scores, signals);
    var sorted = sortedDimensions(scores);

    return {
      scores: scores,
      signals: signals,
      sorted: sorted,
      archetype: narrative.archetype,
      narrative: narrative.narrative,
      practices: narrative.practices,
      pattern: narrative.pattern,
      wordCount: narrative.wordCount,
      answered: answeredCount(answers),
      total: DATA.questions.length,
      generatedAt: new Date().toISOString()
    };
  }

  function buildPlainText(result, dateLabel) {
    var lines = [];
    var scoreLabels = {};

    DATA.dimensions && Object.keys(DATA.dimensions).forEach(function (key) {
      scoreLabels[key] = DATA.dimensions[key].name;
    });

    lines.push('DIRI INSIGHT');
    lines.push('Peta diri, bukan label.');
    lines.push('');
    lines.push('Tanggal: ' + (dateLabel || new Date().toLocaleDateString('id-ID')));
    lines.push('Profil: ' + result.archetype.title);
    lines.push(result.archetype.line);
    lines.push('');
    lines.push('Skor per dimensi (0-100, relatif terhadap jawabanmu):');
    result.sorted.forEach(function (item) {
      lines.push('- ' + item.meta.name + ': ' + item.value + ' (' + bandLabel(item.value) + ')');
    });
    lines.push('');
    lines.push('Pola yang sering muncul: ' + result.pattern);
    lines.push('');

    result.narrative.forEach(function (section) {
      lines.push(section.kicker + '. ' + section.title.toUpperCase());
      section.paragraphs.forEach(function (paragraph) {
        lines.push(paragraph);
        lines.push('');
      });
    });

    if (result.practices && result.practices.length) {
      lines.push('LATIHAN MINGGU INI');
      result.practices.forEach(function (practice, index) {
        lines.push((index + 1) + '. ' + practice.title);
        lines.push(practice.why);
        practice.steps.forEach(function (step) {
          lines.push('- ' + step);
        });
        lines.push('');
      });
    }

    lines.push('Catatan: Diri Insight adalah alat refleksi, bukan diagnosis psikologis. Skor dihitung dari jawabanmu sendiri, bukan dari norma populasi. Jika ada bagian yang terasa berat, pertimbangkan untuk membicarakannya dengan profesional.');
    lines.push('');
    lines.push('Diri Insight, ' + new Date().getFullYear());

    return lines.join('\n');
  }

  global.DiriEngine = {
    computeScores: computeScores,
    computeSignals: computeSignals,
    buildResult: buildResult,
    buildPlainText: buildPlainText,
    getOptionOrder: getOptionOrder,
    isComplete: isComplete,
    answeredCount: answeredCount,
    countWords: countWords,
    band: band,
    bandLabel: bandLabel,
    totalQuestions: DATA.questions.length
  };
})(window);
