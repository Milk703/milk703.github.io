const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Scroll reveal — nhẹ, mượt và tôn trọng prefers-reduced-motion.
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Mobile navigation.
const menuToggle = $('#menu-toggle');
const mainNav = $('#main-nav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Escaping giúp nội dung trong data/portfolio.json không làm vỡ HTML.
function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

const track = $('#carousel-track');
const dots = $('#carousel-dots');
const counter = $('#slide-counter');
const prevButton = $('#prev-btn');
const nextButton = $('#next-btn');
const carousel = $('#work-carousel');
let portfolioData = [];
let currentSlide = 0;

function createMedia(item) {
  const src = escapeHtml(item.src);
  const title = escapeHtml(item.title);
  if (item.type === 'video') {
    return `<video src="${src}" controls playsinline preload="metadata"></video>`;
  }
  return `<img src="${src}" alt="${title}" loading="lazy">`;
}

function renderCarousel() {
  if (!track || !dots || !portfolioData.length) return;

  track.innerHTML = portfolioData.map((item, index) => `
    <article class="work-slide" aria-label="${index + 1} trên ${portfolioData.length}">
      <div class="work-media">${createMedia(item)}</div>
      <div class="work-info">
        <span class="work-number">${String(index + 1).padStart(2, '0')} / ${String(portfolioData.length).padStart(2, '0')}</span>
        <span class="section-kicker" style="margin-top:14px">${escapeHtml(item.category || item.format || 'Selected Work')}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <p class="work-meta"><strong>Định dạng:</strong> ${escapeHtml(item.format || '—')}<br><strong>Công cụ:</strong> ${escapeHtml(item.tool || '—')}</p>
        ${item.link ? `<a class="btn btn-primary work-link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener">Xem nội dung ↗</a>` : ''}
      </div>
    </article>
  `).join('');

  dots.innerHTML = portfolioData.map((item, index) => `
    <button class="dot ${index === currentSlide ? 'active' : ''}" aria-label="Xem tác phẩm ${index + 1}" data-slide="${index}"></button>
  `).join('');

  $$('.dot').forEach(dot => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.slide))));
  updateCarousel(false);
}

function updateCarousel(animate = true) {
  if (!track || !portfolioData.length) return;
  track.style.transition = animate ? '' : 'none';
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  if (counter) counter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(portfolioData.length).padStart(2, '0')}`;
  $$('.dot').forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));

  // Dừng video ở slide cũ khi chuyển trang.
  $$('.work-slide video').forEach(video => {
    if (!video.closest('.work-slide')?.isSameNode($$('.work-slide')[currentSlide])) {
      video.pause();
    }
  });
}

function goToSlide(index) {
  if (!portfolioData.length) return;
  currentSlide = (index + portfolioData.length) % portfolioData.length;
  updateCarousel(true);
}

prevButton?.addEventListener('click', () => goToSlide(currentSlide - 1));
nextButton?.addEventListener('click', () => goToSlide(currentSlide + 1));

// Vuốt trên điện thoại.
let touchStartX = 0;
let touchEndX = 0;
carousel?.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });
carousel?.addEventListener('touchend', event => {
  touchEndX = event.changedTouches[0].screenX;
  const distance = touchEndX - touchStartX;
  if (Math.abs(distance) > 50) goToSlide(currentSlide + (distance < 0 ? 1 : -1));
}, { passive: true });

// Bàn phím khi con trỏ đang ở khu vực portfolio.
carousel?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') goToSlide(currentSlide - 1);
  if (event.key === 'ArrowRight') goToSlide(currentSlide + 1);
});

async function loadPortfolio() {
  if (!track) return;
  try {
    const response = await fetch('data/portfolio.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    portfolioData = Array.isArray(data.works) ? data.works : [];
  } catch (error) {
    console.error('Không thể tải data/portfolio.json:', error);
    track.innerHTML = '<div class="work-slide"><div class="work-info"><h3>Portfolio đang được cập nhật.</h3><p>Vui lòng tải lại trang sau ít phút.</p></div></div>';
    return;
  }
  if (!portfolioData.length) {
    track.innerHTML = '<div class="work-slide"><div class="work-info"><h3>Chưa có tác phẩm.</h3><p>Nội dung sẽ được cập nhật trong data/portfolio.json.</p></div></div>';
    return;
  }
  if (counter) counter.textContent = `01 / ${String(portfolioData.length).padStart(2, '0')}`;
  renderCarousel();
}

loadPortfolio();

// Năm hiện tại ở footer.
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
