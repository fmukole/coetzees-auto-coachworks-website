// Coetzee's Auto Coachworks — site behaviour
(function () {
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cfg = window.SITE || {};
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  function waLink(msg) { return 'https://wa.me/' + cfg.wa + '?text=' + encodeURIComponent(msg); }

  // ---- Analytics, only after consent ----
  function loadGA() {
    if (!cfg.ga || window.gtag) return;
    var s = doc.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga; doc.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', cfg.ga, { anonymize_ip: true });
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // ---- Counters ----
  function countUp(el) {
    var end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end.toFixed(dec) + suf; return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    // header shadow + back to top
    var header = $('.header'), top = $('.to-top');
    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle('scrolled', y > 8);
      if (top) top.classList.toggle('show', y > window.innerHeight);
    }
    window.onscroll = onScroll; onScroll();
    if (top) top.onclick = function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); };

    // mobile menu
    var burger = $('.burger'), nav = $('.nav');
    if (burger) burger.onclick = function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    };
    // services dropdown: click, hover and keyboard
    $$('.has-drop').forEach(function (li) {
      var btn = $('.drop-btn', li);
      function set(o) { li.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); }
      btn.onclick = function () { set(!li.classList.contains('open')); };
      li.onmouseenter = function () { if (window.innerWidth > 1080) set(true); };
      li.onmouseleave = function () { if (window.innerWidth > 1080) set(false); };
      li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) set(false); });
      li.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); btn.focus(); } });
    });

    // reveal on scroll, cards one after another
    var reveals = $$('.reveal');
    $$('[data-stagger]').forEach(function (g) {
      $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--d', (i * 0.12) + 's'); });
    });
    var counters = $$('[data-count]');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          if (e.target.dataset.count) countUp(e.target);
          io.unobserve(e.target);
        });
      }, { threshold: 0.15 });
      reveals.concat(counters).forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
      counters.forEach(countUp);
    }
    // hero text fades up on load
    $$('.hero .reveal').forEach(function (el) { setTimeout(function () { el.classList.add('in'); }, 60); });

    // FAQ: one open at a time
    $$('.faq-q').forEach(function (q) {
      q.onclick = function () {
        var open = q.getAttribute('aria-expanded') === 'true';
        $$('.faq-q').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); doc.getElementById(o.getAttribute('aria-controls')).classList.remove('open'); });
        if (!open) { q.setAttribute('aria-expanded', 'true'); doc.getElementById(q.getAttribute('aria-controls')).classList.add('open'); }
      };
    });

    // before / after sliders
    $$('.ba input').forEach(function (r) {
      r.oninput = function () { r.parentNode.style.setProperty('--pos', r.value + '%'); };
    });

    // gallery lightbox
    var shots = $$('.shot'), lb = $('.lightbox');
    if (shots.length && lb) {
      var img = $('img', lb), cap = $('p', lb), cur = 0, last = null;
      function show(i) {
        cur = (i + shots.length) % shots.length;
        var s = $('img', shots[cur]);
        img.src = s.currentSrc || s.src; img.alt = s.alt; cap.textContent = $('span', shots[cur]).textContent;
      }
      function close() { lb.classList.remove('open'); if (last) last.focus(); }
      shots.forEach(function (s, i) { s.onclick = function () { last = s; show(i); lb.classList.add('open'); $('.lb-close', lb).focus(); }; });
      $('.lb-close', lb).onclick = close;
      $('.lb-prev', lb).onclick = function () { show(cur - 1); };
      $('.lb-next', lb).onclick = function () { show(cur + 1); };
      lb.onclick = function (e) { if (e.target === lb) close(); };
      doc.onkeydown = function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(cur - 1);
        if (e.key === 'ArrowRight') show(cur + 1);
      };
    }

    // quote form -> WhatsApp ready message
    var form = $('#quote-form');
    if (form) form.onsubmit = function (e) {
      e.preventDefault();
      var f = form.elements, photo = f.photo.files && f.photo.files.length;
      var msg = "Hi, I'd like a quote for…\n\n" +
        'Name: ' + f.name.value.trim() + '\n' +
        'Phone: ' + f.phone.value.trim() + '\n' +
        'Suburb: ' + f.suburb.value.trim() + '\n' +
        'Job: ' + f.job.value.trim() +
        (photo ? '\n\n(I am attaching ' + (f.photo.files.length > 1 ? 'photos' : 'a photo') + ' of the damage.)' : '');
      $('.form-msg', form).textContent = photo
        ? 'WhatsApp is opening with your details. Tap the paperclip there to attach your photo, then press send.'
        : 'WhatsApp is opening with your details. Press send to reach us.';
      window.open(waLink(msg), '_blank', 'noopener');
    };

    // cookie notice
    var bar = $('.cookie'), choice = store('cookie-choice');
    if (choice === 'yes') loadGA();
    if (bar) {
      if (!choice) bar.classList.add('show');
      $$('button', bar).forEach(function (b) {
        b.onclick = function () {
          store('cookie-choice', b.dataset.choice); bar.classList.remove('show');
          if (b.dataset.choice === 'yes') loadGA();
        };
      });
    }
  }

  window.initSite = init;
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
