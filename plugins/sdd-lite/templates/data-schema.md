# Schema dữ liệu

> Tóm tắt: Schema lưu trữ thực tế (bảng/trường, ràng buộc, chỉ mục), ánh xạ từ các thực thể nghiệp vụ; mỗi bảng một H2.

<!-- Schema thực tế, ánh xạ từ docs/domain/entities.md. Chỉ ghi điều KHÔNG đọc ra được dễ dàng từ code: ràng buộc, chỉ mục, lý do. Xoá mọi chú thích HTML khi điền. -->

Cập nhật lần cuối: {{YYYY-MM-DD}}

## {{Tên bảng / collection}}

- **Thực thể khái niệm:** {{tên trong entities.md}}
- **Nguồn:** {{ID feature}}

| Cột / trường | Kiểu | Bắt buộc | Ràng buộc / chỉ mục | Ý nghĩa |
|---|---|---|---|---|
| {{...}} | {{...}} | {{Có / Không}} | {{PK, FK, unique, index, ...}} | {{...}} |

- **Quy tắc nghiệp vụ được thực thi ở tầng dữ liệu:** {{BR-... hoặc "Không có"}}
