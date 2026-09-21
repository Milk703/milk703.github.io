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

const collections=[
  {key:'documentary',label:'Documentary',number:'01',description:'Video kể chuyện, tư liệu, recap, interview hoặc long-form documentary.'},
  {key:'real-estate',label:'Bất động sản',number:'02',description:'Video bất động sản, aerial, property showcase, project story và sales content.'},
  {key:'short-drama',label:'Short Drama',number:'03',description:'Nội dung drama ngắn, storytelling dọc, short-form diễn xuất và các concept có nhịp kể nhanh.'},
  {key:'youtube-kids',label:'YouTube Kids',number:'04',description:'Khu vực riêng cho Kids content, animation, family-friendly và video YouTube hướng tới trẻ em.'},
  {key:'reelshort-ads',label:'Reelshort Ads',number:'05',description:'Khu vực riêng cho vertical ads, performance creative và quảng cáo dạng Reelshort.'},
  {key:'youtube',label:'YouTube',number:'06',description:'Video YouTube hiện có: giáo dục, thương hiệu, hoạt động và nội dung theo chủ đề.'},
  {key:'social',label:'Social / Campaign',number:'07',description:'Social content, campaign, event recap và visual content đã triển khai.'}
];

function cardFor(item,index,collectionLabel){
  const title=escapeHtml(item.title);
  const inner=`<div class="collection-card-media">${mediaFor(item)}<span class="collection-card-badge">${escapeHtml(item.platform || collectionLabel)}</span><span class="collection-card-arrow" aria-hidden="true">${item.link?'↗':'+'}</span></div>
    <div class="collection-card-body">
      <span class="collection-card-index">${String(index+1).padStart(2,'0')} · ${escapeHtml(item.format || item.category || collectionLabel)}</span>
      <h4>${title}</h4>
      <p>${escapeHtml(item.description || '')}</p>
      <div class="collection-card-meta"><span>${escapeHtml(item.format || 'Video')}</span><span>${escapeHtml(item.tool || '—')}</span></div>
    </div>`;
  return item.link?`<a class="collection-card" href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener" aria-label="Mở ${title}">${inner}</a>`:`<article class="collection-card">${inner}</article>`;
}

const stack=$('#collections-stack');
const collectionIndex=$('#collection-index');
const totalEl=$('#work-total');
let portfolioData=[];

function collectionItems(key){
  const legacyMap={
    'short-drama':['short-drama','short-form'],
    'social':['social','social-campaign'],
    'youtube':['youtube'],
    'documentary':['documentary'],
    'real-estate':['real-estate'],
    'youtube-kids':['youtube-kids'],
    'reelshort-ads':['reelshort-ads']
  };
  const accepted=legacyMap[key]||[key];
  return portfolioData.filter(item=>accepted.includes(item.collection)||accepted.includes(item.category));
}

function renderCollection(collection,index){
  const items=collectionItems(collection.key);
  const cards=items.length
    ? items.map((item,i)=>collectionCardFor(item,i,collection.label)).join('')
    : `<div class="collection-empty"><span class="collection-empty-kicker">CONTENT SLOT · ${collection.number}</span><h4>Thêm layer cho ${escapeHtml(collection.label)}</h4><p>Upload video/image vào <code>assets/</code>, sau đó thêm một item với <code>"collection": "${collection.key}"</code> trong <code>data/portfolio.json</code>.</p><div class="collection-empty-chip">Ready for your next project ↗</div></div>`;
  return `<section class="portfolio-collection portfolio-collection-${collection.key}" id="collection-${collection.key}" data-collection="${collection.key}">
    <div class="collection-heading">
      <div class="collection-title-wrap"><span class="collection-kicker">COLLECTION ${collection.number}</span><h3>${escapeHtml(collection.label)}</h3></div>
      <div class="collection-side"><span class="collection-count">${String(items.length).padStart(2,'0')} projects</span><p>${escapeHtml(collection.description)}</p></div>
    </div>
    <div class="collection-divider"></div>
    <div class="collection-grid">${cards}</div>
  </section>`;
}

function renderCollectionIndex(){
  if(!collectionIndex) return;
  collectionIndex.innerHTML=collections.map(c=>`<a class="collection-index-link" href="#collection-${c.key}"><span>${c.number}</span>${escapeHtml(c.label)}</a>`).join('');
}

function bindCollectionGlow(){
  $$('.portfolio-collection').forEach(section=>{
    section.addEventListener('pointermove',event=>{
      const rect=section.getBoundingClientRect();
      section.style.setProperty('--mx',`${((event.clientX-rect.left)/rect.width)*100}%`);
      section.style.setProperty('--my',`${((event.clientY-rect.top)/rect.height)*100}%`);
    });
  });
  if('IntersectionObserver' in window){
    const sectionObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>entry.target.classList.toggle('in-view',entry.isIntersecting));
    },{threshold:.2});
    $$('.portfolio-collection').forEach(section=>sectionObserver.observe(section));
  }
}

function revealCollectionCards(){
  const cards=$('.collection-card');
  if(!cards.length) return;
  if(reduceMotion){
    cards.forEach(card=>card.classList.add('is-in'));
    return;
  }
  const obs=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  },{threshold:.08});
  cards.forEach((card,index)=>{
    card.style.transitionDelay=`${Math.min(index,7)*55}ms`;
    obs.observe(card);
  });
}

function bindCardGlow(){
  $('.collection-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${((event.clientX-rect.left)/rect.width)*100}%`);
      card.style.setProperty('--my',`${((event.clientY-rect.top)/rect.height)*100}%`);
    });
  });
  if(reduceMotion) return;
  $('.collection-card').forEach(card=>{
    card.addEventListener('pointerenter',()=>card.classList.add('is-hot'));
    card.addEventListener('pointerleave',()=>card.classList.remove('is-hot'));
  });
}

function renderPortfolio(){
  if(totalEl){
    const total=portfolioData.reduce((sum,item)=>sum+(item.collection?1:0),0);
    totalEl.textContent=String(total||portfolioData.length).padStart(2,'0');
  }
  if(stack) stack.innerHTML=collections.map(renderCollection).join('');
  renderCollectionIndex();
  bindCollectionGlow();
  bindCardGlow();
  revealCollectionCards();
}

async function loadPortfolio(){
  if(!stack) return;
  try{
    const response=await fetch('data/portfolio.json',{cache:'no-store'});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    portfolioData=Array.isArray(data.works)?data.works:[];
  }catch(error){
    console.error('Không thể tải data/portfolio.json:',error);
    portfolioData=[];
  }
  renderPortfolio();
}

loadPortfolio();

const year=$('#year');
if(year) year.textContent=new Date().getFullYear();
