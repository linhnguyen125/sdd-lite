# Kiến trúc · {{Tên dự án}}

> Tóm tắt: {{1–2 câu: kiến trúc tổng thể, công nghệ chính và nơi triển khai}}

<!-- Mỏng ở giai đoạn đầu, chỉ ghi điều đã chốt. Lớn dần qua /sync-domain. Chỉ ghi điều KHÔNG đọc ra được từ code: lý do, ràng buộc, bức tranh tổng thể. Xoá mọi chú thích HTML khi điền. -->

Cập nhật lần cuối: {{YYYY-MM-DD}}

## 1. Tổng quan
{{2–4 câu: hệ thống gồm những phần nào, giao tiếp ra sao}}

```
{{Sơ đồ ASCII đơn giản: thành phần và hướng dữ liệu}}
```

## 2. Công nghệ

| Hạng mục | Lựa chọn | Lý do | ADR |
|---|---|---|---|
| Ngôn ngữ / framework | {{...}} | {{...}} | {{ADR-0001}} |
| Lưu trữ | {{...}} | {{...}} | {{...}} |
| Kiểm thử | {{...}} | {{...}} | {{...}} |
| Triển khai | {{...}} | {{...}} | {{...}} |

## 3. Thành phần chính
| Thành phần | Trách nhiệm | Phụ thuộc | Hiện trạng |
|---|---|---|---|
| {{...}} | {{...}} | {{...}} | {{Đã có / Dự kiến}} |

## 4. Luồng dữ liệu chính
<!-- Chỉ mô tả như đang chạy phần đã xây; phần chưa xây ghi rõ "(Dự kiến)". -->
1. {{...}}

## 5. Cấu trúc thư mục mã nguồn
```
{{cây thư mục dự kiến hoặc hiện có}}
```

## 6. Môi trường và triển khai
{{Các môi trường (dev/prod), cách triển khai, cấu hình qua biến môi trường}}

## 7. Yêu cầu phi chức năng
| Hạng mục | Mục tiêu |
|---|---|
| Hiệu năng | {{... hoặc Chưa đặt ra}} |
| Bảo mật | {{...}} |
| Sao lưu / khôi phục | {{...}} |
