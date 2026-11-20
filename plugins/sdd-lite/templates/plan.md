---
id: "{{ID}}"
name: "{{Tên feature}}"
spec: spec.md
updated: {{YYYY-MM-DD}}
---

# Kế hoạch kỹ thuật · {{ID}} · {{Tên feature}}

<!-- Plan nói CÁCH LÀM. Mọi nội dung phải truy vết được về FR/BR/SC trong spec.md. Không viết code triển khai. Xoá mọi chú thích HTML khi điền. -->

## 1. Tóm tắt hướng tiếp cận
{{3–6 câu: giải pháp tổng thể và vì sao phù hợp với kiến trúc hiện có}}

## 2. Bối cảnh kỹ thuật

<!-- Lấy từ CLAUDE.md và docs/tech/architecture.md. Không tự đổi stack nếu không có quyết định ở mục 4. -->

| Hạng mục | Giá trị |
|---|---|
| Ngôn ngữ / framework | {{...}} |
| Lưu trữ | {{...}} |
| Kiểm thử | {{công cụ, lệnh chạy}} |
| Nền tảng chạy | {{...}} |
| Ràng buộc hiệu năng / bảo mật | {{... hoặc Không có}} |

## 3. Truy vết yêu cầu → thiết kế

| Yêu cầu | Thành phần / file chịu trách nhiệm | Cách đáp ứng |
|---|---|---|
| FR-001 | {{đường dẫn hoặc tên thành phần}} | {{1 câu}} |
| BR-... | {{...}} | {{...}} |

<!-- Mọi FR và mọi BR (Mới/Đổi) trong spec phải xuất hiện ít nhất một lần. -->

## 4. Quyết định kỹ thuật

<!-- Mỗi quyết định có ý nghĩa lâu dài: chọn thư viện, mô hình dữ liệu, cách tích hợp, ... Không có quyết định nào: ghi "Không áp dụng: dùng nguyên stack hiện có". -->

### 4.1. {{Tên quyết định}}
- **Quyết định:** {{...}}
- **Lý do:** {{...}}
- **Phương án đã cân nhắc:** {{phương án khác và vì sao không chọn}}

## 5. Thay đổi dữ liệu

| Thực thể (khái niệm) | Thay đổi | Chi tiết schema | Migration / dữ liệu cũ |
|---|---|---|---|
| {{...}} | {{Mới / Sửa / Xoá}} | {{bảng, cột, kiểu, ràng buộc, chỉ mục}} | {{cách xử lý dữ liệu hiện có}} |

## 6. Giao diện

<!-- API, lệnh CLI, sự kiện, màn hình. Chỉ ghi khi feature mở ra giao diện mới hoặc đổi giao diện cũ. Nếu không: "Không áp dụng: feature chỉ dùng nội bộ". -->

| Giao diện | Đầu vào | Đầu ra / lỗi | Yêu cầu liên quan |
|---|---|---|---|
| {{ví dụ POST /orders}} | {{...}} | {{...}} | {{FR-...}} |

## 7. Thay đổi mã nguồn

| Đường dẫn | Loại | Mục đích |
|---|---|---|
| {{src/...}} | {{Mới / Sửa}} | {{...}} |

## 8. Chiến lược kiểm thử

| Mục tiêu kiểm thử | Loại test | Phủ |
|---|---|---|
| {{quy tắc / kịch bản}} | {{Đơn vị / Tích hợp / E2E / Thủ công}} | {{KB-01, SC-001, BR-...}} |

<!-- Mọi SC và mọi KB phải được phủ. Logic nghiệp vụ nên có test đơn vị viết trước. -->

## 9. Kiểm tra theo nguyên tắc dự án

<!-- Đối chiếu với "Nguyên tắc" trong CLAUDE.md. Vi phạm có lý do chính đáng thì ghi rõ. -->

| Nguyên tắc | Đạt? | Ghi chú |
|---|---|---|
| {{...}} | {{Đạt / Vi phạm có lý do}} | {{...}} |

## 10. Rủi ro và phương án

| Rủi ro | Mức (Cao/Vừa/Thấp) | Phương án giảm thiểu |
|---|---|---|
| {{...}} | {{...}} | {{...}} |

## 11. Cách kiểm chứng nhanh

<!-- Các bước chạy thật để biết feature hoạt động. Chỉ lệnh và kết quả mong đợi, KHÔNG chứa code triển khai. -->

1. {{Chuẩn bị: lệnh cài đặt, dữ liệu mẫu}}
2. {{Thao tác}} → mong đợi: {{kết quả}}

## 12. Tài liệu cần cập nhật khi đồng bộ

<!-- /sync-domain dùng mục này làm danh sách việc. -->

| Tài liệu | Nội dung cần thêm hoặc đổi |
|---|---|
| docs/domain/rules.md | {{BR mới / đổi}} |
| docs/domain/entities.md | {{...}} |
| docs/tech/decisions.md | {{các quyết định ở mục 4}} |
| docs/tech/data-schema.md | {{...}} |
