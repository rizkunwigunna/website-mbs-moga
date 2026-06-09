// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 400);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
if (hamburger) {
  hamburger.addEventListener('click', function () {
    navMenu.classList.toggle('open');
  });
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    link.addEventListener('click', function () { navMenu.classList.remove('open'); });
  });
}

// ===== HERO SLIDER + TYPING =====
const slides = [
  {
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80',
    tag: '🌟 Sekolah Islam Unggulan',
    title: 'Muhammadiyah Boarding School Moga',
    desc: 'Membentuk generasi beriman, berilmu, dan berakhlak mulia untuk menghadapi tantangan global',
    btn1: { label: 'Tentang Kami', href: 'tentang.html' },
    btn2: { label: 'Daftar Sekarang', href: 'ppdb.html' },
  },
  {
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80',
    tag: '📖 Tahfidz Al-Quran',
    title: 'Hafalan Quran Terstruktur & Intensif',
    desc: 'Target minimal 5 juz dengan bimbingan ustadz berpengalaman dan metode pembelajaran modern',
    btn1: { label: 'Selengkapnya', href: 'tentang.html' },
  },
  {
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80',
    tag: '🏆 Prestasi Gemilang',
    title: '50+ Prestasi Akademik & Non-Akademik',
    desc: 'Juara di tingkat kabupaten, provinsi, hingga nasional',
    btn1: { label: 'Lihat Prestasi', href: 'prestasi.html' },
  },
];

let heroIdx = 0;
let typingTimer = null;
let autoSlideTimer = null;

const heroSlidesEl = document.getElementById('heroSlides');
const heroTag = document.getElementById('heroTag');
const typedTitle = document.getElementById('typedTitle');
const heroCursor = document.getElementById('heroCursor');
const heroDesc = document.getElementById('heroDesc');
const heroBtns = document.getElementById('heroBtns');
const heroDots = document.getElementById('heroDots');

// Buat dots
if (heroDots) {
  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'hdot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function () { goTo(i); resetAuto(); });
    heroDots.appendChild(dot);
  });
}

function updateDots() {
  document.querySelectorAll('.hdot').forEach(function (d, i) {
    d.classList.toggle('active', i === heroIdx);
  });
}

function updateSlidesBg() {
  const slideEls = document.querySelectorAll('.hero-slide');
  slideEls.forEach(function (el, i) {
    el.classList.toggle('active', i === heroIdx);
  });
}

function typeTitle(slide) {
  // Set tag, desc, dan tombol langsung
  heroTag.textContent = slide.tag;
  heroDesc.textContent = slide.desc;
  heroDesc.style.animation = 'none';
  heroDesc.offsetHeight; // reflow
  heroDesc.style.animation = 'fadeInHero 0.6s ease 0.2s both';

  // Tombol langsung muncul
  heroBtns.innerHTML = '';
  heroBtns.style.animation = 'none';
  heroBtns.offsetHeight;
  heroBtns.style.animation = 'fadeInHero 0.6s ease 0.3s both';
  const b1 = document.createElement('a');
  b1.href = slide.btn1.href;
  b1.className = 'btn-white';
  b1.textContent = slide.btn1.label;
  heroBtns.appendChild(b1);
  if (slide.btn2) {
    const b2 = document.createElement('a');
    b2.href = slide.btn2.href;
    b2.className = 'btn-outline-white';
    b2.textContent = slide.btn2.label;
    heroBtns.appendChild(b2);
  }

  // Efek typing pada judul
  if (typingTimer) clearInterval(typingTimer);
  typedTitle.textContent = '';
  heroCursor.style.display = 'inline';
  let i = 0;
  typingTimer = setInterval(function () {
    typedTitle.textContent = slide.title.substring(0, i + 1);
    i++;
    if (i >= slide.title.length) {
      clearInterval(typingTimer);
      // Kursor kedip terus setelah selesai ketik
    }
  }, 50);
}

function goTo(idx) {
  heroIdx = (idx + slides.length) % slides.length;
  updateSlidesBg();
  updateDots();
  typeTitle(slides[heroIdx]);
}

function startAuto() {
  autoSlideTimer = setInterval(function () {
    goTo(heroIdx + 1);
  }, 7000);
}

function resetAuto() {
  clearInterval(autoSlideTimer);
  startAuto();
}

// Init
if (heroSlidesEl) {
  typeTitle(slides[0]);
  startAuto();
  document.getElementById('heroPrev').addEventListener('click', function () { goTo(heroIdx - 1); resetAuto(); });
  document.getElementById('heroNext').addEventListener('click', function () { goTo(heroIdx + 1); resetAuto(); });
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

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== FILTER BERITA/GALERI =====
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
    btn.textContent = '✅ Pesan Terkirim!';
    btn.style.background = '#16a34a';
    setTimeout(function () {
      btn.innerHTML = 'Kirim Pesan <i class="fa fa-paper-plane"></i>';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}