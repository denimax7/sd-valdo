/* ===================================================
   S.D. VALDOVIÑO — JavaScript principal
   Vanilla JS, sen dependencias
   =================================================== */

(function () {
  'use strict';

  /* --- Header: opacidade ao facer scroll --- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Drawer móbil --- */
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawer        = document.getElementById('mobile-drawer');
  const btnOpen       = document.getElementById('btn-open-drawer');
  const btnClose      = document.getElementById('btn-close-drawer');

  function openDrawer() {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    btnClose && btnClose.focus();
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
    btnOpen && btnOpen.focus();
    drawer.setAttribute('aria-hidden', 'true');
  }

  btnOpen  && btnOpen.addEventListener('click', openDrawer);
  btnClose && btnClose.addEventListener('click', closeDrawer);
  drawerOverlay && drawerOverlay.addEventListener('click', closeDrawer);

  /* Pecha con Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) closeDrawer();
  });

  /* Pecha ao picar nun enlace do drawer */
  drawer && drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      setTimeout(closeDrawer, 80);
    });
  });

  /* --- Submenús do drawer (acordeón) --- */
  document.querySelectorAll('.drawer-nav-link[data-sub]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const subId  = link.getAttribute('data-sub');
      const sub    = document.getElementById(subId);
      const isOpen = sub && sub.classList.contains('open');

      /* Pecha todos */
      document.querySelectorAll('.drawer-sub').forEach(s => s.classList.remove('open'));
      document.querySelectorAll('.drawer-nav-link[data-sub]').forEach(l => {
        const icon = l.querySelector('.sub-arrow');
        if (icon) icon.style.transform = '';
      });

      if (!isOpen && sub) {
        sub.classList.add('open');
        const icon = link.querySelector('.sub-arrow');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  /* --- Conta atrás --- */
  function initCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;

    const target = new Date(el.getAttribute('data-target'));

    function update() {
      const now  = new Date();
      const diff = target - now;

      if (diff <= 0) {
        el.innerHTML = '<span class="kicker">Partido en curso!</span>';
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);

      const pad = (n) => String(n).padStart(2, '0');

      el.innerHTML = `
        <div class="countdown-unit"><span class="countdown-num">${pad(d)}</span><span class="countdown-label">Días</span></div>
        <div class="countdown-unit"><span class="countdown-num">${pad(h)}</span><span class="countdown-label">Hrs</span></div>
        <div class="countdown-unit"><span class="countdown-num">${pad(m)}</span><span class="countdown-label">Min</span></div>
        <div class="countdown-unit"><span class="countdown-num">${pad(s)}</span><span class="countdown-label">Seg</span></div>
      `;
    }

    update();
    setInterval(update, 1000);
  }

  initCountdown();

  /* --- Selector de idioma — sincroniza todos os instances da páxina --- */
  function initLangSwitcher() {
    const currentLang = detectCurrentLang();

    /* Marca como activo o botón do idioma actual */
    document.querySelectorAll('[data-lang]').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === currentLang;
      btn.classList.toggle('active', isActive);
      if (isActive) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    /* Navega ao cambiar idioma */
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang    = btn.getAttribute('data-lang');
        const newPath = buildLangPath(lang);
        localStorage.setItem('sdv.locale', lang);
        window.location.href = newPath;
      });
    });
  }

  function detectCurrentLang() {
    const path   = window.location.pathname;
    const stored = localStorage.getItem('sdv.locale');
    if (path.startsWith('/es')) return 'es';
    if (path.startsWith('/gl')) return 'gl';
    return stored || 'gl';
  }

  function buildLangPath(lang) {
    const path    = window.location.pathname;
    const current = detectCurrentLang();
    if (lang === current) return path;
    /* Substitúe /gl/ por /lang/ ou viceversa */
    if (path.startsWith('/' + current)) {
      return '/' + lang + path.slice(current.length + 1);
    }
    return '/' + lang + '/';
  }

  initLangSwitcher();

  /* --- Bottom bar: marca o item activo segundo a URL --- */
  function initBottomBar() {
    const items = document.querySelectorAll('.bottom-bar-item');
    const path  = window.location.pathname;
    items.forEach(item => {
      const href = item.getAttribute('href') || '';
      if (href && path.includes(href.replace(/^\/[a-z]{2}/, ''))) {
        item.classList.add('active');
      }
    });
  }

  initBottomBar();

  /* --- Trap focus dentro do drawer (accesibilidade) --- */
  function trapFocus(e) {
    const open = drawer && drawer.classList.contains('open');
    if (!open) return;

    const focusable = drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  }

  document.addEventListener('keydown', trapFocus);

})();
