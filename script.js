const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveal
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
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

// Header + scroll progress
const header = $('.site-header');
const progress = $('#scroll-progress');
function updateScrollUI(){
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${total > 0 ? (scrollTop / total) * 100 : 0}%`;
  header?.classList.toggle('scrolled', scrollTop > 12);
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
updateScrollUI();

// Soft cursor spotlight on desktop
const glow = $('#cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
  window.addEventListener('pointermove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.style.opacity = '1';
  }, {passive:true});
}

// Mobile navigation
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

// Small 3D tilt for desktop cards
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  $$('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.2).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function safeUrl(value = '') {
  const url = String(value).trim();
  return /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : '#';
}

const track = $('#carousel-track');
const dots = $('#carousel-dots');
const counter = $('#slide-counter');
const prevButton = $('#prev-btn');
const nextButton = $('#next-btn');
const carousel = $('#work-carousel');
const filters = $('#work-filters');
let portfolioData = [];
let filteredWorks = [];
let currentSlide = 0;
let activeFilter = 'all';
let autoplayTimer = null;
let carouselPaused = false;

function createMedia(item) {
  const title = escapeHtml(item.title);
  if (item.type === 'youtube' && item.youtubeId) {
    const id = encodeURIComponent(item.youtubeId);
    const thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    return `<a class="work-media youtube-media" href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener" aria-label="Mở video ${title}"><img src="${thumb}" alt="Thumbnail ${title}" loading="lazy"></a>`;
  }
  if (item.type === 'external') {
    const label = escapeHtml(item.externalLabel || item.platform || 'Mở nội dung');
    return `<a class="work-media youtube-media external-media" href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener" aria-label="Mở nội dung ${title}"><span>${label} ↗</span></a>`;
  }
  const src = escapeHtml(item.src || '');
  if (item.type === 'video') return `<video src="${src}" controls playsinline preload="metadata"></video>`;
  return `<img src="${src}" alt="${title}" loading="lazy">`;
}

function getFilteredWorks(){
  if (activeFilter === 'all') return [...portfolioData];
  return portfolioData.filter(item => item.platform === activeFilter || item.category === activeFilter);
}

function renderCarousel(){
  filteredWorks = getFilteredWorks();
  currentSlide = 0;
  if (!track || !dots) return;
  if (!filteredWorks.length) {
    track.innerHTML = '<article class="work-slide"><div class="work-info"><h3>Chưa có nội dung ở nhóm này.</h3><p>Nhóm dự án sẽ được cập nhật trong data/portfolio.json.</p></div></article>';
    dots.innerHTML = '';
    if (counter) counter.textContent = '00 / 00';
    return;
  }

  track.innerHTML = filteredWorks.map((item, index) => `
    <article class="work-slide" aria-label="${index + 1} trên ${filteredWorks.length}">
      <div class="work-media-wrap">${createMedia(item)}</div>
      <div class="work-info">
        <span class="work-number">${String(index + 1).padStart(2, '0')} / ${String(filteredWorks.length).padStart(2, '0')}</span>
        <span class="section-kicker" style="margin-top:14px">${escapeHtml(item.platform || 'Selected Work')} · ${escapeHtml(item.category || 'Content')}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <p class="work-meta"><strong>Định dạng:</strong> ${escapeHtml(item.format || '—')}<br><strong>Công cụ:</strong> ${escapeHtml(item.tool || '—')}</p>
        ${item.link ? `<a class="btn btn-primary work-link" href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener">Xem nội dung ↗</a>` : ''}
      </div>
    </article>
  `).join('');

  // Normalize the media wrapper so both image and YouTube cards fill the slide.
  $$('.work-media-wrap').forEach(wrapper => {
    const media = wrapper.firstElementChild;
    if (media?.classList.contains('youtube-media') || media?.classList.contains('external-media')) wrapper.replaceWith(media);
    else wrapper.className = 'work-media';
  });

  dots.innerHTML = filteredWorks.map((item, index) => `<button class="dot ${index === 0 ? 'active' : ''}" aria-label="Xem tác phẩm ${index + 1}" data-slide="${index}"></button>`).join('');
  $$('.dot').forEach(dot => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.slide))));
  updateCarousel(false);
}

function updateCarousel(animate = true){
  if (!track || !filteredWorks.length) return;
  track.style.transition = animate ? '' : 'none';
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  if (counter) counter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(filteredWorks.length).padStart(2, '0')}`;
  $$('.dot').forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
  $$('.work-slide video').forEach(video => {
    if (!video.closest('.work-slide')?.isSameNode($$('.work-slide')[currentSlide])) video.pause();
  });
}

function goToSlide(index){
  if (!filteredWorks.length) return;
  currentSlide = (index + filteredWorks.length) % filteredWorks.length;
  updateCarousel(true);
}

prevButton?.addEventListener('click', () => goToSlide(currentSlide - 1));
nextButton?.addEventListener('click', () => goToSlide(currentSlide + 1));

// Filters
filters?.addEventListener('click', event => {
  const button = event.target.closest('.filter-btn');
  if (!button) return;
  activeFilter = button.dataset.filter || 'all';
  $$('.filter-btn', filters).forEach(btn => btn.classList.toggle('active', btn === button));
  renderCarousel();
});

// Touch / keyboard navigation
let touchStartX = 0;
carousel?.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, {passive:true});
carousel?.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 50) goToSlide(currentSlide + (distance < 0 ? 1 : -1));
}, {passive:true});
carousel?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') goToSlide(currentSlide - 1);
  if (event.key === 'ArrowRight') goToSlide(currentSlide + 1);
});

// Gentle autoplay. It pauses while the recruiter is interacting with the carousel.
function startAutoplay(){
  if (reduceMotion || filteredWorks.length < 2) return;
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => {
    if (!carouselPaused && document.visibilityState === 'visible') goToSlide(currentSlide + 1);
  }, 6500);
}
carousel?.addEventListener('mouseenter', () => { carouselPaused = true; });
carousel?.addEventListener('mouseleave', () => { carouselPaused = false; });
carousel?.addEventListener('focusin', () => { carouselPaused = true; });
carousel?.addEventListener('focusout', () => { carouselPaused = false; });

async function loadPortfolio(){
  if (!track) return;
  try {
    const response = await fetch('data/portfolio.json', {cache:'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    portfolioData = Array.isArray(data.works) ? data.works : [];
  } catch(error){
    console.error('Không thể tải data/portfolio.json:', error);
    track.innerHTML = '<article class="work-slide"><div class="work-info"><h3>Portfolio đang được cập nhật.</h3><p>Vui lòng tải lại trang sau ít phút.</p></div></article>';
    return;
  }
  renderCarousel();
  startAutoplay();
}

loadPortfolio();

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
