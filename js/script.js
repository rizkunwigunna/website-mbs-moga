// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('show', window.scrollY > 400);
  });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== ANIMASI SCROLL =====
const animEls = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
      siblings.forEach(function (el, i) {
        if (!el.classList.contains('visible')) el.style.transitionDelay = (i * 0.12) + 's';
      });
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
animEls.forEach(function (el) { observer.observe(el); });

// ===== COUNTER =====
const counters = document.querySelectorAll('.stat-num[data-target]');
const counterObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      let current = 0;
      const step = target / 60;
      const timer = setInterval(function () {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 25);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(function (el) { counterObs.observe(el); });

// ===== FILTER =====
document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
  });
});

// ===== FORM KONTAK =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.textContent = '✅ Pesan Terkirim!';
    btn.style.background = '#16a34a';
    setTimeout(function () {
      btn.innerHTML = orig;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// ===== DEFAULT SLIDES =====
const defaultSlides = [
  {
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80',
    tag: '🌟 Sekolah Islam Unggulan',
    title: 'Muhammadiyah Boarding School Moga',
    desc: 'Membentuk generasi beriman, berilmu, dan berakhlak mulia untuk menghadapi tantangan global',
    btn1Label: 'Tentang Kami', btn1Href: 'tentang.html',
    btn2Label: 'Daftar Sekarang', btn2Href: 'ppdb.html',
  },
  {
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80',
    tag: '📖 Tahfidz Al-Quran',
    title: 'Hafalan Quran Terstruktur & Intensif',
    desc: 'Target minimal 5 juz dengan bimbingan ustadz berpengalaman dan metode pembelajaran modern',
    btn1Label: 'Selengkapnya', btn1Href: 'tentang.html',
    btn2Label: '', btn2Href: '',
  },
  {
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80',
    tag: '🏆 Prestasi Gemilang',
    title: '50+ Prestasi Akademik & Non-Akademik',
    desc: 'Juara di tingkat kabupaten, provinsi, hingga nasional',
    btn1Label: 'Lihat Prestasi', btn1Href: 'prestasi.html',
    btn2Label: '', btn2Href: '',
  },
];

// Load slides dari localStorage atau pakai default
function getSlides() {
  try {
    const saved = localStorage.getItem('mbs_slides');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
  } catch(e) {}
  return defaultSlides;
}

// ===== HERO SLIDER + TYPING =====
const heroSlidesEl = document.getElementById('heroSlides');
const heroTag = document.getElementById('heroTag');
const typedTitle = document.getElementById('typedTitle');
const heroCursor = document.getElementById('heroCursor');
const heroDesc = document.getElementById('heroDesc');
const heroBtns = document.getElementById('heroBtns');
const heroDots = document.getElementById('heroDots');

if (heroSlidesEl) {
  let slides = getSlides();
  let heroIdx = 0;
  let typingTimer = null;
  let autoSlideTimer = null;

  // Render slide backgrounds
  function renderSlidesBg() {
    heroSlidesEl.innerHTML = slides.map((s, i) => `
      <div class="hero-slide ${i === 0 ? 'active' : ''}"
           style="background-image:url('${s.img}')">
        <div class="hero-overlay"></div>
      </div>
    `).join('');
  }

  // Render dots
  function renderDots() {
    if (!heroDots) return;
    heroDots.innerHTML = slides.map((_, i) => `
      <button class="hdot ${i === 0 ? 'active' : ''}"></button>
    `).join('');
    heroDots.querySelectorAll('.hdot').forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); resetAuto(); });
    });
  }

  function updateDots() {
    if (!heroDots) return;
    heroDots.querySelectorAll('.hdot').forEach(function (d, i) {
      d.classList.toggle('active', i === heroIdx);
    });
  }

  function updateSlidesBg() {
    heroSlidesEl.querySelectorAll('.hero-slide').forEach(function (el, i) {
      el.classList.toggle('active', i === heroIdx);
    });
  }

  function typeTitle(slide) {
    // Tag
    if (heroTag) heroTag.textContent = slide.tag || '';

    // Desc langsung muncul
    if (heroDesc) {
      heroDesc.textContent = slide.desc || '';
      heroDesc.style.animation = 'none';
      heroDesc.offsetHeight;
      heroDesc.style.animation = 'fadeInHero 0.6s ease 0.2s both';
    }

    // Tombol langsung muncul
    if (heroBtns) {
      heroBtns.innerHTML = '';
      heroBtns.style.animation = 'none';
      heroBtns.offsetHeight;
      heroBtns.style.animation = 'fadeInHero 0.6s ease 0.3s both';
      if (slide.btn1Label && slide.btn1Href) {
        const b1 = document.createElement('a');
        b1.href = slide.btn1Href;
        b1.className = 'btn-white';
        b1.textContent = slide.btn1Label;
        heroBtns.appendChild(b1);
      }
      if (slide.btn2Label && slide.btn2Href) {
        const b2 = document.createElement('a');
        b2.href = slide.btn2Href;
        b2.className = 'btn-outline-white';
        b2.textContent = slide.btn2Label;
        heroBtns.appendChild(b2);
      }
    }

    // Efek typing judul
    if (typingTimer) clearInterval(typingTimer);
    if (typedTitle) typedTitle.textContent = '';
    if (heroCursor) heroCursor.style.display = 'inline';
    let i = 0;
    const title = slide.title || '';
    typingTimer = setInterval(function () {
      if (typedTitle) typedTitle.textContent = title.substring(0, i + 1);
      i++;
      if (i >= title.length) clearInterval(typingTimer);
    }, 50);
  }

  function goTo(idx) {
    heroIdx = (idx + slides.length) % slides.length;
    updateSlidesBg();
    updateDots();
    typeTitle(slides[heroIdx]);
  }

  function startAuto() {
    autoSlideTimer = setInterval(function () { goTo(heroIdx + 1); }, 7000);
  }

  function resetAuto() {
    clearInterval(autoSlideTimer);
    startAuto();
  }

  // Init
  renderSlidesBg();
  renderDots();
  typeTitle(slides[0]);
  startAuto();

  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(heroIdx - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(heroIdx + 1); resetAuto(); });

  // Listen perubahan slide dari admin (localStorage event)
  window.addEventListener('storage', function (e) {
    if (e.key === 'mbs_slides') {
      slides = getSlides();
      heroIdx = 0;
      clearInterval(autoSlideTimer);
      renderSlidesBg();
      renderDots();
      typeTitle(slides[0]);
      startAuto();
    }
  });
}