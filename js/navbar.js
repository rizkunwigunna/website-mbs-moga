// ===== NAVBAR DINAMIS DARI FIREBASE =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3mEDicLhG7fkc6COxMaNesiSRIwqlR5A",
  authDomain: "mbs-moga.firebaseapp.com",
  projectId: "mbs-moga",
  storageBucket: "mbs-moga.firebasestorage.app",
  messagingSenderId: "1000066920494",
  appId: "1:1000066920494:web:d7206769969f6057346fbf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Menu default kalau Firebase belum ada data navbar
const defaultMenu = [
  { label:'Beranda', href:'index.html', urutan:1, isCta:false, dropdown:[] },
  { label:'Tentang', href:'tentang.html', urutan:2, isCta:false, dropdown:[
    { label:'Tentang Sekolah', href:'tentang.html' },
    { label:'Visi & Misi', href:'tentang.html#visi' },
    { label:'Fasilitas', href:'tentang.html#fasilitas' },
  ]},
  { label:'Berita', href:'berita.html', urutan:3, isCta:false, dropdown:[] },
  { label:'Aktivitas', href:'prestasi.html', urutan:4, isCta:false, dropdown:[
    { label:'Prestasi', href:'prestasi.html' },
    { label:'Galeri', href:'galeri.html' },
    { label:'Ekstrakurikuler', href:'ekskul.html' },
  ]},
  { label:'Kontak', href:'kontak.html', urutan:5, isCta:false, dropdown:[] },
  { label:'PPDB 2025', href:'ppdb.html', urutan:6, isCta:true, dropdown:[] },
];

// Render topbar
function renderTopbar() {
  const el = document.getElementById('topbar-placeholder');
  if (!el) return;
  el.innerHTML = `
    <div class="topbar">
      <div class="topbar-inner">
        <div class="topbar-left">
          <span><i class="fa fa-map-marker-alt"></i> Jl. Raya Moga, Kab. Pemalang, Jawa Tengah</span>
          <span><i class="fa fa-phone"></i> +62 812-XXXX-XXXX</span>
        </div>
        <div class="topbar-right">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
        </div>
      </div>
    </div>`;
}

// Render navbar
function renderNavbar(menus) {
  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navMenu.innerHTML = menus.map(menu => {
    const isActive = currentPage === menu.href ||
      (menu.dropdown && menu.dropdown.some(d => currentPage === d.href));
    const hasDropdown = menu.dropdown && menu.dropdown.length > 0;

    if (menu.isCta) {
      return `<li><a href="${menu.href}" class="nav-cta">${menu.label}</a></li>`;
    }

    return `
      <li class="${hasDropdown ? 'has-dropdown' : ''}">
        <a href="${menu.href}" ${isActive ? 'class="active"' : ''}>
          ${menu.label} ${hasDropdown ? '<i class="fa fa-chevron-down"></i>' : ''}
        </a>
        ${hasDropdown ? `
          <ul class="dropdown">
            ${menu.dropdown.map(d => `
              <li><a href="${d.href}" ${currentPage === d.href ? 'class="active"' : ''}>${d.label}</a></li>
            `).join('')}
          </ul>` : ''}
      </li>`;
  }).join('');

  // Re-attach hamburger
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.onclick = () => navMenu.classList.toggle('open');
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  // Dropdown hover (desktop)
  navMenu.querySelectorAll('.has-dropdown').forEach(li => {
    li.addEventListener('mouseenter', () => {
      const dd = li.querySelector('.dropdown');
      if (dd) dd.style.display = 'block';
    });
    li.addEventListener('mouseleave', () => {
      const dd = li.querySelector('.dropdown');
      if (dd) dd.style.display = '';
    });
  });

  // Dropdown click (mobile)
  navMenu.querySelectorAll('.has-dropdown > a').forEach(a => {
    a.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dd = this.nextElementSibling;
        if (dd) dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
      }
    });
  });
}

// Load dari Firebase, fallback ke default
async function loadNavbar() {
  renderTopbar();

  try {
    const snap = await getDocs(collection(db, 'navbar'));
    if (!snap.empty) {
      let menus = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      menus.sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
      renderNavbar(menus);
    } else {
      // Belum ada data di Firebase, pakai default
      renderNavbar(defaultMenu);
    }
  } catch(e) {
    // Error Firebase, pakai default
    renderNavbar(defaultMenu);
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
}

loadNavbar();