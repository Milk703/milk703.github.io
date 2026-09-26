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

const embeddedPortfolioData={"works":[{"title":"Documentary Short #01 — Story Cut","category":"Documentary","platform":"YouTube","format":"Documentary Short","tool":"Video Editing · Storytelling · Pacing","description":"Dựng theo hướng kể chuyện bằng hình ảnh, ưu tiên chọn shot có thông tin và sắp xếp theo mạch rõ ràng. Nhịp cắt được giữ vừa phải, có điểm nghỉ để hình ảnh và cảm xúc tự dẫn câu chuyện.","type":"youtube","collection":"documentary","youtubeId":"Hqgmv1Gk5tk","link":"https://youtube.com/shorts/Hqgmv1Gk5tk?feature=share"},{"title":"Documentary Short #02 — Visual Storytelling","category":"Documentary","platform":"YouTube","format":"Documentary Short","tool":"Video Editing · B-roll · Pacing","description":"Tập trung vào flow của footage: mở bối cảnh, đi vào chi tiết rồi đẩy cảm xúc ở đúng điểm. B-roll và cutaway được dùng để nối ý tự nhiên, giúp video ngắn nhưng vẫn có chiều sâu.","type":"youtube","collection":"documentary","youtubeId":"Gxx__zPxjso","link":"https://youtube.com/shorts/Gxx__zPxjso?feature=share"},{"title":"Wildlife Documentary — Natural World","category":"Documentary","platform":"YouTube","format":"Wildlife Documentary","tool":"Video Editing · Storytelling · Pacing","description":"Dựng theo hướng wildlife documentary, chọn lọc footage và sắp xếp theo mạch kể tự nhiên, kết hợp pacing và nhịp hình để làm nổi bật không gian, hành vi và diễn biến của thế giới động vật.","type":"youtube","collection":"documentary","youtubeId":"LxcEsRA_9iU","link":"https://youtu.be/LxcEsRA_9iU?si=b1qGayVcVBlNluAU"},{"title":"Real Estate Video #01 — Property Showcase","category":"Real Estate","platform":"YouTube","format":"Real Estate Video","tool":"Video Editing · Content","description":"Video bất động sản tập trung vào cách sắp xếp hình ảnh theo logic showcase: tạo điểm nhìn từ tổng thể đến chi tiết, giữ nhịp xem mạch lạc và ưu tiên những khung hình có giá trị thuyết phục người xem.","type":"youtube","collection":"real-estate","youtubeId":"Erk7PCGQ6OE","link":"https://youtu.be/Erk7PCGQ6OE"},{"title":"Real Estate Short #02 — Vertical Property Ad","category":"Real Estate","platform":"YouTube","format":"Real Estate Short","tool":"Video Editing · Pacing · Short-form","description":"Short-form bất động sản theo hướng vertical ad, chú trọng hook sớm, chuyển cảnh gọn và nhịp hình ảnh liên tục để truyền tải giá trị của sản phẩm trong thời lượng ngắn.","type":"youtube","collection":"real-estate","youtubeId":"m9uR9p5aer8","link":"https://youtube.com/shorts/m9uR9p5aer8?feature=share"},{"title":"Real Estate Short #03 — Project Highlight","category":"Real Estate","platform":"YouTube","format":"Real Estate Short","tool":"Video Editing · Storytelling · Pacing","description":"Video ngắn khai thác project highlight bằng nhịp dựng có điểm nhấn, giúp hình ảnh dự án đi theo một flow rõ ràng thay vì chỉ ghép footage. Tập trung vào sequencing, shot selection và timing để tăng cảm giác chuyên nghiệp của một real estate ad.","type":"youtube","collection":"real-estate","youtubeId":"L6t4Dz_Bgm4","link":"https://youtube.com/shorts/L6t4Dz_Bgm4?feature=share"},{"title":"Drama Ad Edit #01 — Hook & Tension","category":"Drama Ads","platform":"YouTube","format":"Drama Ad Edit","tool":"Video Editing · Pacing · Storytelling","description":"Case tập trung vào cách mở hook nhanh, kiểm soát khoảng nghỉ và đẩy tension theo từng beat để người xem luôn có lý do ở lại đến payoff. Thể hiện tư duy pacing dành cho short-form drama ads: không cắt nhanh một cách cơ học, mà thay đổi nhịp theo cảm xúc của câu chuyện.","type":"youtube","collection":"short-drama","youtubeId":"-cOA6oVrovI","link":"https://youtube.com/shorts/-cOA6oVrovI?feature=share"},{"title":"Drama Ad Edit #02 — Emotional Pacing","category":"Drama Ads","platform":"YouTube","format":"Drama Ad Edit","tool":"Video Editing · Pacing · Storytelling","description":"Bài dựng nhấn vào emotional pacing: giữ shot đủ lâu ở những khoảnh khắc cần cảm xúc, sau đó tăng tốc đúng điểm để tạo contrast. Mục tiêu là cân bằng giữa storytelling và retention, để nhịp dựng phục vụ diễn biến thay vì lấn át câu chuyện.","type":"youtube","collection":"short-drama","youtubeId":"UhOys4IsVJA","link":"https://youtube.com/shorts/UhOys4IsVJA?feature=share"},{"title":"Drama Ad Edit #03 — Rhythm & Retention","category":"Drama Ads","platform":"YouTube","format":"Drama Ad Edit","tool":"Video Editing · Pacing · Storytelling","description":"Tập trung vào rhythm của short-form ads: chia beat rõ, tạo pattern change và thay đổi độ dài shot để tránh cảm giác đều nhịp. Đây là cách tôi tiếp cận editing theo retention — mỗi đoạn cắt đều phải góp phần giữ sự tò mò hoặc đẩy câu chuyện tiến lên.","type":"youtube","collection":"short-drama","youtubeId":"xMlYbvwVV9w","link":"https://youtube.com/shorts/xMlYbvwVV9w?feature=share"},{"title":"Drama Ad Edit #04 — Build to Payoff","category":"Drama Ads","platform":"YouTube","format":"Drama Ad Edit","tool":"Video Editing · Pacing · Storytelling","description":"Case thể hiện cách build nhịp từ chậm đến nhanh để tạo đà cho cao trào và payoff. Tôi ưu tiên timing của reaction, dialogue và cut point, đồng thời sử dụng acceleration có chủ đích để cảm xúc tăng dần thay vì bị dồn ngay từ đầu.","type":"youtube","collection":"short-drama","youtubeId":"fzWjnD4exCw","link":"https://youtube.com/shorts/fzWjnD4exCw?feature=share"},{"title":"Drama Ad Edit #05 — Fast Cut Control","category":"Drama Ads","platform":"YouTube","format":"Drama Ad Edit","tool":"Video Editing · Pacing · Storytelling","description":"Một hướng dựng thiên về fast-cut nhưng vẫn kiểm soát readability: shot ngắn, chuyển nhịp liên tục và ưu tiên thông tin quan trọng ở từng beat. Thể hiện khả năng xử lý pacing cho drama ads khi cần vừa tạo cảm giác gấp, vừa giữ mạch kể chuyện dễ theo dõi.","type":"youtube","collection":"short-drama","youtubeId":"Q4xEfUls0eM","link":"https://youtube.com/shorts/Q4xEfUls0eM?feature=share"},{"title":"Rising Stars – Cuộc thi thuyết trình đỉnh cao","category":"GoldMax — Facebook","platform":"Facebook","format":"Social Campaign","tool":"Canva · Illustrator","description":"Key visual cho hoạt động truyền thông GoldMax, tập trung vào hierarchy, màu sắc thương hiệu và khả năng thu hút người xem trên social.","type":"image","collection":"facebook","src":"assets/rising-stars.png","link":"https://www.facebook.com/share/p/1TFHaVmYvZ/","brand":"GoldMax"},{"title":"Ưu đãi khóa học GoldMax","category":"GoldMax — Facebook","platform":"Facebook","format":"Promotional Design","tool":"Canva · Photoshop","description":"Ấn phẩm truyền thông khuyến mãi GoldMax với bố cục rõ ràng, màu sắc nổi bật và CTA dễ nhận biết.","type":"image","collection":"facebook","src":"assets/promo.png","link":"https://www.facebook.com/share/p/1C3y53TSSd/","brand":"GoldMax"},{"title":"Recap hoạt động & sự kiện","category":"GoldMax — Facebook","platform":"Facebook","format":"Event Recap","tool":"Premiere · Canva","description":"Nội dung recap hoạt động GoldMax giữa thầy và trò, ưu tiên hình ảnh chân thực, cảm xúc và cách kể chuyện phù hợp với social.","type":"image","collection":"facebook","src":"assets/event-recap.png","link":"https://www.facebook.com/share/p/1J4VE4x1nQ/","brand":"GoldMax"},{"title":"Series từ vựng tiếng Anh","category":"GoldMax — Facebook","platform":"Facebook","format":"Educational Social","tool":"Canva · Adobe Illustrator","description":"Series nội dung giáo dục GoldMax được xây dựng theo hướng trực quan, dễ đọc và dễ ghi nhớ.","type":"image","collection":"facebook","src":"assets/vocabulary.png","link":"https://www.facebook.com/share/p/1Bi49Z8Hn7/","brand":"GoldMax"},{"title":"Topic 37: Appearance","category":"GoldMax — YouTube","platform":"YouTube","format":"YouTube Video","tool":"Content Planning · Video Editing","description":"Video học tiếng Anh GoldMax theo chủ đề Appearance, thể hiện khả năng phát triển nội dung giáo dục thành format video có cấu trúc rõ ràng.","type":"youtube","collection":"youtube","youtubeId":"_CaMZYk4jJ4","link":"https://www.youtube.com/watch?v=_CaMZYk4jJ4","brand":"GoldMax"},{"title":"Topic 11: Shopping / Mua Sắm","category":"GoldMax — YouTube","platform":"YouTube","format":"YouTube Video","tool":"Content Planning · Video Editing","description":"Một nội dung trong series học tiếng Anh GoldMax qua các chủ đề, thể hiện khả năng xây dựng format có tính hệ thống.","type":"youtube","collection":"youtube","youtubeId":"DnkXrPzSmik","link":"https://www.youtube.com/watch?v=DnkXrPzSmik","brand":"GoldMax"},{"title":"Topic 31: Health Problems","category":"GoldMax — YouTube","platform":"YouTube","format":"YouTube Video","tool":"Content Planning · Video Editing","description":"Video giáo dục GoldMax về chủ đề Health Problems, bổ sung một góc nội dung khác trong hệ thống video học tiếng Anh.","type":"youtube","collection":"youtube","youtubeId":"1JRlUkqfPTI","link":"https://www.youtube.com/watch?v=1JRlUkqfPTI","brand":"GoldMax"},{"title":"Kỹ Năng Giao Tiếp – Ứng Xử","category":"GoldMax — YouTube","platform":"YouTube","format":"Life Skills Video","tool":"Content Planning · Video Editing","description":"Nội dung kỹ năng sống GoldMax dành cho học sinh, mở rộng hệ thống nội dung từ tiếng Anh sang giáo dục kỹ năng.","type":"youtube","collection":"youtube","youtubeId":"3nEdX8dTfi4","link":"https://www.youtube.com/watch?v=3nEdX8dTfi4","brand":"GoldMax"},{"title":"Happy Birthday GoldMax English – 15 Years","category":"GoldMax — YouTube","platform":"YouTube","format":"Brand Video","tool":"Content · Video Editing","description":"Video kỷ niệm thương hiệu GoldMax, cho thấy khả năng triển khai nội dung video theo dịp đặc biệt và câu chuyện thương hiệu.","type":"youtube","collection":"youtube","youtubeId":"KCaZ1oE_oL8","link":"https://www.youtube.com/watch?v=KCaZ1oE_oL8","brand":"GoldMax"},{"title":"Test Online – GoldMax English","category":"GoldMax — YouTube","platform":"YouTube","format":"Online Test Video","tool":"Content · Video Editing","description":"Video ghi lại nội dung kiểm tra online của GoldMax, bổ sung góc nhìn về khả năng triển khai nội dung phục vụ hoạt động học tập và đánh giá học sinh.","type":"youtube","collection":"youtube","youtubeId":"Ao7MECI5lAQ","link":"https://youtu.be/Ao7MECI5lAQ?si=YMNpaZzmDJ2d09wO","brand":"GoldMax"},{"title":"Highlight trường tiểu học","category":"GoldMax — YouTube","platform":"YouTube","format":"School Highlight","tool":"Video Editing · Content","description":"Video highlight hoạt động tại trường tiểu học, thể hiện khả năng chọn lọc khoảnh khắc và kể chuyện bằng hình ảnh cho nội dung giáo dục.","type":"youtube","collection":"youtube","youtubeId":"vf6g5N9aYUY","link":"https://youtu.be/vf6g5N9aYUY?si=62auG7bFPnwgKned","brand":"GoldMax"},{"title":"Kỹ năng sống – Nội dung nổi bật","category":"GoldMax — YouTube","platform":"YouTube","format":"Life Skills Video","tool":"Content Planning · Video Editing","description":"Một nội dung kỹ năng sống nổi bật dành cho học sinh, giúp thể hiện khả năng mở rộng chủ đề và xây dựng nội dung giáo dục đa dạng.","type":"youtube","collection":"youtube","youtubeId":"l_lF10SKC7E","link":"https://youtu.be/l_lF10SKC7E?si=Q3rQXgysmWVqh6nu","brand":"GoldMax"},{"title":"Video nổi bật – GoldMax English","category":"GoldMax — YouTube","platform":"YouTube","format":"Featured Video","tool":"Video Editing · Content","description":"Một sản phẩm video nổi bật được chọn từ hệ thống nội dung GoldMax English.","type":"youtube","collection":"youtube","youtubeId":"bR__oJ1_Gy4","link":"https://youtu.be/bR__oJ1_Gy4?si=9GbUAiC10fqf2UTc","brand":"GoldMax"},{"title":"Video nổi bật – GoldMax Bắc Giang","category":"GoldMax — YouTube","platform":"YouTube","format":"Featured Video","tool":"Video Editing · Content","description":"Sản phẩm video được chọn từ hệ thống nội dung GoldMax Bắc Giang, bổ sung góc nhìn về khả năng triển khai video cho từng kênh.","type":"youtube","collection":"youtube","youtubeId":"5GAV1rVqRbE","link":"https://youtu.be/5GAV1rVqRbE?si=Bym8k9q47JPWM9IR","brand":"GoldMax"},{"title":"Bài kiểm tra định kỳ – Video","category":"GoldMax — Facebook","platform":"Facebook","format":"Assessment Video","tool":"Video Editing · Content","description":"Video quay nội dung bài kiểm tra định kỳ, bổ sung nhóm sản phẩm thể hiện khả năng triển khai nội dung phục vụ hoạt động đánh giá học sinh.","type":"external","collection":"facebook","externalLabel":"Facebook Video","link":"https://www.facebook.com/share/v/1CHRyKKppK/","brand":"GoldMax"},{"title":"Series từ vựng – Nội dung Facebook","category":"GoldMax — Facebook","platform":"Facebook","format":"Vocabulary Series","tool":"Canva · Content Planning","description":"Một series từ vựng bổ sung cho hệ thống nội dung giáo dục trên Facebook GoldMax.","type":"image","collection":"facebook","src":"assets/vocabulary.png","link":"https://www.facebook.com/share/p/1GTKPtThPq/","brand":"GoldMax"},{"title":"Reels từ vựng tiếng Anh","category":"GoldMax — Facebook","platform":"Facebook","format":"Vocabulary Reel","tool":"Content · Video Editing","description":"Reels ngắn về từ vựng GoldMax, bổ sung định dạng video dọc cho nhóm nội dung social.","type":"external","collection":"facebook","externalLabel":"Facebook Reel","link":"https://www.facebook.com/share/r/1C2Gwms2ye/","brand":"GoldMax"}]};

const collections=[
  {key:'documentary',label:'Documentary',number:'01',description:'Documentary, story-driven short, recap và các sản phẩm kể chuyện bằng hình ảnh.'},
  {key:'real-estate',label:'Bất động sản',number:'02',description:'Property showcase, project video, vertical real estate ads và nội dung bất động sản.'},
  {key:'short-drama',label:'Short',number:'03',description:'Drama ads, short-form storytelling, vertical video và các sản phẩm video ngắn.'},
  {key:'youtube',label:'Youtube',number:'04',description:'Video giáo dục, kỹ năng sống và nội dung theo chủ đề, từ xây dựng format đến dựng và hoàn thiện cho kênh.'},
  {key:'facebook',label:'Facebook',number:'05',description:'Nội dung social gồm campaign, visual, video và các hoạt động thương hiệu được triển khai theo từng mục tiêu.'}
];

function cardFor(item,index,collectionLabel){
  const title=escapeHtml(item.title);
  const inner=`<div class="collection-card-media">${mediaFor(item)}<span class="collection-card-badge">${escapeHtml(item.platform || collectionLabel)}</span><span class="collection-card-arrow" aria-hidden="true">${item.link?'↗':'+'}</span></div>
    <div class="collection-card-body">
      <span class="collection-card-index">${String(index+1).padStart(2,'0')} · ${escapeHtml(item.format || item.category || collectionLabel)}</span>
      <h4>${title}</h4>
      <p>${escapeHtml(item.description || '')}</p>
      <div class="collection-card-meta"><span>${escapeHtml(item.format || 'Content')}</span><span>${escapeHtml(item.tool || '—')}</span></div>
    </div>`;
  return item.link?`<a class="collection-card" href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener" aria-label="Mở ${title}">${inner}</a>`:`<article class="collection-card">${inner}</article>`;
}

const stack=$('#collections-stack');
const collectionIndex=$('#collection-index');
const totalEl=$('#work-total');
let portfolioData=[];

function collectionItems(key){
  const aliases={
    documentary:['documentary'],
    'real-estate':['real-estate'],
    'short-drama':['short-drama'],
    youtube:['youtube','goldmax-youtube'],
    facebook:['facebook','goldmax-facebook']
  };
  const accepted=aliases[key]||[key];
  if(key==='youtube') return portfolioData.filter(item=>item.brand==='GoldMax' && (accepted.includes(item.collection) || item.platform==='YouTube'));
  if(key==='facebook') return portfolioData.filter(item=>item.brand==='GoldMax' && (accepted.includes(item.collection) || item.platform==='Facebook'));
  return portfolioData.filter(item=>accepted.includes(item.collection));
}

function renderCollection(collection){
  const items=collectionItems(collection.key);
  const cards=items.length
    ? items.map((item,i)=>cardFor(item,i,collection.label)).join('')
    : `<div class="collection-empty"><span class="collection-empty-kicker">CONTENT · ${collection.number}</span><h4>${escapeHtml(collection.label)}</h4><p>Một khoảng trống dành cho những sản phẩm tiếp theo.</p><div class="collection-empty-chip">More work coming ↗</div></div>`;
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
    const sectionObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>entry.target.classList.toggle('in-view',entry.isIntersecting));
    },{threshold:.15});
    $$('.portfolio-collection').forEach(section=>sectionObserver.observe(section));
  }
}

function revealCollectionCards(){
  const cards=$$('.collection-card');
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
  $$('.collection-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${((event.clientX-rect.left)/rect.width)*100}%`);
      card.style.setProperty('--my',`${((event.clientY-rect.top)/rect.height)*100}%`);
    });
    if(!reduceMotion){
      card.addEventListener('pointerenter',()=>card.classList.add('is-hot'));
      card.addEventListener('pointerleave',()=>card.classList.remove('is-hot'));
    }
  });
}

function renderPortfolio(){
  if(totalEl) totalEl.textContent=String(portfolioData.length).padStart(2,'0');
  if(stack) stack.innerHTML=collections.map(renderCollection).join('');
  renderCollectionIndex();
  bindCollectionGlow();
  bindCardGlow();
  revealCollectionCards();
}

async function loadPortfolio(){
  // Render Section 03 immediately from the embedded data so it is never blank
  // when GitHub Pages/CDN is slow or the JSON request is temporarily unavailable.
  portfolioData=Array.isArray(embeddedPortfolioData.works)?embeddedPortfolioData.works:[];
  renderPortfolio();

  // Refresh from the JSON file when available, keeping the embedded copy as fallback.
  try{
    const dataUrl=new URL('data/portfolio.json',document.baseURI).href;
    const response=await fetch(dataUrl,{cache:'no-store'});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    if(Array.isArray(data.works) && data.works.length){
      portfolioData=data.works;
      renderPortfolio();
    }
  }catch(error){
    console.warn('Không thể tải data/portfolio.json, dùng dữ liệu tích hợp sẵn:',error);
  }
}

loadPortfolio();

const year=$('#year');
if(year) year.textContent=new Date().getFullYear();