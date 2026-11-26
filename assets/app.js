/*
 * Diri Insight: antarmuka, penyimpanan lokal, mode ringkas/lengkap, dan share card.
 */
(function () {
  'use strict';

  var DATA = window.DIRI_DATA;
  var ENGINE = window.DiriEngine;

  if (!DATA || !ENGINE) {
    document.body.innerHTML = '<main style="max-width:640px;margin:80px auto;padding:24px;font-family:sans-serif"><h1>Diri Insight tidak dapat dimuat</h1><p>Berkas data atau mesin analisis tidak ditemukan. Pastikan folder assets lengkap.</p></main>';
    return;
  }

  var KEYS = {
    answers: 'diri-insight:v1:answers',
    current: 'diri-insight:v1:current',
    seed: 'diri-insight:v1:seed',
    mode: 'diri-insight:v1:mode',
    theme: 'diri-insight:theme'
  };
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = {
    answers: {},
    current: 0,
    seed: '',
    mode: 'full',
    screen: 'landing',
    result: null,
    resultRendered: false,
    chart: null,
    lastSection: null,
    loadingTimers: [],
    toastTimer: null,
    storageOK: true
  };

  var els = {};

  function activeQuestions() {
    return ENGINE.getQuestions(state.mode);
  }

  /* ---------- Penyimpanan ---------- */

  function testStorage() {
    try {
      var key = '__diri_insight_test__';
      window.localStorage.setItem(key, '1');
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function readString(key, fallback) {
    try {
      var value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function writeString(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    return writeString(key, JSON.stringify(value));
  }

  function removeKey(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      /* Abaikan jika storage diblokir */
    }
  }

  function markStorageProblem() {
    state.storageOK = false;
    if (els.storageWarning) els.storageWarning.hidden = false;
  }

  function persistAnswers() {
    var ok = writeJSON(KEYS.answers, state.answers);
    if (!ok) markStorageProblem();
    return ok;
  }

  function persistCurrent() {
    var ok = writeString(KEYS.current, String(state.current));
    if (!ok) markStorageProblem();
    return ok;
  }

  function persistSeed() {
    var ok = writeString(KEYS.seed, state.seed);
    if (!ok) markStorageProblem();
    return ok;
  }

  function persistMode() {
    writeString(KEYS.mode, state.mode);
  }

  function createSeed() {
    return String(Date.now()) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function loadSavedState() {
    var savedMode = readString(KEYS.mode, 'full');
    state.mode = savedMode === 'short' ? 'short' : 'full';

    var raw = readJSON(KEYS.answers, {});
    var clean = {};

    DATA.questions.forEach(function (question) {
      var index = raw[question.id];
      if (typeof index === 'number' && Number.isInteger(index) && index >= 0 && index < question.options.length) {
        clean[question.id] = index;
      }
    });

    state.answers = clean;

    var total = activeQuestions().length;
    var savedCurrent = parseInt(readString(KEYS.current, '0'), 10);
    state.current = isNaN(savedCurrent) ? 0 : Math.max(0, Math.min(total - 1, savedCurrent));

    state.seed = readString(KEYS.seed, '');
    if (!state.seed) {
      state.seed = createSeed();
      persistSeed();
    }
  }

  /* ---------- Mode Ringkas vs Lengkap ---------- */

  function setMode(newMode) {
    var normalized = newMode === 'short' ? 'short' : 'full';
    if (state.mode === normalized) return;

    state.mode = normalized;
    state.current = 0;
    state.result = null;
    state.resultRendered = false;
    persistMode();
    persistCurrent();
    updateModeUI();
    refreshGlobalState();
  }

  function updateModeUI() {
    if (!els.modeFull || !els.modeShort) return;
    var isShort = state.mode === 'short';
    els.modeFull.classList.toggle('is-active', !isShort);
    els.modeFull.setAttribute('aria-pressed', !isShort ? 'true' : 'false');
    els.modeShort.classList.toggle('is-active', isShort);
    els.modeShort.setAttribute('aria-pressed', isShort ? 'true' : 'false');

    if (els.heroEyebrow) {
      els.heroEyebrow.textContent = isShort
        ? 'Alat refleksi diri · 27 pertanyaan inti'
        : 'Alat refleksi diri · 70 pertanyaan lengkap';
    }
    if (els.heroDuration) {
      els.heroDuration.textContent = isShort ? '5-8 menit' : '15-25 menit';
    }
  }

  /* ---------- Tema ---------- */

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function updateThemeButton() {
    if (!els.themeToggle) return;
    var dark = currentTheme() === 'dark';
    els.themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    els.themeToggle.setAttribute('aria-label', dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#141C1D' : '#F4EFE5');
  }

  function setTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) writeString(KEYS.theme, theme);
    updateThemeButton();
    if (state.result && els.resultContent && !els.resultContent.hidden) renderChart();
  }

  function toggleTheme() {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
  }

  /* ---------- Toast dan pengumuman ---------- */

  function showToast(message, duration) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(function () {
      els.toast.classList.remove('is-visible');
    }, duration || 2400);
  }

  function announce(message) {
    if (!els.liveRegion) return;
    els.liveRegion.textContent = '';
    window.setTimeout(function () {
      els.liveRegion.textContent = message;
    }, 30);
  }

  function focusHeading(element) {
    if (!element) return;
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
  }

  /* ---------- Layar dan rute ---------- */

  function showScreen(name, options) {
    var opts = options || {};
    var changed = state.screen !== name;

    if (!changed) return;

    state.screen = name;
    document.body.setAttribute('data-screen', name);

    els.screenLanding.hidden = name !== 'landing';
    els.screenQuiz.hidden = name !== 'quiz';
    els.screenResults.hidden = name !== 'results';

    if (name !== 'results') clearLoading();

    var active = name === 'landing' ? els.screenLanding : name === 'quiz' ? els.screenQuiz : els.screenResults;

    if (active && !REDUCED_MOTION) {
      active.classList.remove('is-entering');
      void active.offsetWidth;
      active.classList.add('is-entering');
      window.setTimeout(function () {
        active.classList.remove('is-entering');
      }, 500);
    }

    if (!opts.keepScroll) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    if (opts.focus !== false) {
      if (name === 'landing') focusHeading(els.heroTitle);
      if (name === 'results' && els.resultContent && !els.resultContent.hidden) focusHeading(els.resultTitle);
    }
  }

  function handleRoute() {
    var hash = window.location.hash || '#/';

    if (hash === '#/' || hash === '#' || hash === '') {
      showScreen('landing');
      return;
    }

    if (hash === '#/tes') {
      if (ENGINE.isComplete(state.answers, state.mode)) {
        window.location.replace('#/hasil');
        return;
      }
      showScreen('quiz');
      openQuiz();
      return;
    }

    if (hash === '#/hasil') {
      showScreen('results');
      openResults();
      return;
    }

    var target = document.getElementById(hash.replace(/^#/, ''));
    if (state.screen !== 'landing') {
      showScreen('landing', { focus: false, keepScroll: true });
    }
    if (target) {
      window.setTimeout(function () {
        target.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });
      }, 40);
    }
  }

  /* ---------- Kuis ---------- */

  function openQuiz() {
    var questions = activeQuestions();
    var total = questions.length;

    if (ENGINE.isComplete(state.answers, state.mode)) {
      if (window.location.hash !== '#/hasil') window.location.replace('#/hasil');
      return;
    }

    if (!state.seed) {
      state.seed = createSeed();
      persistSeed();
    }

    /* Arahkan ke pertanyaan pertama yang belum terjawab jika index saat ini sudah dijawab */
    var firstUnanswered = questions.findIndex(function (q) {
      return typeof state.answers[q.id] !== 'number';
    });
    if (firstUnanswered !== -1 && typeof state.answers[questions[state.current] && questions[state.current].id] === 'number') {
      state.current = firstUnanswered;
    }

    if (state.current < 0 || state.current >= total) state.current = 0;

    state.lastSection = null;
    renderQuestion({ focus: true });
  }

  function sectionForQuestion(question) {
    for (var i = 0; i < DATA.sections.length; i += 1) {
      if (DATA.sections[i].id === question.section) {
        return { section: DATA.sections[i], index: i };
      }
    }
    return { section: DATA.sections[0], index: 0 };
  }

  function renderQuestion(options) {
    var opts = options || {};
    var questions = activeQuestions();
    var total = questions.length;
    var question = questions[state.current];
    var sectionInfo = sectionForQuestion(question);
    var section = sectionInfo.section;
    var sectionNumber = sectionInfo.index + 1;
    var selected = state.answers[question.id];
    var order = ENGINE.getOptionOrder(question, state.seed);

    els.quizSectionLabel.textContent = 'Bagian ' + sectionNumber + ' dari ' + DATA.sections.length + ' · ' + section.name;
    els.quizKicker.textContent = 'Pertanyaan ' + (state.current + 1) + ' dari ' + total + ' · ' + section.short;
    els.quizQuestion.textContent = question.prompt;

    els.quizOptions.innerHTML = '';

    order.forEach(function (originalIndex, visibleIndex) {
      var option = question.options[originalIndex];
      var label = document.createElement('label');
      label.className = 'option';
      label.dataset.index = String(originalIndex);

      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = String(originalIndex);
      input.checked = selected === originalIndex;

      var key = document.createElement('span');
      key.className = 'option-key';
      key.setAttribute('aria-hidden', 'true');
      key.textContent = String.fromCharCode(65 + visibleIndex);

      var text = document.createElement('span');
      text.className = 'option-text';
      text.textContent = option.text;

      var indicator = document.createElement('span');
      indicator.className = 'option-state';
      indicator.setAttribute('aria-hidden', 'true');
      indicator.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 10.5 3.5 3.5L16 5.5"></path></svg>';

      label.appendChild(input);
      label.appendChild(key);
      label.appendChild(text);
      label.appendChild(indicator);

      if (input.checked) label.classList.add('is-selected');
      els.quizOptions.appendChild(label);
    });

    els.quizHint.classList.remove('is-alert');
    if (typeof selected === 'number') {
      els.quizHint.textContent = state.current === total - 1
        ? 'Jawaban tersimpan. Tekan "Lihat hasil" untuk menghitung profilmu.'
        : 'Jawaban tersimpan. Kamu bisa mengubahnya sebelum lanjut.';
    } else {
      els.quizHint.textContent = 'Pilih satu jawaban untuk melanjutkan.';
    }

    updateProgress();
    updateNextState();

    if (!REDUCED_MOTION) {
      els.quizCard.classList.remove('is-changing');
      void els.quizCard.offsetWidth;
      els.quizCard.classList.add('is-changing');
    }

    if (opts.focus) {
      window.setTimeout(function () {
        els.quizQuestion.focus({ preventScroll: true });
      }, 30);
    }

    announce('Pertanyaan ' + (state.current + 1) + ' dari ' + total + '.');

    if (state.lastSection && state.lastSection !== question.section) {
      showToast('Bagian ' + sectionNumber + ' dari ' + DATA.sections.length + ' · ' + section.name);
    }
    state.lastSection = question.section;
  }

  function updateProgress() {
    var total = activeQuestions().length;
    var answered = ENGINE.answeredCount(state.answers, state.mode);
    var percent = (answered / total) * 100;

    els.quizProgressFill.style.width = percent + '%';
    els.quizProgressText.textContent = answered + ' dari ' + total + ' terjawab';
    els.quizProgressTrack.setAttribute('aria-valuenow', String(answered));
    els.quizProgressTrack.setAttribute('aria-valuemax', String(total));
  }

  function updateNextState() {
    var questions = activeQuestions();
    var total = questions.length;
    var question = questions[state.current];
    var answered = typeof state.answers[question.id] === 'number';

    els.btnNext.disabled = !answered;
    els.btnNext.textContent = state.current === total - 1 ? 'Lihat hasil' : 'Selanjutnya';
    els.btnPrev.disabled = state.current === 0;
  }

  function selectOption(input) {
    if (!input) return;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function goNext() {
    var questions = activeQuestions();
    var total = questions.length;
    var question = questions[state.current];

    if (typeof state.answers[question.id] !== 'number') {
      els.quizHint.textContent = 'Pilih satu jawaban dulu sebelum lanjut.';
      els.quizHint.classList.add('is-alert');
      announce('Pilih satu jawaban dulu sebelum lanjut.');
      var firstInput = els.quizOptions.querySelector('input[type="radio"]');
      if (firstInput) firstInput.focus();
      return;
    }

    if (state.current < total - 1) {
      state.current += 1;
      persistCurrent();
      renderQuestion({ focus: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    if (ENGINE.isComplete(state.answers, state.mode)) {
      persistCurrent();
      if (window.location.hash === '#/hasil') {
        openResults();
      } else {
        window.location.hash = '#/hasil';
      }
      return;
    }

    var missing = questions.findIndex(function (item) {
      return typeof state.answers[item.id] !== 'number';
    });

    if (missing !== -1) {
      state.current = missing;
      persistCurrent();
      renderQuestion({ focus: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      showToast('Masih ada pertanyaan yang belum dijawab.');
    }
  }

  function goPrevious() {
    if (state.current <= 0) return;
    state.current -= 1;
    persistCurrent();
    renderQuestion({ focus: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  /* ---------- Hasil ---------- */

  function clearLoading() {
    state.loadingTimers.forEach(function (timer) {
      window.clearTimeout(timer);
      window.clearInterval(timer);
    });
    state.loadingTimers = [];
  }

  function openResults() {
    if (!ENGINE.isComplete(state.answers, state.mode)) {
      clearLoading();
      els.loading.hidden = true;
      els.content.hidden = true;
      els.empty.hidden = false;
      els.screenResults.setAttribute('aria-labelledby', 'emptyTitle');
      if (state.screen === 'results') focusHeading(els.emptyTitle);
      return;
    }

    els.empty.hidden = true;
    els.screenResults.setAttribute('aria-labelledby', 'resultTitle');

    if (state.result && state.result.mode === state.mode && state.resultRendered) {
      els.loading.hidden = true;
      els.content.hidden = false;
      focusHeading(els.resultTitle);
      return;
    }

    startLoading();
  }

  function startLoading() {
    clearLoading();
    els.loading.hidden = false;
    els.content.hidden = true;
    els.empty.hidden = true;
    els.screenResults.setAttribute('aria-labelledby', 'loadingTitle');
    focusHeading(els.loadingTitle);

    var stages = [
      'Menghitung skor delapan dimensi...',
      'Membaca pola lintas kategori...',
      'Menyusun narasi dan langkah praktis...'
    ];
    var stageIndex = 0;
    els.loadingMessage.textContent = stages[0];

    state.result = ENGINE.buildResult(state.answers, state.mode);

    var interval = window.setInterval(function () {
      stageIndex = (stageIndex + 1) % stages.length;
      els.loadingMessage.textContent = stages[stageIndex];
    }, 720);
    state.loadingTimers.push(interval);

    var timeout = window.setTimeout(function () {
      window.clearInterval(interval);
      state.resultRendered = true;
      els.loading.hidden = true;
      els.screenResults.setAttribute('aria-labelledby', 'resultTitle');
      renderResult(state.result);
      els.content.hidden = false;
      focusHeading(els.resultTitle);
    }, 2000);
    state.loadingTimers.push(timeout);
  }

  function formatDate(iso) {
    var date = iso ? new Date(iso) : new Date();
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function renderResult(result) {
    var modeBadge = result.mode === 'short' ? 'Mode Ringkas (27 soal)' : 'Mode Lengkap (70 soal)';
    els.resultDate.textContent = 'Peta dirimu · ' + modeBadge + ' · ' + formatDate(result.generatedAt);
    els.resultTitle.textContent = result.archetype.title;
    els.resultLine.textContent = result.archetype.line;
    els.resultSummary.textContent = result.archetype.summary;
    els.factStrength.textContent = result.archetype.strength.meta.name;
    els.factFriction.textContent = result.archetype.friction.meta.name;
    els.factPattern.textContent = result.pattern;

    renderScoreBars(result);
    renderNarrative(result);
    renderPractices(result);

    els.content.hidden = false;

    window.requestAnimationFrame(function () {
      renderChart();
    });
  }

  function renderScoreBars(result) {
    els.scoreBars.innerHTML = '';

    Object.keys(DATA.dimensions).forEach(function (key) {
      var meta = DATA.dimensions[key];
      var value = result.scores.dimensions[key];
      var row = document.createElement('div');
      row.className = 'score-row' + (value < 45 ? ' is-low' : '');
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', meta.name + ': ' + value + ' dari 100, ' + ENGINE.bandLabel(value));

      var head = document.createElement('div');
      head.className = 'score-row-head';

      var name = document.createElement('span');
      name.className = 'score-row-name';
      name.textContent = meta.name;

      var number = document.createElement('span');
      number.className = 'score-row-value';
      number.textContent = String(value);

      head.appendChild(name);
      head.appendChild(number);

      var bar = document.createElement('div');
      bar.className = 'score-bar';
      bar.setAttribute('aria-hidden', 'true');

      var fill = document.createElement('span');
      fill.style.width = '0%';
      bar.appendChild(fill);

      var band = document.createElement('p');
      band.className = 'score-band';
      band.textContent = ENGINE.bandLabel(value);

      row.appendChild(head);
      row.appendChild(bar);
      row.appendChild(band);
      els.scoreBars.appendChild(row);

      if (REDUCED_MOTION) {
        fill.style.width = value + '%';
      } else {
        window.requestAnimationFrame(function () {
          fill.style.width = value + '%';
        });
      }
    });
  }

  function renderNarrative(result) {
    els.narrative.innerHTML = '';

    result.narrative.forEach(function (section) {
      var article = document.createElement('article');
      article.className = 'narrative-section';

      var kicker = document.createElement('p');
      kicker.className = 'narrative-kicker';
      kicker.textContent = section.kicker;

      var body = document.createElement('div');
      var title = document.createElement('h2');
      title.textContent = section.title;
      body.appendChild(title);

      section.paragraphs.forEach(function (paragraph) {
        var p = document.createElement('p');
        p.textContent = paragraph;
        body.appendChild(p);
      });

      article.appendChild(kicker);
      article.appendChild(body);
      els.narrative.appendChild(article);
    });
  }

  function renderPractices(result) {
    els.practiceList.innerHTML = '';

    result.practices.forEach(function (practice) {
      var article = document.createElement('article');
      article.className = 'practice';

      var title = document.createElement('h3');
      title.textContent = practice.title;

      var why = document.createElement('p');
      why.className = 'practice-why';
      why.textContent = practice.why;

      var list = document.createElement('ol');
      practice.steps.forEach(function (step) {
        var item = document.createElement('li');
        item.textContent = step;
        list.appendChild(item);
      });

      article.appendChild(title);
      article.appendChild(why);
      article.appendChild(list);
      els.practiceList.appendChild(article);
    });
  }

  function hexToRgba(hex, alpha) {
    var clean = String(hex).trim().replace('#', '');
    if (clean.length === 3) {
      clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    }
    var number = parseInt(clean, 16);
    if (isNaN(number)) return 'rgba(79, 99, 80, ' + alpha + ')';
    var r = (number >> 16) & 255;
    var g = (number >> 8) & 255;
    var b = number & 255;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  function renderChart() {
    if (!els.radarChart || !state.result) return;

    if (!window.Chart) {
      els.radarChart.hidden = true;
      els.chartFallback.hidden = false;
      return;
    }

    els.radarChart.hidden = false;
    els.chartFallback.hidden = true;

    if (state.chart) {
      state.chart.destroy();
      state.chart = null;
    }

    var styles = window.getComputedStyle(document.documentElement);
    var sage = styles.getPropertyValue('--sage').trim() || '#4F6350';
    var clay = styles.getPropertyValue('--clay').trim() || '#9E5339';
    var line = styles.getPropertyValue('--line').trim() || '#D8D0C0';
    var inkSoft = styles.getPropertyValue('--ink-soft').trim() || '#4E5A5C';
    var bgElev = styles.getPropertyValue('--bg-elev').trim() || '#FBF8F1';

    var labels = Object.keys(DATA.dimensions).map(function (key) {
      return DATA.dimensions[key].short;
    });
    var values = Object.keys(DATA.dimensions).map(function (key) {
      return state.result.scores.dimensions[key];
    });

    state.chart = new window.Chart(els.radarChart.getContext('2d'), {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Profilmu',
          data: values,
          borderColor: sage,
          backgroundColor: hexToRgba(sage, 0.16),
          pointBackgroundColor: clay,
          pointBorderColor: bgElev,
          pointRadius: 3.5,
          pointHoverRadius: 5,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: REDUCED_MOTION ? false : { duration: 700 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.parsed.r + ' dari 100';
              }
            }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            beginAtZero: true,
            ticks: {
              display: false,
              stepSize: 20
            },
            grid: {
              color: line,
              circular: false
            },
            angleLines: {
              color: line
            },
            pointLabels: {
              color: inkSoft,
              padding: 8,
              font: {
                family: 'Instrument Sans, Helvetica Neue, Arial, sans-serif',
                size: 11,
                weight: '500'
              }
            }
          }
        }
      }
    });
  }

  /* ---------- Unduh teks, kartu gambar PNG, dan cetak ---------- */

  function dateSlug() {
    var date = new Date();
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  function downloadResult() {
    if (!state.result) return;

    try {
      var text = ENGINE.buildPlainText(state.result, formatDate(state.result.generatedAt));
      var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'diri-insight-' + dateSlug() + '.txt';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1200);
      showToast('Hasil diunduh sebagai berkas teks.');
    } catch (error) {
      showToast('Unduhan gagal. Coba tombol cetak untuk menyimpan PDF.');
    }
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = String(text).split(/\s+/);
    var line = '';
    var currentY = y;

    for (var i = 0; i < words.length; i += 1) {
      var testLine = line + words[i] + ' ';
      var metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), x, currentY);
      currentY += lineHeight;
    }
    return currentY;
  }

  function downloadShareCard() {
    if (!state.result) return;

    try {
      var result = state.result;
      var dark = currentTheme() === 'dark';
      var bg = dark ? '#141C1D' : '#F4EFE5';
      var cardBg = dark ? '#1B2527' : '#FBF8F1';
      var ink = dark ? '#EDE8DD' : '#1E282A';
      var inkSoft = dark ? '#A9B2B0' : '#4E5A5C';
      var sage = dark ? '#8AA68B' : '#4F6350';
      var clay = dark ? '#D68468' : '#9E5339';
      var line = dark ? '#2D3A3C' : '#D8D0C0';

      var canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      var ctx = canvas.getContext('2d');

      /* Latar luar */
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1080, 1350);

      /* Bingkai kartu utama */
      ctx.fillStyle = cardBg;
      ctx.fillRect(56, 56, 968, 1238);
      ctx.strokeStyle = line;
      ctx.lineWidth = 2;
      ctx.strokeRect(56, 56, 968, 1238);

      /* Header kecil */
      ctx.fillStyle = sage;
      ctx.font = '600 22px "Instrument Sans", sans-serif';
      ctx.fillText('DIRI INSIGHT · PETA DIRI', 112, 134);

      ctx.fillStyle = inkSoft;
      ctx.font = '400 22px "Instrument Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatDate(result.generatedAt), 968, 134);
      ctx.textAlign = 'left';

      /* Judul Archetype */
      ctx.fillStyle = ink;
      ctx.font = '500 68px "Fraunces", Georgia, serif';
      var nextY = wrapCanvasText(ctx, result.archetype.title, 112, 232, 856, 78);

      /* Subjudul Archetype */
      ctx.fillStyle = inkSoft;
      ctx.font = 'italic 30px "Fraunces", Georgia, serif';
      nextY = wrapCanvasText(ctx, result.archetype.line, 112, nextY + 14, 856, 42);

      /* Garis pemisah */
      nextY += 22;
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.moveTo(112, nextY);
      ctx.lineTo(968, nextY);
      ctx.stroke();

      /* 3 Fakta Ringkas */
      nextY += 46;
      var colW = 275;
      var facts = [
        { label: 'KEKUATAN UTAMA', val: result.archetype.strength.meta.name, color: sage },
        { label: 'TITIK GESEK', val: result.archetype.friction.meta.name, color: clay },
        { label: 'MODE ANALISIS', val: result.mode === 'short' ? '27 Soal Inti' : '70 Soal Lengkap', color: ink }
      ];

      facts.forEach(function (item, idx) {
        var fx = 112 + idx * (colW + 15);
        ctx.fillStyle = inkSoft;
        ctx.font = '600 18px "Instrument Sans", sans-serif';
        ctx.fillText(item.label, fx, nextY);

        ctx.fillStyle = item.color;
        ctx.font = '600 26px "Instrument Sans", sans-serif';
        wrapCanvasText(ctx, item.val, fx, nextY + 38, colW, 34);
      });

      /* Bar Skor 8 Dimensi */
      nextY += 126;
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.moveTo(112, nextY);
      ctx.lineTo(968, nextY);
      ctx.stroke();

      nextY += 44;
      ctx.fillStyle = inkSoft;
      ctx.font = '600 19px "Instrument Sans", sans-serif';
      ctx.fillText('DELAPAN DIMENSI (0-100)', 112, nextY);

      nextY += 38;
      var dimKeys = Object.keys(DATA.dimensions);
      dimKeys.forEach(function (key) {
        var meta = DATA.dimensions[key];
        var val = result.scores.dimensions[key];
        var isLowScore = val < 45;

        ctx.fillStyle = ink;
        ctx.font = '500 24px "Instrument Sans", sans-serif';
        ctx.fillText(meta.name, 112, nextY);

        ctx.fillStyle = isLowScore ? clay : sage;
        ctx.font = '600 24px "Instrument Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(String(val), 968, nextY);
        ctx.textAlign = 'left';

        /* Track bar */
        var barY = nextY + 12;
        ctx.fillStyle = line;
        ctx.fillRect(112, barY, 856, 10);

        /* Fill bar */
        ctx.fillStyle = isLowScore ? clay : sage;
        ctx.fillRect(112, barY, Math.round((val / 100) * 856), 10);

        nextY += 56;
      });

      /* Kotak Pola Bawah Sadar */
      nextY += 14;
      ctx.fillStyle = dark ? '#222E30' : '#EFE9DC';
      ctx.fillRect(112, nextY, 856, 118);

      ctx.fillStyle = clay;
      ctx.font = '600 18px "Instrument Sans", sans-serif';
      ctx.fillText('POLA YANG SERING MUNCUL', 140, nextY + 38);

      ctx.fillStyle = ink;
      ctx.font = '500 25px "Instrument Sans", sans-serif';
      wrapCanvasText(ctx, result.pattern, 140, nextY + 76, 800, 34);

      /* Footer kartu */
      ctx.fillStyle = inkSoft;
      ctx.font = '400 20px "Instrument Sans", sans-serif';
      ctx.fillText('Alat refleksi diri, bukan label atau diagnosis.', 112, 1244);

      ctx.textAlign = 'right';
      ctx.fillText('zeinzulaziz.github.io/diri-insight', 968, 1244);
      ctx.textAlign = 'left';

      canvas.toBlob(function (blob) {
        if (!blob) {
          showToast('Gagal membuat gambar kartu.');
          return;
        }
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'diri-insight-kartu-' + dateSlug() + '.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 1200);
        showToast('Kartu ringkasan PNG berhasil diunduh.');
      }, 'image/png');
    } catch (error) {
      showToast('Gagal mengekspor kartu gambar.');
    }
  }

  /* ---------- Mulai ulang ---------- */

  function askRestart() {
    if (!els.restartDialog) return;

    if (typeof els.restartDialog.showModal === 'function') {
      els.restartDialog.returnValue = '';
      els.restartDialog.showModal();
      return;
    }

    if (window.confirm('Hapus semua jawaban dan mulai dari awal?')) resetAll();
  }

  function resetAll() {
    state.answers = {};
    state.current = 0;
    state.result = null;
    state.resultRendered = false;
    state.lastSection = null;
    state.seed = createSeed();

    removeKey(KEYS.answers);
    removeKey(KEYS.current);
    writeString(KEYS.seed, state.seed);

    if (state.chart) {
      state.chart.destroy();
      state.chart = null;
    }

    els.resultContent.hidden = true;
    els.narrative.innerHTML = '';
    els.practiceList.innerHTML = '';
    els.scoreBars.innerHTML = '';
    refreshGlobalState();
    showToast('Jawaban dihapus. Mulai dari awal.');

    if (window.location.hash === '#/tes') {
      openQuiz();
    } else {
      window.location.hash = '#/tes';
    }
  }

  /* ---------- Bagian landing yang dinamis ---------- */

  function refreshGlobalState() {
    var total = activeQuestions().length;
    var answered = ENGINE.answeredCount(state.answers, state.mode);
    var complete = answered === total;
    var partial = answered > 0 && !complete;
    var percent = Math.round((answered / total) * 100);

    if (els.headerStart) {
      els.headerStart.textContent = complete ? 'Lihat hasil' : partial ? 'Lanjutkan' : 'Mulai';
      els.headerStart.href = complete ? '#/hasil' : '#/tes';
    }

    if (els.heroStart) {
      els.heroStart.textContent = complete
        ? 'Lihat hasil terakhir'
        : partial
          ? 'Lanjutkan analisis'
          : (state.mode === 'short' ? 'Mulai mode ringkas (27 soal)' : 'Mulai memetakan diri');
      els.heroStart.href = complete ? '#/hasil' : '#/tes';
    }

    if (!els.resumePanel) return;

    if (answered === 0) {
      els.resumePanel.hidden = true;
      return;
    }

    els.resumePanel.hidden = false;
    var modeName = state.mode === 'short' ? 'Mode Ringkas' : 'Mode Lengkap';

    if (complete) {
      els.resumeTitle.textContent = 'Analisis terakhir siap (' + modeName + ')';
      els.resumeCopy.textContent = 'Kamu sudah menjawab ' + total + ' pertanyaan. Hasil bisa dibaca ulang kapan saja.';
      els.resumeContinue.textContent = 'Lihat hasil';
      els.resumeContinue.href = '#/hasil';
      els.resumeReset.textContent = 'Ulangi analisis';
    } else {
      els.resumeTitle.textContent = 'Progres tersimpan (' + modeName + ')';
      els.resumeCopy.textContent = answered + ' dari ' + total + ' pertanyaan terjawab (' + percent + '%).';
      els.resumeContinue.textContent = 'Lanjutkan';
      els.resumeContinue.href = '#/tes';
      els.resumeReset.textContent = 'Mulai dari awal';
    }
  }

  function renderDimensionList() {
    if (!els.dimensionList) return;
    els.dimensionList.innerHTML = '';

    Object.keys(DATA.dimensions).forEach(function (key, index) {
      var meta = DATA.dimensions[key];
      var item = document.createElement('li');

      var number = document.createElement('span');
      number.className = 'dimension-index';
      number.textContent = String(index + 1).padStart(2, '0');

      var body = document.createElement('div');
      var title = document.createElement('h3');
      title.textContent = meta.name;
      var description = document.createElement('p');
      description.textContent = meta.description;

      body.appendChild(title);
      body.appendChild(description);
      item.appendChild(number);
      item.appendChild(body);
      els.dimensionList.appendChild(item);
    });
  }

  /* ---------- Inisialisasi ---------- */

  function cacheElements() {
    els.screenLanding = document.getElementById('screen-landing');
    els.screenQuiz = document.getElementById('screen-quiz');
    els.screenResults = document.getElementById('screen-results');
    els.heroEyebrow = document.getElementById('heroEyebrow');
    els.heroTitle = document.getElementById('heroTitle');
    els.heroDuration = document.getElementById('heroDuration');
    els.modeFull = document.getElementById('modeFull');
    els.modeShort = document.getElementById('modeShort');
    els.headerStart = document.getElementById('headerStart');
    els.heroStart = document.getElementById('heroStart');
    els.resumePanel = document.getElementById('resumePanel');
    els.resumeTitle = document.getElementById('resumeTitle');
    els.resumeCopy = document.getElementById('resumeCopy');
    els.resumeContinue = document.getElementById('resumeContinue');
    els.resumeReset = document.getElementById('resumeReset');
    els.dimensionList = document.getElementById('dimensionList');
    els.themeToggle = document.getElementById('themeToggle');
    els.quizSectionLabel = document.getElementById('quizSectionLabel');
    els.quizProgressTrack = document.getElementById('quizProgressTrack');
    els.quizProgressFill = document.getElementById('quizProgressFill');
    els.quizProgressText = document.getElementById('quizProgressText');
    els.storageWarning = document.getElementById('storageWarning');
    els.quizCard = document.getElementById('quizCard');
    els.quizKicker = document.getElementById('quizKicker');
    els.quizQuestion = document.getElementById('quizQuestion');
    els.quizOptions = document.getElementById('quizOptions');
    els.quizHint = document.getElementById('quizHint');
    els.btnPrev = document.getElementById('btnPrev');
    els.btnNext = document.getElementById('btnNext');
    els.loading = document.getElementById('resultLoading');
    els.loadingTitle = document.getElementById('loadingTitle');
    els.loadingMessage = document.getElementById('loadingMessage');
    els.empty = document.getElementById('resultEmpty');
    els.emptyTitle = document.getElementById('emptyTitle');
    els.content = document.getElementById('resultContent');
    els.resultDate = document.getElementById('resultDate');
    els.resultTitle = document.getElementById('resultTitle');
    els.resultLine = document.getElementById('resultLine');
    els.resultSummary = document.getElementById('resultSummary');
    els.factStrength = document.getElementById('factStrength');
    els.factFriction = document.getElementById('factFriction');
    els.factPattern = document.getElementById('factPattern');
    els.scoreBars = document.getElementById('scoreBars');
    els.radarChart = document.getElementById('radarChart');
    els.chartFallback = document.getElementById('chartFallback');
    els.narrative = document.getElementById('narrative');
    els.practiceList = document.getElementById('practiceList');
    els.btnShareCard = document.getElementById('btnShareCard');
    els.btnDownload = document.getElementById('btnDownload');
    els.btnPrint = document.getElementById('btnPrint');
    els.btnRetake = document.getElementById('btnRetake');
    els.restartDialog = document.getElementById('restartDialog');
    els.toast = document.getElementById('toast');
    els.liveRegion = document.getElementById('liveRegion');
    els.year = document.getElementById('year');
  }

  function bindEvents() {
    els.themeToggle.addEventListener('click', toggleTheme);
    if (els.modeFull) els.modeFull.addEventListener('click', function () { setMode('full'); });
    if (els.modeShort) els.modeShort.addEventListener('click', function () { setMode('short'); });
    els.resumeReset.addEventListener('click', askRestart);
    els.btnPrev.addEventListener('click', goPrevious);
    els.btnNext.addEventListener('click', goNext);
    if (els.btnShareCard) els.btnShareCard.addEventListener('click', downloadShareCard);
    els.btnDownload.addEventListener('click', downloadResult);
    els.btnPrint.addEventListener('click', function () { window.print(); });
    els.btnRetake.addEventListener('click', askRestart);

    els.quizOptions.addEventListener('change', function (event) {
      var input = event.target;
      if (!input || input.type !== 'radio') return;

      var questions = activeQuestions();
      var total = questions.length;
      var question = questions[state.current];
      var index = parseInt(input.value, 10);
      if (isNaN(index)) return;

      state.answers[question.id] = index;
      state.result = null;
      state.resultRendered = false;

      var saved = persistAnswers();

      Array.prototype.forEach.call(els.quizOptions.querySelectorAll('.option'), function (label) {
        label.classList.toggle('is-selected', label.contains(input));
      });

      updateProgress();
      updateNextState();
      refreshGlobalState();

      els.quizHint.classList.remove('is-alert');
      if (saved) {
        els.quizHint.textContent = state.current === total - 1
          ? 'Jawaban tersimpan. Tekan "Lihat hasil" untuk menghitung profilmu.'
          : 'Jawaban tersimpan di perangkat ini.';
      } else {
        els.quizHint.textContent = 'Jawaban dipilih, tetapi browser tidak mengizinkan penyimpanan.';
      }
    });

    els.restartDialog.addEventListener('close', function () {
      if (els.restartDialog.returnValue === 'confirm') resetAll();
    });

    els.restartDialog.addEventListener('click', function (event) {
      if (event.target === els.restartDialog) els.restartDialog.close('cancel');
    });

    document.addEventListener('keydown', function (event) {
      if (state.screen !== 'quiz') return;
      if (document.querySelector('dialog[open]')) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      var activeTag = document.activeElement ? document.activeElement.tagName : '';

      if (/^[1-5]$/.test(event.key)) {
        var inputs = els.quizOptions.querySelectorAll('input[type="radio"]');
        var position = parseInt(event.key, 10) - 1;
        if (inputs[position]) {
          event.preventDefault();
          selectOption(inputs[position]);
        }
        return;
      }

      if (event.key === 'Enter') {
        if (activeTag === 'BUTTON' || activeTag === 'A') return;
        event.preventDefault();
        goNext();
        return;
      }

      if (event.key === 'ArrowRight' && activeTag !== 'INPUT') {
        event.preventDefault();
        goNext();
        return;
      }

      if (event.key === 'ArrowLeft' && activeTag !== 'INPUT') {
        event.preventDefault();
        goPrevious();
      }
    });

    window.addEventListener('hashchange', handleRoute);
  }

  function init() {
    cacheElements();

    state.storageOK = testStorage();
    if (!state.storageOK && els.storageWarning) els.storageWarning.hidden = false;

    loadSavedState();
    updateModeUI();
    renderDimensionList();
    updateThemeButton();
    bindEvents();
    refreshGlobalState();

    if (els.year) els.year.textContent = String(new Date().getFullYear());

    handleRoute();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
