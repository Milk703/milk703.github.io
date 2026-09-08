// Kích hoạt hiệu ứng xuất hiện khi cuộn chuột
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(section => observer.observe(section));

// ==========================================
// THÊM FILE VÀO THƯ MỤC ASSETS VÀ KHAI BÁO VÀO ĐÂY
// ==========================================
const portfolioData = [
    {
        title: "Banner Rising Stars GoldMax",
        format: "Thiết kế Social",
        tool: "Canva, Illustrator",
        description: "Thiết kế key visual cho chương trình khuyến mãi khóa học, thể hiện rõ thông điệp, màu sắc thương hiệu và CTA ấn tượng.",
        type: "image",
        src: "assets/rising-stars.png"
    },
    {
        title: "Promotion Campaign",
        format: "Thiết kế Social",
        tool: "Photoshop, Canva",
        description: "Bộ ấn phẩm quảng cáo thúc đẩy doanh số, thiết kế đồng bộ cho đa nền tảng.",
        type: "image",
        src: "assets/promo.png"
    },
    {
        title: "Event Recap Highlight",
        format: "Video / Hình ảnh",
        tool: "CapCut, Premiere",
        description: "Tổng hợp các khoảnh khắc đáng chú ý nhất của sự kiện offline, nhịp điệu nhanh, thu hút.",
        type: "image",
        src: "assets/event-recap.png"
    }
];

// Logic hiển thị phần 03 (Slider tự động)
const track = document.getElementById('carousel-track');
let currentSlide = 0;

function renderSlide(index) {
    track.innerHTML = ''; // Xóa slide cũ
    const item = portfolioData[index];
    
    const slide = document.createElement('div');
    slide.className = 'slide';
    
    const mediaHtml = item.type === 'video' 
        ? `<video src="${item.src}" controls playsinline></video>`
        : `<img src="${item.src}" alt="${item.title}">`;

    slide.innerHTML = `
        <div class="slide-media">${mediaHtml}</div>
        <div class="slide-info">
            <span class="badge">${item.format}</span>
            <h3>${item.title}</h3>
            <p style="font-size: 0.9rem; color: #666; margin: 15px 0;">${item.description}</p>
            <p style="font-size: 0.85rem;"><strong>Công cụ:</strong> ${item.tool}</p>
            <a href="${item.src}" target="_blank" class="btn-primary mt-3" style="align-self: flex-start; font-size: 0.85rem; padding: 8px 15px;">Xem chi tiết ➔</a>
        </div>
    `;
    track.appendChild(slide);
}

// Khởi tạo slide đầu tiên
renderSlide(currentSlide);

// Nút bấm Next / Prev
document.getElementById('next-btn').onclick = () => {
    currentSlide = (currentSlide + 1) % portfolioData.length; // Chạy vòng lặp
    renderSlide(currentSlide);
};

document.getElementById('prev-btn').onclick = () => {
    currentSlide = (currentSlide - 1 + portfolioData.length) % portfolioData.length;
    renderSlide(currentSlide);
};
