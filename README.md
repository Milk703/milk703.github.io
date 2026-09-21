# PHAN NHẬT TUẤN — Portfolio

Portfolio web tĩnh dành cho hồ sơ Content Marketing / Content Creator, triển khai trên GitHub Pages.

## Cấu trúc nội dung

- `index.html` — cấu trúc và nội dung giao diện.
- `style.css` — giao diện responsive, typography, hover/tilt, reveal, theme và hiệu ứng ánh sáng.
- `script.js` — menu mobile, theme toggle, scroll UI và hệ thống render portfolio theo collection.
- `data/portfolio.json` — danh sách tác phẩm. Mỗi tác phẩm được gắn vào đúng collection.
- `assets/` — hình ảnh, video và icon.

## Section 03 / Dự án & Sản phẩm nội dung

Portfolio được tách thành các **collection độc lập**, lấy cảm hứng từ kiểu trình bày portfolio video có từng khối lớn riêng:

1. Documentary
2. Bất động sản
3. Short Drama
4. YouTube Kids
5. Reelshort Ads
6. YouTube
7. Social / Campaign

Mỗi collection có:
- tiêu đề riêng
- số lượng project riêng
- grid riêng
- vùng trạng thái trống riêng khi chưa có project
- hiệu ứng glow khi đưa chuột vào
- hiệu ứng nổi/lift khi hover
- ánh sáng chạy theo vị trí chuột
- reveal khi collection/card xuất hiện trong viewport

## Cách thêm layer vào từng collection

Bạn không cần sửa HTML thủ công.

Chỉ cần upload video/image vào `assets/`, sau đó thêm một object vào `data/portfolio.json` với đúng giá trị `collection`.

### Documentary

```json
{
  "title": "Tên documentary",
  "category": "Documentary",
  "platform": "YouTube",
  "format": "Documentary",
  "tool": "Premiere · After Effects",
  "description": "Mô tả ngắn về nội dung và vai trò.",
  "type": "youtube",
  "collection": "documentary",
  "youtubeId": "VIDEO_ID",
  "link": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### Bất động sản

```json
{
  "title": "Tên video bất động sản",
  "category": "Bất động sản",
  "platform": "YouTube",
  "format": "Real Estate Video",
  "tool": "Premiere · After Effects",
  "description": "Mô tả ngắn.",
  "type": "youtube",
  "collection": "real-estate",
  "youtubeId": "VIDEO_ID",
  "link": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### Short Drama

Dùng:

```json
"collection": "short-drama"
```

### YouTube Kids

Dùng:

```json
"collection": "youtube-kids"
```

### Reelshort Ads

Dùng:

```json
"collection": "reelshort-ads"
```

### YouTube

Dùng:

```json
"collection": "youtube"
```

### Social / Campaign

Dùng:

```json
"collection": "social"
```

## Hiệu ứng Section 03

Mỗi collection hoạt động như một khối portfolio riêng. Khi scroll tới collection, khối có ánh sáng nền nhẹ. Khi hover:

- border chuyển sang accent vàng
- shadow mở rộng
- toàn khối nhấc lên nhẹ
- radial glow bám theo vị trí con trỏ
- card bên trong cũng có hover lift và thumbnail zoom

Thiết kế này cố tình giữ tinh thần reference video-editor portfolio nhưng vẫn dùng hệ màu hiện tại của portfolio Phan Nhật Tuấn.

## Cập nhật tác phẩm

1. Upload asset vào `assets/` nếu cần.
2. Thêm object vào `data/portfolio.json`.
3. Gắn đúng `collection`.
4. Commit lên `main`.

GitHub Pages sẽ triển khai phiên bản mới theo cấu hình của repository.

## Lưu ý

Đây là website tĩnh. Không có chức năng public để khách truy cập tự ghi file vào GitHub. Việc thêm layer/project được thực hiện từ repository thông qua `assets/` và `data/portfolio.json`.
