/* ================= NAVBAR SCROLL EFFECT ================= */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  if(window.scrollY > 40){ navbar.classList.add('scrolled'); }
  else{ navbar.classList.remove('scrolled'); }
};
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ================= HAMBURGER MENU ================= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
}));

/* ================= SCROLL REVEAL ================= */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el => revealObserver.observe(el));

/* ================= RIPPLE MICRO-INTERACTION ================= */
document.querySelectorAll('[data-ripple]').forEach(btn => {
  btn.addEventListener('click', function(e){
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ================= TABS (PROFIL SEKOLAH) ================= */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector('.tab-panel[data-panel="'+btn.dataset.tab+'"]').classList.add('active');
  });
});

/* ================= COUNTER ANIMATION ================= */
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        el.textContent = Math.floor(eased * target);

        if(progress < 1){ 
          requestAnimationFrame(animate); 
        }
        else{ 
          el.textContent = target; 
        }
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    }
  });
}, {threshold:0.5});

counters.forEach(c => counterObserver.observe(c));

/* ================= GALERI LIGHTBOX ================= */
const lightbox = document.getElementById('lightbox');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxImage = document.getElementById('lightboxImage');

document.querySelectorAll('.g-item').forEach(item => {
  item.addEventListener('click', () => {
    const imageSrc = item.dataset.image || '';
    const caption = item.dataset.caption || '';
    
    lightboxImage.src = imageSrc;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
  });
});

document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') lightbox.classList.remove('open'); });

/* ================= BERITA CAROUSEL ================= */
const track = document.getElementById('beritaTrack');
const cards = track.querySelectorAll('.berita-card');
let beritaIndex = 0;
function getVisibleCount(){
  const w = window.innerWidth;
  if(w <= 640) return 1;
  if(w <= 920) return 2;
  return 3;
}
function updateCarousel(){
  const visible = getVisibleCount();
  const maxIndex = Math.max(0, cards.length - visible);
  if(beritaIndex > maxIndex) beritaIndex = maxIndex;
  const cardWidth = cards[0].getBoundingClientRect().width + 26;
  track.style.transform = 'translateX(' + (-beritaIndex * cardWidth) + 'px)';
}
document.getElementById('beritaNext').addEventListener('click', () => {
  const visible = getVisibleCount();
  const maxIndex = Math.max(0, cards.length - visible);
  beritaIndex = beritaIndex >= maxIndex ? 0 : beritaIndex + 1;
  updateCarousel();
});
document.getElementById('beritaPrev').addEventListener('click', () => {
  const visible = getVisibleCount();
  const maxIndex = Math.max(0, cards.length - visible);
  beritaIndex = beritaIndex <= 0 ? maxIndex : beritaIndex - 1;
  updateCarousel();
});
window.addEventListener('resize', updateCarousel);
let beritaAutoplay = setInterval(() => {
  const visible = getVisibleCount();
  const maxIndex = Math.max(0, cards.length - visible);
  beritaIndex = beritaIndex >= maxIndex ? 0 : beritaIndex + 1;
  updateCarousel();
}, 5000);
track.addEventListener('mouseenter', () => clearInterval(beritaAutoplay));

/* ================= TOAST BERITA ================= */
const beritaToast = document.getElementById('beritaToast');
const beritaToastTitle = document.getElementById('beritaToastTitle');
const beritaToastDate = document.getElementById('beritaToastDate');
const beritaToastTime = document.getElementById('beritaToastTime');
const beritaToastText = document.getElementById('beritaToastText');
const beritaToastImage = document.getElementById('beritaToastImage');
const beritaToastClose = document.getElementById('beritaToastClose');
let toastTimer = null;

function formatWaktu(){
  const now = new Date();
  return now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }) + ' WIB';
}

function showBeritaToast(card){
  const title = card.querySelector('h4')?.textContent.trim() || 'Judul Berita';
  const date = card.querySelector('.berita-date')?.textContent.trim() || 'Tanggal belum tersedia';
  const customDescription = card.getAttribute('data-description') || 'Informasi berita sedang diperbarui.';
  const image = card.querySelector('.berita-img')?.src || '';

  beritaToastTitle.textContent = title;
  beritaToastDate.textContent = date;
  beritaToastTime.textContent = formatWaktu();
  beritaToastText.textContent = customDescription;
  beritaToastImage.src = image;
  beritaToastImage.alt = title;
  beritaToast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    beritaToast.classList.remove('show');
  }, 3300);
}

document.querySelectorAll('.berita-card').forEach(card => {
  const body = card.querySelector('.berita-body');
  const link = card.querySelector('.berita-link');

  body.addEventListener('click', () => showBeritaToast(card));
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showBeritaToast(card);
  });
});

beritaToastClose.addEventListener('click', () => {
  beritaToast.classList.remove('show');
  clearTimeout(toastTimer);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && beritaToast.classList.contains('show')) {
    beritaToast.classList.remove('show');
    clearTimeout(toastTimer);
  }
});


