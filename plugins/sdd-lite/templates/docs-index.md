# Bản đồ tài liệu

<!-- Mục lục cho AI và người. Chỉ một dòng cho mỗi mục, không chép nội dung. Xoá mọi chú thích HTML khi điền. -->

Cập nhật lần cuối: {{YYYY-MM-DD}}

## 1. Cách dùng
1. Đọc file này trước. Chỉ mở file hoặc mục khi cột "Đọc khi" khớp nhiệm vụ.
2. Tìm theo mã bằng Grep (`BR-012`, `ADR-0003`, tên thực thể) rồi đọc đoạn quanh kết quả, không đọc cả file.
3. Quy chuẩn viết và cập nhật tài liệu: xem mục 8 và 9 của `reference/conventions.md` trong plugin SDD Lite.
4. Danh mục feature: `specs/features.json` (bảng ánh xạ ID ↔ tên).

## 2. Tài liệu

| Đường dẫn | Nội dung | Đọc khi |
|---|---|---|
| `CLAUDE.md` | Công nghệ, lệnh chạy, quy ước code, nguyên tắc dự án | Luôn đọc khi viết hoặc sửa code |
| `docs/domain/overview.md` | Vấn đề, người dùng, phạm vi bản đầu, hướng tính năng | Bắt đầu feature mới, cần hiểu bức tranh tổng thể |
| `docs/domain/glossary.md` | Định nghĩa thuật ngữ | Gặp thuật ngữ chưa rõ, viết spec mới |
| `docs/domain/rules.md` | Quy tắc nghiệp vụ `BR-nnn` | Spec chạm tới một quy tắc hoặc nhóm quy tắc |
| `docs/domain/entities.md` | Thực thể ở mức khái niệm | Spec nhắc tới dữ liệu, trạng thái, quan hệ |
| `docs/domain/flows/<slug>.md` | Luồng nghiệp vụ nhiều bước | Feature thuộc luồng đó |
| `docs/tech/architecture.md` | Kiến trúc, công nghệ, thành phần | Lập plan, thêm thành phần mới |
| `docs/tech/decisions.md` | Quyết định kỹ thuật `ADR-nnnn` | Trước khi chọn thư viện hoặc cách làm |
| `docs/tech/data-schema.md` | Schema dữ liệu thực tế | Đụng tới lưu trữ, migration |
| `docs/tech/api.md` | Giao diện công khai | Thêm hoặc đổi API, CLI, sự kiện |
| `specs/features.json` | Bảng ánh xạ ID ↔ tên feature, trạng thái | Tìm feature theo ID hoặc chủ đề; cấp ID mới |

<!-- Chỉ liệt kê file thực sự đang tồn tại. -->

## 3. Quy tắc nghiệp vụ (`docs/domain/rules.md`)

| Nhóm (H2) | Dải mã | Nội dung |
|---|---|---|
| {{Tên nhóm}} | {{BR-001–BR-005}} | {{1 dòng}} |

## 4. Thực thể (`docs/domain/entities.md`)

| Thực thể (H2) | Nội dung | Quy tắc liên quan |
|---|---|---|
| {{Tên}} | {{1 dòng}} | {{BR-...}} |

## 5. Luồng (`docs/domain/flows/`)
<!-- Chưa có file luồng nào: giữ đầu bảng, KHÔNG thêm dòng giữ chỗ kiểu "Chưa có luồng nào". -->

| File | Mục đích | Thực thể / quy tắc chính |
|---|---|---|
| {{ten-luong.md}} | {{1 dòng}} | {{...}} |

## 6. Quyết định kỹ thuật (`docs/tech/decisions.md`)

| Mã | Tiêu đề | Trạng thái |
|---|---|---|
| {{ADR-0001}} | {{...}} | {{Đề xuất / Hiệu lực / Đã thay thế bởi ...}} |
