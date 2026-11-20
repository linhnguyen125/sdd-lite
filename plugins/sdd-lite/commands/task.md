---
description: Sinh danh sách công việc (tasks.md) từ plan của một feature theo ID
argument-hint: <ID>
disable-model-invocation: true
---

# /task: Danh sách công việc

Đầu vào: $ARGUMENTS

**Vai trò: Tech Lead.** Chia plan thành các việc nhỏ, độc lập, đúng thứ tự phụ thuộc, mỗi việc làm xong và kiểm chứng được trong một lượt. Quan tâm đến thứ tự rủi ro cao làm sớm, test đi trước triển khai, và không sót FR hay SC nào. Không thiết kế lại và không thêm việc ngoài plan.

Nhiệm vụ: tạo `specs/<ID>/tasks.md` chia plan thành các công việc nhỏ, có thứ tự, truy vết được. **Không viết code.**

## Bước 1. Chuẩn bị

1. Đọc `${CLAUDE_PLUGIN_ROOT}/reference/conventions.md` và tuân theo toàn bộ.
2. Lấy **ID** từ `$ARGUMENTS`, tìm feature bằng `node specs/features.js get <ID>` (mục 3.2 của `conventions.md`). Không có ID: dừng, hiển thị `node specs/features.js list --table`, yêu cầu chạy lại `/task <ID>`.
3. Điều kiện: `spec.md` và `plan.md` phải tồn tại; thiếu `plan.md` thì dừng và nhắc `/plan <ID>`. `status` là `done` hoặc `cancelled`: dừng.
4. Đọc `spec.md`, `plan.md`, `CLAUDE.md`.

## Bước 2. Nếu tasks.md đã tồn tại

Đọc và **giữ nguyên trạng thái** các công việc đã `[x]`. Chỉ thêm, sửa hoặc xoá công việc chưa làm cho khớp plan mới. Công việc đã xong nhưng không còn khớp plan thì để nguyên và ghi chú vào mục "Phát sinh trong lúc triển khai". Báo cáo cuối nêu rõ đã thêm/sửa/xoá gì. Không bao giờ bỏ tick của công việc đã xong.

## Bước 3. Sinh công việc

Đọc `${CLAUDE_PLUGIN_ROOT}/templates/tasks.md`, điền đầy đủ, ghi vào `specs/<ID>/tasks.md`.

Quy tắc:
- Mã `T001` tăng dần liên tục trong feature, không đánh lại khi cập nhật (công việc mới lấy số tiếp theo).
- Mỗi công việc: một hành động rõ ràng, làm xong trong một lượt, có **đường dẫn file cụ thể** và thẻ truy vết `[FR-...]`/`[KB-..]`/`[BR-...]`.
- Phase 3 chia theo kịch bản P1 trước, rồi P2, P3. Trong mỗi nhóm: **test viết trước**, sau đó mới tới triển khai. Mỗi nhóm có Mục tiêu, Kiểm chứng độc lập và Checkpoint.
- Phase 2 chỉ chứa việc chặn mọi kịch bản (migration, mô hình dùng chung). Không có thì ghi `Không áp dụng`.
- Phase 4 luôn có: chạy toàn bộ test/lint/kiểm tra kiểu (dùng lệnh trong `CLAUDE.md`), chạy "Cách kiểm chứng nhanh" của plan và đối chiếu từng SC, rà soát bảo mật/xử lý lỗi.
- Bảng "Độ phủ": **mọi FR** có công việc triển khai và công việc kiểm thử; **mọi SC** có công việc kiểm chứng. Thiếu thì thêm công việc.
- Chỉ bám plan. Việc ngoài plan không thêm vào đây.
- Cập nhật dòng "Tiến độ": `Hoàn thành: X/Y công việc.`

## Bước 4. Tự kiểm tra

- [ ] Không còn `{{` hay chú thích HTML; mã `Tnnn` liên tục, không trùng.
- [ ] Mọi công việc có đường dẫn (trừ công việc chạy lệnh) và thẻ truy vết.
- [ ] Bảng độ phủ đầy đủ, không FR hay SC nào bị bỏ sót.
- [ ] Trong mỗi nhóm kịch bản, công việc test đứng trước công việc triển khai.

## Bước 5. Báo cáo

1. Feature `<ID> · <Tên>`, đường dẫn `tasks.md`.
2. Số công việc theo phase, các checkpoint chính.
3. Phần nào thay đổi so với bản trước (nếu là cập nhật).
4. Bước tiếp: `/implement <ID>`.
