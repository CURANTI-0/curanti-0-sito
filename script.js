document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Reveal allo scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Barra di progresso scroll
  const progress = document.querySelector('.scroll-progress');
  if (progress) {
    const updateProgress = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progress.style.width = max > 0 ? (h.scrollTop / max * 100) + '%' : '0%';
    };
    updateProgress();
    document.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  // Header che si "stringe" allo scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    onScroll();
    document.addEventListener('scroll', onScroll, { passive: true });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (!reduceMotion && !coarsePointer) {
    // Tilt 3D su card e riquadri galleria
    document.querySelectorAll('.card, .obj-card, .founder-card, .info-card, .fee-card, .news-card, .gallery-item').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--tiltX', (py * -7).toFixed(2) + 'deg');
        el.style.setProperty('--tiltY', (px * 7).toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--tiltX', '0deg');
        el.style.setProperty('--tiltY', '0deg');
      });
    });

    // Bottoni magnetici
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35 - 2;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // Lightbox galleria
  const galleryPhotos = document.querySelectorAll('.gallery-item .gallery-photo');
  if (galleryPhotos.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Chiudi">✕</button><img alt="">';
    document.body.appendChild(lightbox);
    const lbImg = lightbox.querySelector('img');
    const closeLb = () => lightbox.classList.remove('open');
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) closeLb();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
    galleryPhotos.forEach(img => {
      img.parentElement.addEventListener('click', () => {
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add('open');
      });
    });
  }
});
