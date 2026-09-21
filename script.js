const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupTheme(){
  const saved = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
  const button = $('#theme-toggle');
  if(!button) return;
  const sync = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    button.textContent = dark ? '☀' : '☾';
    button.title = dark ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode';
  };
  button.addEventListener('click',()=>{
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('portfolio-theme',next);
    sync();
  });
  sync();
}
setupTheme();

const revealItems = $$('.reveal');
if('IntersectionObserver' in window && !reduceMotion){
  const revealObserver = new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.12});
  revealItems.forEach(item=>revealObserver.observe(item));
}else{
  revealItems.forEach(item=>item.classList.add('is-visible'));
}

const header = $('.site-header');
const progress = $('#scroll-progress');
function updateScrollUI(){
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if(progress) progress.style.width = `${total>0?(scrollTop/total)*100:0}%`;
  header?.classList.toggle('scrolled',scrollTop>12);
}
window.addEventListener('scroll',updateScrollUI,{passive:true});
updateScrollUI();

const glow = $('#cursor-glow');
if(glow && window.matchMedia('(pointer:fine)').matches && !reduceMotion){
  window.addEventListener('pointermove',event=>{
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.style.opacity = '1';
  },{passive:true});
}

const menuToggle = $('#menu-toggle');
const mainNav = $('#main-nav');
if(menuToggle && mainNav){
  menuToggle.addEventListener('click',()=>{
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded',String(open));
  });
  $$('.main-nav a').forEach(link=>link.addEventListener('click',()=>{
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
  }));
}

if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
  $$('.tilt-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect = card.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      card.style.transform = `perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
}

function escapeHtml(value=''){
  return String(value).replace(/[&<>'"]/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[char]));
}

function safeUrl(value=''){
  const url=String(value).trim();
  return /^(https?:\/\/|mailto:|tel:)/i.test(url)?url:'#';
}

function mediaFor(item){
  const title=escapeHtml(item.title);
  if(item.type==='youtube' && item.youtubeId){
    const id=encodeURIComponent(item.youtubeId);
    return `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="Thumbnail ${title}" loading="lazy" onerror="this.onerror=null;this.src='https://img.youtube.com/vi/${id}/mqdefault.jpg'>`;
  }
  if(item.type==='external'){
    return `<div class="external-thumb"><span>${escapeHtml(item.externalLabel || 'External Video')}</span><strong>↗</strong></div>`;
  }
  if(item.type==='video' && item.src){
    return `<video src="${escapeHtml(item.src)}" muted playsinline preload="metadata"></video>`;
  }
  return `<img src="${escapeHtml(item.src || '')}" alt="${title}" loading="lazy">`;
}

function cardFor(item,index,featured=false){
  const link=item.link ? `<a class="work-card" href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener" aria-label="Mở ${escapeHtml(item.title)}">` : '<article class="work-card">';
  const close = item.link ? '</a>' : '</article>';
  return `${link}
    <div class="work-card-media">
      ${mediaFor(item)}
      <span class="work-card-badge">${escapeHtml(item.platform || item.category || 'Selected Work')}</span>
      ${item.type==='youtube' || item.type==='external' ? '<span class="work-card-arrow" aria-hidden="true">↗</span>' : ''}
    </div>
    <div class="work-card-body">
      <span class="mini-label">${String(index+1).padStart(2,'0')} · ${escapeHtml(item.category || 'Content')}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description || '')}</p>
      <div class="work-card-meta">
        <span>${escapeHtml(item.format || 'Content')}</span>
        <span>${escapeHtml(item.tool || '—')}</span>
      </div>
    </div>
  ${close}`.replace('class="work-card"',`class="work-card${featured ? ' featured':''}"`);
}

function collectionCardFor(item){
  const media = mediaFor(item);
  const link = item.link ? `<a href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener">Xem video ↗</a>` : '<span></span>';
  return `<article class="collection-card">
    <div class="collection-media collection-media-real">
      ${media}
      <span class="collection-play" aria-hidden="true">▶</span>
    </div>
    <div class="collection-card-body">
      <span class="mini-label">${escapeHtml(item.format || item.platform || 'Video')}</span>
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.description || '')}</p>
      ${link}
    </div>
  </article>`;
}

const workView = $('#work-category-view');
const workNav = $('#work-category-nav');
const totalEl = $('#work-total');
const kidsGrid = $('#youtube-kids-grid');
const adsGrid = $('#reelshort-ads-grid');
let portfolioData = [];
let activeFilter = 'all';

function filterWorks(filter){
  if(filter==='all') return portfolioData;
  if(filter==='YouTube Kids') return portfolioData.filter(item=>item.collection==='youtube-kids' || item.category==='YouTube Kids');
  if(filter==='Reelshort Ads') return portfolioData.filter(item=>item.collection==='reelshort-ads' || item.category==='Reelshort Ads');
  return portfolioData.filter(item=>item.category===filter);
}

function revealWorkCards(){
  const cards=$$('.work-card,.collection-card');
  if(reduceMotion){
    cards.forEach(card=>card.classList.add('is-in'));
    return;
  }
  const obs = new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  },{threshold:.08});
  cards.forEach((card,index)=>{
    card.style.transitionDelay = `${Math.min(index,7)*55}ms`;
    obs.observe(card);
  });
}

function renderMainWorks(){
  const works=filterWorks(activeFilter);
  if(!workView) return;
  if(!works.length){
    workView.innerHTML = `<div class="work-empty"><div class="work-empty-inner">
      <span class="empty-kicker">CONTENT SLOT</span>
      <h3>${escapeHtml(activeFilter)} đang chờ được bổ sung.</h3>
      <p>Thêm video vào <code>data/portfolio.json</code> và chọn đúng category / collection. Layout sẽ tự đưa nội dung vào đúng nhóm.</p>
    </div></div>`;
    return;
  }

  workView.innerHTML = works.map((item,index)=>cardFor(item,index,index===0 && activeFilter==='all')).join('');
  $$('.work-card',workView).forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${((event.clientX-rect.left)/rect.width)*100}%`);
      card.style.setProperty('--my',`${((event.clientY-rect.top)/rect.height)*100}%`);
    });
  });
  revealWorkCards();
}

function renderCollection(grid, collectionKey, title){
  if(!grid) return;
  const items=portfolioData.filter(item=>item.collection===collectionKey);
  if(!items.length){
    grid.innerHTML = `<div class="collection-empty"><div class="collection-empty-inner">
      <div class="empty-title">Chưa có video trong ${escapeHtml(title)}</div>
      <p>Khi bạn có video phù hợp, thêm item vào <code>data/portfolio.json</code> với <code>"collection": "${collectionKey}"</code>. Thumbnail / video card sẽ tự render trong grid này.</p>
    </div></div>`;
    return;
  }
  grid.innerHTML=items.map(collectionCardFor).join('');
  revealWorkCards();
}

function renderPortfolio(){
  if(totalEl) totalEl.textContent=String(portfolioData.length).padStart(2,'0');
  renderMainWorks();
  renderCollection(kidsGrid,'youtube-kids','YouTube Kids');
  renderCollection(adsGrid,'reelshort-ads','Reelshort Ads');
}

workNav?.addEventListener('click',event=>{
  const button=event.target.closest('.filter-btn');
  if(!button) return;
  activeFilter=button.dataset.filter || 'all';
  $$('.filter-btn',workNav).forEach(btn=>btn.classList.toggle('active',btn===button));
  renderMainWorks();
});

async function loadPortfolio(){
  if(!workView) return;
  try{
    const response=await fetch('data/portfolio.json',{cache:'no-store'});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    portfolioData=Array.isArray(data.works)?data.works:[];
  }catch(error){
    console.error('Không thể tải data/portfolio.json:',error);
    portfolioData=[];
    workView.innerHTML='<div class="work-empty"><div class="work-empty-inner"><span class="empty-kicker">PORTFOLIO DATA</span><h3>Không thể tải portfolio data.</h3><p>Kiểm tra file <code>data/portfolio.json</code> và thử tải lại trang.</p></div></div>';
    return;
  }
  renderPortfolio();
}

loadPortfolio();

const year=$('#year');
if(year) year.textContent=new Date().getFullYear();
