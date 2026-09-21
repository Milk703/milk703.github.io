# PHAN NHẬT TUẤN — Portfolio

Portfolio web tĩnh dành cho hồ sơ Content Marketing / Content Creator, triển khai trên GitHub Pages.

## Section 03 / Dự án & Sản phẩm nội dung

Section 03 được chia thành các **collection / grid độc lập**, theo đúng hướng portfolio video-editor:

1. Documentary
2. Bất động sản
3. Short / Drama Ads
4. GoldMax — YouTube
5. GoldMax — Facebook

### GoldMax đã được khôi phục

Toàn bộ **17 sản phẩm/liên kết GoldMax** trước đó đã được đưa trở lại:

- **10 video YouTube**
  - Topic 37: Appearance
  - Topic 11: Shopping / Mua Sắm
  - Topic 31: Health Problems
  - Kỹ Năng Giao Tiếp – Ứng Xử
  - Happy Birthday GoldMax English – 15 Years
  - Test Online – GoldMax English
  - Highlight trường tiểu học
  - Kỹ năng sống – Nội dung nổi bật
  - Video nổi bật – GoldMax English
  - Video nổi bật – GoldMax Bắc Giang

- **7 sản phẩm/link Facebook**
  - Rising Stars – Cuộc thi thuyết trình đỉnh cao
  - Ưu đãi khóa học GoldMax
  - Recap hoạt động & sự kiện
  - Series từ vựng tiếng Anh
  - Bài kiểm tra định kỳ – Video
  - Series từ vựng – Nội dung Facebook
  - Reels từ vựng tiếng Anh

### YouTube Shorts

Mục **Short / Drama Ads** hiện chứa 5 video YouTube Shorts, với mô tả tập trung vào pacing, rhythm, hook, retention và timing.

Mục **Documentary** có thêm 2 video YouTube Shorts mới.

Các nhóm được tách riêng để người xem dễ theo dõi từng hướng dựng và nội dung.

## Cấu trúc dữ liệu

- `index.html` — markup giao diện.
- `style.css` — layout, responsive, hover lift và glow.
- `script.js` — render collection/card và hiệu ứng tương tác.
- `data/portfolio.json` — dữ liệu project.
- `assets/` — media.

Mỗi project dùng trường `collection` để website tự đưa nội dung vào đúng grid.

Ví dụ:

```json
"collection": "documentary"
```

```json
"collection": "real-estate"
```

```json
"collection": "short-drama"
```


```json
"collection": "goldmax-youtube"
```

```json
"collection": "goldmax-facebook"
```

## Hiệu ứng

Mỗi collection được thiết kế như một khối portfolio riêng:

- nền tối riêng trong Section 03
- viền vàng accent
- glow chạy theo vị trí chuột
- nổi nhẹ khi hover
- shadow mở rộng khi hover
- thumbnail zoom
- card bên trong cũng có hover lift
- reveal animation khi scroll tới

Thiết kế tham khảo tinh thần portfolio video-editor mà bạn gửi, nhưng giữ hệ nhận diện hiện tại của portfolio Phan Nhật Tuấn.

## Cập nhật project

1. Upload asset vào `assets/`.
2. Thêm object vào `data/portfolio.json`.
3. Chọn đúng `collection`.
4. Commit lên `main`.

Không cần sửa HTML để thêm project mới.
