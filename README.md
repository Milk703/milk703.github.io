# PHAN NHẬT TUẤN — Portfolio

Portfolio web tĩnh dành cho hồ sơ Content Marketing / Content Creator, triển khai trên GitHub Pages.

## Cấu trúc nội dung

- `index.html` — cấu trúc và nội dung giao diện.
- `style.css` — toàn bộ giao diện responsive, typography và hiệu ứng chuyển cảnh.
- `script.js` — menu mobile, scroll reveal và carousel dự án.
- `data/portfolio.json` — **danh sách tác phẩm**. Đây là nơi cập nhật tên, mô tả, định dạng, công cụ và đường dẫn của từng tác phẩm.
- `assets/` — hình ảnh, video và icon được website sử dụng.

## Cách 2 — cập nhật tác phẩm qua dữ liệu JSON

Để thêm một tác phẩm mới:

1. Upload file hình ảnh/video mới vào `assets/`.
2. Mở `data/portfolio.json`.
3. Thêm một object mới vào mảng `works`, ví dụ:

```json
{
  "title": "Tên tác phẩm",
  "category": "Social Content",
  "format": "Thiết kế Social",
  "tool": "Canva · Illustrator",
  "description": "Mô tả ngắn gọn về nội dung và vai trò của tác phẩm.",
  "type": "image",
  "src": "assets/ten-file.png",
  "link": "https://..."
}
```

Nếu là video đã upload vào `assets/`, đổi `type` thành `video`. Sau khi commit thay đổi lên `main`, GitHub Pages sẽ triển khai phiên bản mới.

## Nội dung hiện có

- 3 kênh Facebook GoldMax
- 2 kênh YouTube GoldMax
- 4 tác phẩm hình ảnh trong Selected Work
- Thông tin Content, Social, Video, Design, AI và quản lý nội dung
- Quy trình làm việc 5 bước
- Số điện thoại: 0559.810.191
- Email: tuannhat704@gmail.com

## Lưu ý

Đây là website tĩnh. Vì vậy, không có nút công khai nào trên website cho phép khách truy cập tự ghi file vào GitHub. Việc thêm tác phẩm theo Cách 2 được thực hiện bằng cách cập nhật `assets/` và `data/portfolio.json` trong repository, sau đó GitHub Pages tự triển khai lại.
