---
description: Lập kế hoạch kỹ thuật (plan.md) cho một feature theo ID
argument-hint: <ID>
disable-model-invocation: true
---

# /plan: Kế hoạch kỹ thuật

Đầu vào: $ARGUMENTS

**Vai trò: Solution Architect.** Biến spec thành thiết kế khả thi, bám kiến trúc và quy ước đang có. Cân nhắc phương án thay thế, nêu đánh đổi và rủi ro (hiệu năng, bảo mật, dữ liệu, tương thích ngược), ưu tiên giải pháp đơn giản nhất đáp ứng đủ spec. Không đổi nghiệp vụ và không thêm tính năng ngoài spec; thấy spec sai thì báo, không tự sửa.

Nhiệm vụ: tạo `specs/<ID>/plan.md` trả lời "làm bằng cách nào". **Không viết code triển khai.**

## Bước 1. Chuẩn bị

1. Đọc `${CLAUDE_PLUGIN_ROOT}/reference/conventions.md` và tuân theo toàn bộ.
2. Lấy **ID** từ `$ARGUMENTS` và tìm feature bằng `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" get <ID>` (mục 3.2 của `conventions.md`). Không có ID: dừng, hiển thị `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" list --table`, yêu cầu chạy lại `/plan <ID>`.
3. Kiểm tra điều kiện:
   - `spec.md` phải tồn tại.
   - `status` là `cancelled` hoặc `done`: dừng, giải thích.
   - Spec còn marker `[CẦN LÀM RÕ]` hoặc mục 9 còn câu hỏi trạng thái "Mở": **dừng**, liệt kê các câu, hướng dẫn trả lời bằng `/spec <ID> <trả lời>`.
   - `status` là `draft` và hết câu hỏi mở: coi lệnh `/plan` là việc chốt spec; sẽ đặt `approved` ở bước 6.
4. Nếu `plan.md` đã tồn tại: đọc, **cập nhật** chứ không viết lại từ đầu những phần vẫn đúng; ghi rõ trong báo cáo phần nào đã đổi. Nếu `tasks.md` đã tồn tại, nhắc chạy lại `/task <ID>` sau khi plan đổi.

## Bước 2. Nạp ngữ cảnh

Đọc đầy đủ `spec.md` của feature và `CLAUDE.md`. Với `docs/`: theo **giao thức đọc docs** (mục 9 của `conventions.md`): đọc `docs/INDEX.md`, rồi chỉ đọc phần liên quan của `docs/tech/*` (kiến trúc, các ADR liên quan, schema, API) và các quy tắc/thực thể/luồng trong `docs/domain/` mà spec nhắc tới.

Nếu dự án đã có code: dùng Glob/Grep để tìm mô-đun, mẫu code, quy ước đặt tên và cách viết test hiện có. **Bám theo cái đã có**; không tự ý đổi kiến trúc.

## Bước 3. Nghiên cứu điểm chưa chắc

Với mỗi lựa chọn kỹ thuật chưa rõ (thư viện, cách lưu, cách tích hợp):
- Ưu tiên phương án đã dùng trong dự án; sau đó thư viện chuẩn của stack; sau cùng mới thêm phụ thuộc mới.
- Khi cần tra cứu tài liệu hoặc phiên bản, dùng công cụ tra cứu có sẵn (tài liệu chính thức, WebSearch) thay vì nhớ từ trí nhớ. Không bịa tên API hay số phiên bản.
- Ghi kết quả thành quyết định ở mục 4 của plan: quyết định, lý do, phương án đã cân nhắc.

## Bước 4. Viết plan

Đọc `${CLAUDE_PLUGIN_ROOT}/templates/plan.md`, điền **tất cả 12 mục**, ghi vào `specs/<ID>/plan.md`.

Ràng buộc:
- Mục 3 (truy vết): **mọi FR và mọi BR Mới/Đổi** trong spec phải có dòng tương ứng.
- Mục 8 (kiểm thử): **mọi SC và KB** phải được phủ; logic nghiệp vụ có test đơn vị.
- Mục 9: đối chiếu từng nguyên tắc trong `CLAUDE.md`. Vi phạm không có lý do chính đáng: sửa thiết kế, không biện minh.
- Mục 6 chỉ điền khi có giao diện mới/đổi; không thì ghi `Không áp dụng: <lý do>`.
- Mục 11 chỉ liệt kê bước chạy và kết quả mong đợi, **không** chứa code triển khai.
- Mục 12 liệt kê đủ tài liệu `/sync-domain` sẽ phải cập nhật.
- Không thêm tính năng ngoài spec. Phát hiện spec thiếu hoặc sai: không tự sửa, ghi vào báo cáo và đề xuất `/spec <ID> ...`.

## Bước 5. Tự kiểm tra

- [ ] Đủ 12 mục đúng thứ tự, không còn `{{` hay chú thích HTML.
- [ ] Bảng truy vết phủ 100% FR và BR Mới/Đổi.
- [ ] Bảng kiểm thử phủ 100% SC và KB.
- [ ] Mọi quyết định ở mục 4 có phương án thay thế.
- [ ] Không có đoạn code triển khai.

## Bước 6. Cập nhật trạng thái

- Nếu `status` đang `draft`: chạy `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" set <ID> --status approved` (công cụ tự cập nhật bảng ánh xạ và frontmatter `spec.md`).
- **Chưa** sửa `docs/` (việc đó thuộc `/sync-domain` sau khi triển khai).

## Bước 7. Báo cáo

1. Feature `<ID> · <Tên>`, đường dẫn `plan.md`.
2. Hướng tiếp cận 3–5 dòng; các quyết định chính; phụ thuộc mới (nếu có).
3. Rủi ro đáng chú ý.
4. Vấn đề phát hiện ở spec (nếu có).
5. **Dòng cuối cùng** là thông báo bước tiếp theo theo mục 10 của `conventions.md`: `/task <ID>`; nếu spec có vấn đề cần sửa trước thì `/spec <ID> <chỉnh sửa>`.
