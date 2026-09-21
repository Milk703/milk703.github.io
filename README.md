# PHAN NHẬT TUẤN — Portfolio

Portfolio web tĩnh dành cho hồ sơ Content Marketing / Content Creator, triển khai trên GitHub Pages.

## Cấu trúc nội dung

- `index.html` — cấu trúc và nội dung giao diện.
- `style.css` — giao diện responsive, typography, hover/tilt, reveal, theme và các hiệu ứng micro-interaction.
- `script.js` — menu mobile, theme toggle, scroll UI và hệ thống render portfolio theo category/collection.
- `data/portfolio.json` — **danh sách tác phẩm**. Đây là nơi cập nhật tên, mô tả, category, collection, định dạng, công cụ và đường dẫn của từng tác phẩm.
- `assets/` — hình ảnh, video và icon được website sử dụng.

## Hệ thống Portfolio 03 / Dự án & Sản phẩm nội dung

Phần Selected Work được tổ chức theo nhóm để nhà tuyển dụng có thể lọc nhanh:

- Documentary
- Bất động sản
- Short-form
- YouTube Kids
- Reelshort Ads
- Social & Campaign
- Educational

Ngoài bộ lọc chính, **YouTube Kids** và **Reelshort Ads** có grid riêng ở phía dưới Section 03 để tách thành các collection chuyên biệt.

## Thêm video vào YouTube Kids / Reelshort Ads

Trong `data/portfolio.json`, thêm object mới vào mảng `works`.

Ví dụ cho YouTube Kids:

```json
{
  "title": "Tên video Kids",
  "category": "YouTube Kids",
  "platform": "YouTube",
  "format": "Kids Video",
  "tool": "Premiere · After Effects",
  "description": "Mô tả ngắn về vai trò và nội dung.",
  "type": "youtube",
  "collection": "youtube-kids",
  "youtubeId": "VIDEO_ID",
  "link": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

Ví dụ cho Reelshort Ads:

```json
{
  "title": "Tên Reelshort Ad",
  "category": "Reelshort Ads",
  "platform": "Reelshort",
  "format": "Vertical Ad",
  "tool": "Premiere · After Effects",
  "description": "Mô tả ngắn về format, hook hoặc mục tiêu creative.",
  "type": "external",
  "collection": "reelshort-ads",
  "externalLabel": "Reelshort Ad",
  "link": "https://..."
}
```

Với YouTube, giao diện tự lấy thumbnail từ YouTube. Với link ngoài, giao diện hiển thị card creative và nút mở nội dung gốc.

## Cách cập nhật tác phẩm nói chung

1. Upload file hình ảnh/video mới vào `assets/` nếu cần.
2. Mở `data/portfolio.json`.
3. Thêm một object mới vào mảng `works`.
4. Commit thay đổi lên `main`.

GitHub Pages sẽ triển khai phiên bản mới theo cấu hình của repository.

## Nội dung hiện có

- 3 kênh Facebook GoldMax
- 2 kênh YouTube GoldMax
- Các tác phẩm social/campaign
- Video YouTube giáo dục, thương hiệu và hoạt động
- Bộ lọc portfolio theo format/category
- Grid riêng cho YouTube Kids và Reelshort Ads sẵn sàng nhận nội dung mới
- Theme Light/Dark, scroll reveal, cursor glow và hover interactions
- Quy trình làm việc 5 bước
- Số điện thoại: 0559.810.191
- Email: tuannhat704@gmail.com

## Lưu ý

Đây là website tĩnh. Khách truy cập không thể tự ghi file vào GitHub từ giao diện public. Việc thêm tác phẩm được thực hiện bằng cách cập nhật `assets/` và `data/portfolio.json` trong repository, sau đó GitHub Pages triển khai lại.
