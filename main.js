/* =========================================
   GOURP – Página de Vendas | main.js
   ========================================= */

'use strict';

/* -----------------------------------------
   1. PARTICLES
   ----------------------------------------- */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 55;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size  = Math.random() * 3 + 1;          // 1–4px
    const left  = Math.random() * 100;             // % horizontal
    const delay = Math.random() * 18;              // s atraso
    const dur   = Math.random() * 14 + 10;         // 10–24s duração
    const op    = Math.random() * 0.4 + 0.1;       // opacidade base

    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${left}%;
      bottom:-6px;
      opacity:${op};
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
    `;

    container.appendChild(p);
  }
})();

/* -----------------------------------------
   2. NAVBAR – adiciona classe ao rolar
   ----------------------------------------- */
(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* -----------------------------------------
   3. REVEAL ON SCROLL
   ----------------------------------------- */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // atraso cascata para filhos na mesma grade
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal')
          );
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
})();

/* -----------------------------------------
   4. CONTADOR ANIMADO – STATS
   ----------------------------------------- */
(function initCounters() {
  const numbers = document.querySelectorAll('.stat-number[data-target]');
  if (!numbers.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  numbers.forEach((el) => observer.observe(el));
})();

/* -----------------------------------------
   5. VSL – play/pause overlay
   ----------------------------------------- */
(function initVSL() {
  const video   = document.getElementById('heroVideo');
  const overlay = document.getElementById('vslOverlay');
  const playBtn = document.getElementById('playBtn');

  if (!video || !overlay || !playBtn) return;

  const hideOverlay = () => overlay.classList.add('hidden');
  const showOverlay = () => overlay.classList.remove('hidden');

  playBtn.addEventListener('click', () => {
    video.play();
    hideOverlay();
  });

  // Se o utilizador pausar o vídeo nativo, mostra overlay novamente
  video.addEventListener('pause', () => {
    if (!video.ended) showOverlay();
  });

  video.addEventListener('ended', showOverlay);
})();

/* -----------------------------------------
   6. MODAL DE VÍDEO – Depoimentos Google Drive
   ----------------------------------------- */
(function initVideoModal() {
  const modal      = document.getElementById('videoModal');
  const iframe     = document.getElementById('modalIframe');
  const closeBtn   = document.getElementById('modalClose');
  const thumbCards = document.querySelectorAll('.vf-thumb');

  if (!modal || !iframe || !closeBtn) return;

  // Abre o modal e carrega o vídeo
  const openModal = (driveId) => {
    // Usa o embed do Google Drive com autoplay
    iframe.src = `https://drive.google.com/file/d/${driveId}/preview?autoplay=1`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Fecha o modal e para o vídeo
  const closeModal = () => {
    modal.classList.remove('active');
    iframe.src = '';
    document.body.style.overflow = '';
  };

  thumbCards.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const id = thumb.dataset.driveid;
      if (id) openModal(id);
    });

    // Acessibilidade – Enter/Space no teclado
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('role', 'button');
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        thumb.click();
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);

  // Fechar clicando fora do vídeo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
})();

/* -----------------------------------------
   7. SMOOTH ANCHOR SCROLL (compatibilidade)
   ----------------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // altura da navbar fixa
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* -----------------------------------------
   8. HIGHLIGHT ::after – trigger via JS
      (fallback para browsers sem CSS animation-fill-mode)
   ----------------------------------------- */
(function initHighlight() {
  const highlights = document.querySelectorAll('.highlight');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.8 }
  );
  highlights.forEach((el) => observer.observe(el));
})();
