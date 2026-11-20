---
id: "{{ID}}"
name: "{{Tên feature}}"
plan: plan.md
updated: {{YYYY-MM-DD}}
---

# Công việc · {{ID}} · {{Tên feature}}

<!-- Mỗi công việc nhỏ, làm xong trong một lượt, có đường dẫn file cụ thể. Xoá mọi chú thích HTML khi điền. -->

**Quy ước:** `- [ ]` chưa làm, `- [x]` đã xong. Định dạng: `- [ ] T001 [FR-001] Mô tả — đường dẫn file`. Dấu `[P]` sau mã công việc nghĩa là có thể làm song song với công việc khác không phụ thuộc.

## Phase 1: Chuẩn bị
- [ ] T001 {{Cấu hình, thư mục, phụ thuộc cần thiết}} — `{{đường dẫn}}`

**Checkpoint:** {{điều kiện để sang phase 2}}

## Phase 2: Nền tảng

<!-- Việc chặn mọi kịch bản phía sau: dữ liệu, migration, mô hình dùng chung. Không có: ghi "Không áp dụng". -->

- [ ] T002 [FR-...] {{...}} — `{{đường dẫn}}`

**Checkpoint:** {{...}}

## Phase 3: Triển khai theo kịch bản

<!-- Mỗi kịch bản P1 một nhóm, theo thứ tự ưu tiên. Test viết trước và phải thất bại, rồi mới viết code. -->

### KB-01 · {{Tên kịch bản}}
**Mục tiêu:** {{...}}
**Kiểm chứng độc lập:** {{cách chạy riêng kịch bản này}}

- [ ] T003 [KB-01] Viết test: {{...}} — `{{đường dẫn test}}`
- [ ] T004 [FR-001] {{Triển khai}} — `{{đường dẫn}}`

**Checkpoint:** {{KB-01 chạy được từ đầu đến cuối}}

## Phase 4: Hoàn thiện
- [ ] T0nn Chạy toàn bộ test, lint và kiểm tra kiểu; sửa lỗi phát sinh
- [ ] T0nn Chạy "Cách kiểm chứng nhanh" trong plan.md và đối chiếu từng SC trong spec.md
- [ ] T0nn Rà soát bảo mật, xử lý lỗi, dữ liệu đầu vào cho phần đã viết

## Phụ thuộc và thứ tự
- {{Phase 2 phải xong trước Phase 3. T004 phụ thuộc T003...}}

## Độ phủ

| Yêu cầu | Công việc triển khai | Công việc kiểm thử |
|---|---|---|
| FR-001 | T004 | T003 |

<!-- Mọi FR có ít nhất một công việc triển khai và một công việc kiểm thử. Mọi SC có công việc kiểm chứng. -->

## Phát sinh trong lúc triển khai

<!-- /implement ghi việc ngoài kế hoạch vào đây. Chưa có: ghi "Chưa có". -->

## Tiến độ
Hoàn thành: {{0}}/{{tổng}} công việc.
