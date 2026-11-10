(function () {
  var EMAIL = 'yash2492003@gmail.com';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 1800); }

  /* ---------- router ---------- */
  var views = ['home', 'map', 'trace', 'lab', 'now', 'tldr', 'contact'];
  function route() {
    var v = (location.hash || '#home').slice(1); if (views.indexOf(v) < 0) v = 'home';
    var go = function () {
      $$('.view').forEach(function (s) { s.classList.toggle('on', s.id === 'v-' + v); });
      $$('[data-v]').forEach(function (a) { a.toggleAttribute('aria-current', a.dataset.v === v); if (a.dataset.v === v) a.setAttribute('aria-current', 'page'); });
      window.scrollTo(0, 0);
      if (v === 'tldr') startClock();
      if (v === 'home') countUp();
    };
    if (document.startViewTransition && !reduce && !document.hidden) {
      var t = document.startViewTransition(go), noop = function () {};
      t.ready.catch(noop); t.finished.catch(noop); t.updateCallbackDone.catch(noop);
    } else go();
  }
  addEventListener('hashchange', route);

  /* ---------- theme ---------- */
  function toggleTheme() {
    var r = document.documentElement;
    var dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', r.dataset.theme); } catch (e) {}
  }
  try { var th = localStorage.getItem('theme'); if (th) document.documentElement.dataset.theme = th; } catch (e) {}

  /* ---------- count up ---------- */
  function countUp() {
    if (reduce) return;
    $$('[data-count]').forEach(function (el) {
      var to = +el.dataset.count, t0 = performance.now();
      (function f(t) { var p = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
    });
  }

  /* ---------- map ---------- */
  var NODES = {
    client: { layer: 'Client', title: 'Frontend', sub: 'Where I started, and still where most of my features begin.',
      stack: ['Vue.js', 'TypeScript', 'React', 'Playwright', 'HTML/CSS'],
      wins: ['Built the <b>bulk-upload experience</b> for seven operational processes: one CSV in, a result for every row back.',
             'Shipped <b>five customer-support features</b> end to end, including one that reached QA two days after its API was ready.',
             'Built a <b>Playwright regression suite</b> from scratch, with isolated test tenants and cleanup that never touches shared data.',
             'Wrote shared <b>Vue composables</b> the rest of the team reuses.'] },
    api: { layer: 'Services', title: 'APIs & services', sub: 'Java and Spring, plus one NestJS service I learned on the spot.',
      stack: ['Java 21', 'Spring Boot', 'NestJS', 'REST', 'JPA'],
      wins: ['Made money-moving write paths <b>safe under retries and concurrent updates</b>: idempotency keys, optimistic retries, explicit state machines.',
             'Learned NestJS and shipped a <b>new service endpoint in one day</b>, with zero post-release fixes.',
             'Shipped one bulk flow <b>in a day, two days ahead of schedule, with zero bugs</b>.'] },
    async: { layer: 'Async', title: 'Async & streams', sub: 'Where the work happens when nobody is waiting on it.',
      stack: ['Apache Flink', 'Workflow engines', 'Airflow', 'Redshift'],
      wins: ['Built the <b>safety layer for a statement-generation migration</b> onto streaming pipelines: <b>461 tests</b>, and a <b>3,242-statement cohort with 0 failures</b> and 0 unintended writes.',
             'Designed <b>async fan-out with an outcome per record</b>, so one bad row never sinks a whole batch.'] },
    data: { layer: 'Data', title: 'Data', sub: 'Schemas that have to agree with each other across every environment.',
      stack: ['PostgreSQL', 'Flyway', 'Redis', 'SQL'],
      wins: ['Led a move to <b>one declarative schema migration</b> across several services and environments that had drifted apart over the years.',
             'Proved each migration safe by <b>replaying every environment\'s real schema locally</b> before anything shipped.',
             '<b>Zero-downtime DDL</b>: concurrent index builds, no exclusive locks on live tables, and no drops or renames, ever.'] },
    ai: { layer: 'Tooling', title: 'AI & tools', sub: 'I like building the thing that builds the thing.',
      stack: ['Agent skills', 'LLM APIs', 'Python', 'CLIs'],
      wins: ['Write <b>skills for coding agents</b> that generate and maintain operational docs for 25+ services.',
             'Built <b>IdemProbe</b>, an open-source CLI that catches APIs charging twice under retries.',
             'Built an <b>LLM loan assistant</b> at Punjab National Bank and a chatbot with long-term memory.'] },
    platform: { layer: 'Platform', title: 'Platform', sub: 'Everything above runs on this, and I build parts of it too.',
      stack: ['Kubernetes', 'Java operators', 'Helm', 'Jenkins', 'AWS', 'Docker'],
      wins: ['Built <b>two Kubernetes operators</b> from scratch. Their reconciliation loops replaced manual environment setup and recover from half-finished runs.',
             'Own <b>releases and deployments</b> across India and US environments.',
             'Fixed <b>dependency vulnerabilities across 7+ services</b> and reviewed 100+ deployment changes.'] }
  };
  function openNode(k) {
    var n = NODES[k]; if (!n) return;
    $$('.map .node').forEach(function (g) { g.classList.toggle('sel', g.dataset.n === k); });
    $('#dlayer').textContent = 'layer · ' + n.layer;
    $('#dtitle').textContent = n.title; $('#dsub').textContent = n.sub;
    $('#dbody').innerHTML = '<h4>Tools I use here</h4><div class="chips">' + n.stack.map(function (s) { return '<span class="chip">' + s + '</span>'; }).join('') +
      '</div><h4>What I built here</h4><ul class="wins">' + n.wins.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>';
    $('#drawer').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); $('#scrim').classList.add('open');
  }
  function closeDrawer() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); $('#scrim').classList.remove('open'); $$('.map .node').forEach(function (g) { g.classList.remove('sel'); }); }
  $$('.map .node').forEach(function (g) {
    g.addEventListener('click', function () { openNode(g.dataset.n); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNode(g.dataset.n); } });
  });
  $$('.map-list button').forEach(function (b) { b.onclick = function () { openNode(b.dataset.n); }; });
  $('#dclose').onclick = closeDrawer; $('#scrim').onclick = closeDrawer;

  // ambient packets
  var NS = 'http://www.w3.org/2000/svg';
  function packet(pathId, dur, begin, cls) {
    var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 4); c.setAttribute('class', 'packet ' + (cls || ''));
    var m = document.createElementNS(NS, 'animateMotion'); m.setAttribute('dur', dur + 's'); m.setAttribute('repeatCount', 'indefinite'); m.setAttribute('begin', begin + 's');
    var mp = document.createElementNS(NS, 'mpath'); mp.setAttribute('href', '#' + pathId); m.appendChild(mp); c.appendChild(m);
    $('#packets').appendChild(c);
  }
  if (!reduce) { packet('e1', 1.8, 0); packet('e2', 2.2, .4); packet('e3', 2.4, 1.1, 'v'); packet('e4', 2, .7); packet('e5', 2.8, 1.4, 'v'); packet('e6', 3, .2); }

  // traced request
  var LOG = [
    ['GET /hire', 'frontend', 'rendered the form in 38ms'],
    ['POST /api/candidates', 'api', 'idempotency-key a91f ✓'],
    ['enqueue screen-yash', 'async', 'fan-out to 3 reviewers'],
    ['INSERT offer', 'data', 'no locks were harmed'],
    ['reconcile team', 'platform', 'desired = actual ✓'],
    ['200 OK', 'you', 'Yash is ready to join →']
  ];
  $('#send').onclick = function () {
    var log = $('#maplog'); log.innerHTML = '';
    var order = ['client', 'api', 'async', 'data', 'platform'];
    LOG.forEach(function (l, i) {
      setTimeout(function () {
        $$('.map .node, .map-list button').forEach(function (g) { g.classList.toggle('sel', g.dataset.n === order[i]); });
        var s = document.createElement('span'); s.innerHTML = (i ? '→ ' : '') + '<b>' + l[0] + '</b> ' + l[2];
        if (i === LOG.length - 1) { s.innerHTML = '→ <b>' + l[0] + '</b> <a href="#contact">' + l[2] + '</a>'; }
        log.appendChild(s);
      }, i * 520);
    });
    setTimeout(function () { $$('.map .node, .map-list button').forEach(function (g) { g.classList.remove('sel'); }); }, LOG.length * 520 + 400);
  };

  /* ---------- trace ---------- */
  var T0 = 2021.55, T1 = 2026.95;
  function x(t) { return ((t - T0) / (T1 - T0)) * 100; }
  var SPANS = [
    { n: 'yash.career', d: 0, a: 2021.6, b: 2026.86, c: 'var(--a1)', live: true, lbl: 'root span · still running',
      h: 'Five years and counting', p: 'Started writing code seriously in 2021. Hasn\'t stopped.', kv: [['started', 'Aug 2021'], ['status', 'running'], ['children', '7 spans']] },
    { n: 'iitm.bs_data_science', d: 1, a: 2021.6, b: 2025.5, c: 'var(--a3)', lbl: 'IIT Madras · 8.7',
      h: 'BS, Programming & Data Science', p: 'IIT Madras\'s online degree, done in parallel with a full B.Tech. This is where I learnt to ship real apps.', kv: [['school', 'IIT Madras'], ['cgpa', '8.7 / 10'], ['ran with', 'btech (parallel)']] },
    { n: 'mait.btech_it', d: 1, a: 2021.6, b: 2025.5, c: 'var(--a4)', lbl: 'GGSIPU · 8.8',
      h: 'B.Tech, Information Technology', p: 'Maharaja Agrasen Institute of Technology. Global ranks 103 and 153 in TCS CodeVita out of 100,000+ people along the way.', kv: [['school', 'MAIT, GGSIPU'], ['cgpa', '8.8 / 10'], ['events', 'CodeVita #103, #153']], evt: 2024.6 },
    { n: 'iitm.teaching_assistant', d: 1, a: 2023.78, b: 2024.45, c: 'var(--a2)', lbl: 'TA',
      h: 'Teaching assistant, IIT Madras', p: 'Ran full-stack bootcamps and mentored student projects. 85% of my students got top grades.', kv: [['when', 'Oct 2023 – Jun 2024'], ['outcome', '85% top grades']] },
    { n: 'pnb.intern', d: 1, a: 2024.5, b: 2024.65, c: 'var(--a1)', lbl: '',
      h: 'Intern, Punjab National Bank', p: 'Built an LLM assistant that collects car-loan applications through chat and calls the backend APIs. Shipped it in Docker.', kv: [['when', 'Jul – Aug 2024'], ['stack', 'Python · LLM APIs · Docker']] },
    { n: 'cei.intern', d: 1, a: 2025.0, b: 2025.28, c: 'var(--a3)', lbl: '',
      h: 'Intern, CEI America (remote)', p: 'Built responsive frontend modules and wired up REST APIs with a cross-functional Agile team.', kv: [['when', 'Jan – Apr 2025'], ['stack', 'Frontend · REST']] },
    { n: 'zeta.graduate_intern', d: 1, a: 2025.28, b: 2025.58, c: 'var(--a4)', lbl: '#2',
      h: 'Graduate intern, Zeta', p: 'Placed 2nd in Zeta\'s Beta Engineering Academy. My capstone was a Java and Spring Boot microservices app for splitting expenses on a credit line.', kv: [['when', 'Apr – Jul 2025'], ['rank', '2nd in academy']] },
    { n: 'zeta.sde', d: 1, a: 2025.58, b: 2026.86, c: 'var(--a2)', live: true, lbl: 'SDE I · running',
      h: 'Software Development Engineer, Zeta', p: 'Full stack on a banking platform: Vue frontends, Java services, streaming pipelines, Postgres migrations and Kubernetes operators. On the production path for bank clients in India and the US.', kv: [['since', 'Aug 2025'], ['prs', '250 merged in year one'], ['reviews', '119'], ['awards', '3 Ultimate Team, 1 Mountain Mover']] }
  ];
  function buildTrace() {
    var ax = $('#axis'); ax.innerHTML = '';
    [2022, 2023, 2024, 2025, 2026].forEach(function (y) { var s = document.createElement('span'); s.textContent = y; s.style.left = x(y) + '%'; ax.appendChild(s); });
    var rows = $('#rows'); rows.innerHTML = '';
    SPANS.forEach(function (s, i) {
      var r = document.createElement('div'); r.className = 'tr-row'; r.tabIndex = 0; r.setAttribute('role', 'button');
      var grid = [2022, 2023, 2024, 2025, 2026].map(function (y) { return '<i class="gridl" style="left:' + x(y) + '%"></i>'; }).join('');
      r.innerHTML = '<div class="tr-name mono"><span class="ind">' + (s.d ? '└─' : '') + '</span><i class="sw" style="background:' + s.c + '"></i><span class="svc">' + s.n + '</span></div>' +
        '<div class="tr-bar">' + grid + '<span class="span-b' + (s.live ? ' live' : '') + '" style="left:' + x(s.a) + '%;width:' + (x(s.b) - x(s.a)) + '%;background:' + s.c + ';animation-delay:' + (i * 0.08) + 's">' + s.lbl + '</span>' +
        (s.evt ? '<i class="evt" style="left:' + x(s.evt) + '%" title="CodeVita"></i>' : '') + '</div>';
      r.onclick = function () { pick(i); };
      r.onkeydown = function (e) { if (e.key === 'Enter') pick(i); };
      rows.appendChild(r);
    });
    pick(SPANS.length - 1);
  }
  function pick(i) {
    var s = SPANS[i];
    $$('.tr-row').forEach(function (r, j) { r.classList.toggle('sel', i === j); });
    $('#trdetail').innerHTML = '<div><p class="eyebrow mono">' + s.n + '</p><h3>' + s.h + '</h3><p>' + s.p + '</p></div>' +
      '<div><p class="eyebrow mono">attributes</p><dl class="kv mono">' + s.kv.map(function (k) { return '<dt>' + k[0] + '</dt><dd>' + k[1] + '</dd>'; }).join('') + '</dl></div>';
  }
  buildTrace();

  /* ---------- lab: retry demo ---------- */
  var mode = 'naive';
  $('#naive').onclick = function () { mode = 'naive'; this.setAttribute('aria-pressed', true); $('#safe').setAttribute('aria-pressed', false); reset(); };
  $('#safe').onclick = function () { mode = 'safe'; this.setAttribute('aria-pressed', true); $('#naive').setAttribute('aria-pressed', false); reset(); };
  function reset() {
    var L = $('#lanes'); L.innerHTML = '';
    for (var i = 1; i <= 8; i++) L.insertAdjacentHTML('beforeend', '<div class="lane-r mono"><span>retry #' + i + '</span><span class="track"><i></i></span><span class="res">·</span></div>');
    $('#ledger').textContent = '—'; $('#ledger').className = '';
  }
  reset();
  $('#fire').onclick = function () {
    reset(); var charges = 0, first = -1;
    var order = [3, 0, 6, 1, 5, 2, 7, 4], delays = [380, 520, 440, 610, 470, 560, 400, 650];
    $$('#lanes .lane-r').forEach(function (row, i) {
      setTimeout(function () { row.querySelector('i').style.width = '100%'; }, 30);
      setTimeout(function () {
        var res = row.querySelector('.res');
        if (mode === 'naive') {
          var dup = [0, 2, 5].indexOf(i) >= 0 || charges === 0; if (dup) charges++;
          res.textContent = '201 created'; res.className = 'res ' + (charges > 1 && dup ? 'dup' : 'ok');
          if (charges > 1 && dup) res.textContent = '201 dup!';
        } else {
          if (first < 0) { first = i; charges = 1; res.textContent = '201 created'; } else { res.textContent = '200 replay'; }
          res.className = 'res ok';
        }
        var L = $('#ledger'); L.textContent = charges + (charges === 1 ? ' charge' : ' charges'); L.className = charges > 1 ? 'bad' : 'good';
      }, delays[i]);
    });
  };

  /* ---------- now ---------- */
  function ring(lc) {
    var svg = $('#ring'), r = 62, C = 2 * Math.PI * r, tot = lc.all, parts = [[lc.easy, 'var(--a3)'], [lc.medium, 'var(--a4)'], [lc.hard, 'var(--a2)']], off = 0, gap = 4;
    svg.innerHTML = '<circle cx="75" cy="75" r="' + r + '" fill="none" stroke="var(--surface-2)" stroke-width="12"/>';
    parts.forEach(function (p) {
      var len = C * p[0] / tot - gap;
      svg.insertAdjacentHTML('beforeend', '<circle cx="75" cy="75" r="' + r + '" fill="none" stroke="' + p[1] + '" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + len + ' ' + C + '" stroke-dashoffset="' + (-off) + '"/>');
      off += C * p[0] / tot;
    });
  }
  var LC = { all: 745, easy: 230, medium: 427, hard: 88, streak: 10 };
  ring(LC);
  fetch('data/leetcode.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (!d || !d.all) return;
    $$('[data-lc]').forEach(function (el) { var v = d[el.dataset.lc]; if (v != null) { el.textContent = v; if (el.dataset.count) el.dataset.count = v; } });
    var st = $('[data-lc-streak]');
    if (st) st.textContent = '🔥 ' + d.activeDays + ' active days this year · best streak ' + d.streak;
    var dt = $('[data-lc-date]'); if (dt && d.updated) dt.textContent = ' (last pulled ' + d.updated + ')';
    ring(d);
  }).catch(function () {});

  /* ---------- tldr clock ---------- */
  var ck;
  function startClock() {
    clearInterval(ck); var s = 30, el = $('#clock'); el.textContent = '0:30';
    ck = setInterval(function () { s--; el.textContent = s > 0 ? '0:' + String(s).padStart(2, '0') : 'done ✓'; if (s <= 0) clearInterval(ck); }, 1000);
  }

  /* ---------- contact ---------- */
  function page() { location.href = 'mailto:' + EMAIL + '?subject=Paging%20Yash'; }
  $('#pagebtn').onclick = page;
  function copyEmail() { try { navigator.clipboard.writeText(EMAIL); toast('Email copied'); } catch (e) { toast(EMAIL); } }
  $('#copy').onclick = function (e) { e.preventDefault(); copyEmail(); };

  /* ---------- palette ---------- */
  var CMDS = [
    ['◎', 'Home', '1', function () { location.hash = 'home'; }],
    ['⌬', 'System map', '2', function () { location.hash = 'map'; }],
    ['≡', 'Career trace', '3', function () { location.hash = 'trace'; }],
    ['⚗', 'Lab', '4', function () { location.hash = 'lab'; }],
    ['◐', 'Now', '5', function () { location.hash = 'now'; }],
    ['⚡', '30-second version', '6', function () { location.hash = 'tldr'; }],
    ['✉', 'Page Yash (email)', 'P', page],
    ['⧉', 'Copy email address', '', copyEmail],
    ['↓', 'Download CV', '', function () { location.href = 'Yash_Singhal_CV.pdf'; }],
    ['◑', 'Toggle theme', 'T', toggleTheme],
    ['↗', 'GitHub', '', function () { location.href = 'https://github.com/24yash'; }],
    ['↗', 'LinkedIn', '', function () { location.href = 'https://linkedin.com/in/yashs24'; }]
  ];
  var act = 0, list = CMDS;
  function renderPal() {
    var q = $('#palin').value.toLowerCase();
    list = CMDS.filter(function (c) { return c[1].toLowerCase().indexOf(q) >= 0; });
    act = Math.min(act, Math.max(0, list.length - 1));
    $('#pallist').innerHTML = list.map(function (c, i) { return '<li class="' + (i === act ? 'act' : '') + '" data-i="' + i + '"><b style="width:18px;text-align:center;font-weight:400">' + c[0] + '</b>' + c[1] + '<span class="mono">' + c[2] + '</span></li>'; }).join('') || '<li>Nothing here. Try "cv".</li>';
  }
  function openPal() { $('#pal').classList.add('open'); $('#palin').value = ''; act = 0; renderPal(); $('#palin').focus(); }
  function closePal() { $('#pal').classList.remove('open'); }
  $('#palin').addEventListener('input', function () { act = 0; renderPal(); });
  $('#pallist').addEventListener('click', function (e) { var li = e.target.closest('li[data-i]'); if (li) { closePal(); list[+li.dataset.i][3](); } });
  $('#pal').addEventListener('click', function (e) { if (e.target.id === 'pal') closePal(); });
  $$('[data-act="palette"]').forEach(function (b) { b.onclick = openPal; });
  $$('[data-act="theme"]').forEach(function (b) { b.onclick = toggleTheme; });

  addEventListener('keydown', function (e) {
    var palOpen = $('#pal').classList.contains('open');
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palOpen ? closePal() : openPal(); return; }
    if (palOpen) {
      if (e.key === 'Escape') closePal();
      else if (e.key === 'ArrowDown') { act = (act + 1) % list.length; renderPal(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { act = (act - 1 + list.length) % list.length; renderPal(); e.preventDefault(); }
      else if (e.key === 'Enter' && list[act]) { closePal(); list[act][3](); }
      return;
    }
    if (e.key === 'Escape') closeDrawer();
    if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    var n = +e.key; if (n >= 1 && n <= 7) location.hash = views[n - 1];
    if (e.key === 'p' || e.key === 'P') page();
    if (e.key === 't' || e.key === 'T') toggleTheme();
  });

  route();
})();
