// Tự động hóa Scroll Reveal (Xuất hiện khi cuộn)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(section => {
    observer.observe(section);
});

// ==========================================
// THÊM/SỬA DỰ ÁN Ở ĐÂY (Tự động cập nhật Web)
// ==========================================
const portfolioData = [
    {
        title: "Chiến dịch Mỹ phẩm Cok'lear",
        format: "Video Content & Plan",
        role: "Content Marketing",
        description: "Lên kế hoạch nội dung tuần và kịch bản video ngắn bắt trend, tối ưu chuyển đổi trực tiếp.",
        type: "image", // Điền 'video' nếu dùng file .mp4
        src: "assets/coklear-demo.jpg" // Đổi tên file tương ứng trong thư mục assets
    },
    {
        title: "Banner GoldMax English",
        format: "Thiết kế Social",
        role: "Trưởng phòng Truyền thông",
        description: "Thiết kế visual chương trình ưu đãi khùng, tập trung vào CTA và độ nhận diện thương hiệu.",
        type: "image",
        src: "assets/banner-goldmax.jpg"
    }
];

// Logic tự động render Carousel
const track = document.getElementById('carousel-track');
const dotsContainer = document.getElementById('dots-container');

portfolioData.forEach((item, index) => {
    // Tạo Slide
    const slide = document.createElement('div');
    slide.className = 'slide';
    const mediaHtml = item.type === 'video' 
        ? `<video src="${item.src}" autoplay muted loop playsinline></video>`
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

    // Tạo Dot
    const dot = document.createElement('div');
    dot.className = index === 0 ? 'dot active' : 'dot';
    dot.onclick = () => goToSlide(index);
    dotsContainer.appendChild(dot);
});

// Chuyển động Slider
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
