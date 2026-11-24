---
id: "{{ID}}"
name: "{{Tên feature}}"
status: draft
created: {{YYYY-MM-DD}}
updated: {{YYYY-MM-DD}}
---

# {{ID}} · {{Tên feature}}

<!-- Spec chỉ nói NGHIỆP VỤ: cái gì và vì sao. Không nhắc công nghệ. Xoá mọi chú thích HTML khi điền. -->

## 1. Bối cảnh và mục tiêu

### 1.1. Vấn đề
{{1–3 câu: người dùng đang gặp khó khăn gì, hiện tại xử lý thế nào}}

### 1.2. Mục tiêu
{{1–3 câu: sau feature này người dùng làm được gì, giá trị mang lại}}

### 1.3. Tác nhân
| Tác nhân | Vai trò trong feature này |
|---|---|
| {{Tên}} | {{Mô tả}} |

## 2. Phạm vi

### 2.1. Trong phạm vi
- {{...}}

### 2.2. Ngoài phạm vi
- {{...}}

## 3. Quy tắc nghiệp vụ liên quan

<!-- Đọc docs/domain/rules.md trước. Quy tắc mới dùng mã tạm BR-NEW-n; /sync-domain sẽ gán số thật. -->

| Mã | Hành động | Nội dung | Ghi chú |
|---|---|---|---|
| {{BR-012 hoặc BR-NEW-1}} | {{Mới / Đổi / Giữ nguyên}} | {{Nội dung quy tắc}} | {{Nếu Đổi: cũ → mới. Điều kiện, ngoại lệ}} |

## 4. Thực thể và thuật ngữ liên quan

| Tên | Loại | Ghi chú |
|---|---|---|
| {{Tên}} | {{Thực thể / Thuật ngữ}} | {{Đã có trong docs/domain hay mới; thuộc tính hoặc trạng thái đáng chú ý}} |

## 5. Yêu cầu chức năng

| Mã | Yêu cầu | Ưu tiên | Quy tắc liên quan |
|---|---|---|---|
| FR-001 | Hệ thống PHẢI {{hành vi kiểm chứng được}} | P1 | {{BR-...}} |

<!-- Ưu tiên: P1 = bắt buộc cho bản đầu, P2 = nên có, P3 = có thể để sau. -->

## 6. Kịch bản

### KB-01 · {{Tên kịch bản}} (P1)
- **Cho trước (Given):** {{trạng thái ban đầu}}
- **Khi (When):** {{hành động}}
- **Thì (Then):** {{kết quả quan sát được}}
- **Liên quan:** {{FR-001, BR-...}}

### Trường hợp biên và lỗi
| Mã | Tình huống | Hành vi mong đợi |
|---|---|---|
| KB-E1 | {{dữ liệu rỗng / trùng / vượt giới hạn / không đủ quyền / ...}} | {{...}} |

## 7. Tiêu chí hoàn thành

| Mã | Tiêu chí (đo hoặc quan sát được) | Cách kiểm tra |
|---|---|---|
| SC-001 | {{...}} | {{Test tự động / Lint, kiểu, build pass / Thủ công (chỉ khi không tự động hoá được)}} |

## 8. Giả định và ràng buộc
- {{Giả định: điều tạm coi là đúng khi chưa xác nhận}}
- {{Ràng buộc: pháp lý, quy định, tương thích, thời hạn, ...}}

## 9. Câu hỏi còn mở

<!-- Tối đa 5. Mỗi câu kèm đề xuất để người dùng chỉ cần trả lời "đồng ý". Không còn câu hỏi: ghi "Không còn". -->

| # | Câu hỏi | Đề xuất | Trạng thái |
|---|---|---|---|
| 1 | [CẦN LÀM RÕ: {{câu hỏi}}] | {{phương án đề xuất và lý do ngắn}} | Mở |

## 10. Lịch sử làm rõ

<!-- Mỗi câu hỏi đã trả lời chuyển xuống đây, theo ngày. Chưa có: ghi "Chưa có". -->

### {{YYYY-MM-DD}}
- Hỏi: {{...}} → Đáp: {{...}}
