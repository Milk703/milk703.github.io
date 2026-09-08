const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('active'); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(section => { observer.observe(section); });

// Dữ liệu đã khớp với tên file ảnh thực tế của bạn trên GitHub
const portfolioData = [
    {
        title: "Banner Rising Stars GoldMax",
        format: "Thiết kế Social",
        role: "Design & Content",
        description: "Key visual chiến dịch ưu đãi, tối ưu tỷ lệ nhấp (CTR).",
        type: "image",
        src: "assets/rising-stars.png" 
    },
    {
        title: "Promotion Campaign",
        format: "Social Post",
        role: "Trưởng phòng Truyền thông",
        description: "Thiết kế ấn phẩm truyền thông cho chương trình khuyến mãi.",
        type: "image",
        src: "assets/promo.png"
    },
    {
        title: "Event Recap",
        format: "Truyền thông sự kiện",
        role: "Điều phối & Edit",
        description: "Tổng hợp hình ảnh nổi bật sau sự kiện thực tế.",
        type: "image",
        src: "assets/event-recap.png"
    },
    {
        title: "Vocabulary Design",
        format: "Content Giáo dục",
        role: "Biên tập & Design",
        description: "Trực quan hóa từ vựng tiếng Anh sinh động.",
        type: "image",
        src: "assets/vocabulary.png"
    }
];

const track = document.getElementById('carousel-track');
const dotsContainer = document.getElementById('dots-container');

portfolioData.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    const mediaHtml = item.type === 'video' 
        ? `<video src="${item.src}" controls muted playsinline></video>`
        : `<img src="${item.src}" alt="${item.title}">`;

    slide.innerHTML = `
        <div class="slide-media">${mediaHtml}</div>
        <div class="slide-info">
            <span class="badge">${item.format}</span>
            <h3>${item.title}</h3>
            <p><strong>Vai trò:</strong> ${item.role}</p>
            <p style="margin-top:10px; color:#555;">${item.description}</p>
        </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = index === 0 ? 'dot active' : 'dot';
    dot.onclick = () => goToSlide(index);
    dotsContainer.appendChild(dot);
});

let currentSlide = 0;
function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
    });
}
document.getElementById('next-btn').onclick = () => {
    if (currentSlide < portfolioData.length - 1) goToSlide(currentSlide + 1);
};
document.getElementById('prev-btn').onclick = () => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
};
