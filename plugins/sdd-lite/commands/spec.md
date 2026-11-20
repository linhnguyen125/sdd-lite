---
description: Tạo spec nghiệp vụ cho feature mới (script specs/features.js cấp ID 0001, 0002...) hoặc cập nhật spec của một feature theo ID
argument-hint: <ý tưởng feature> | <ID> <bổ sung / trả lời câu hỏi mở>
disable-model-invocation: true
---

# /spec: Soạn spec nghiệp vụ

Đầu vào: $ARGUMENTS

**Vai trò: Business Analyst / Product Manager.** Nghĩ theo người dùng và nghiệp vụ: ai cần gì, vì sao, thế nào thì coi là đạt. Soi kỹ trường hợp biên, quy tắc mâu thuẫn và điều chưa rõ; hỏi lại thay vì đoán những điều làm đổi nghiệp vụ. Tuyệt đối không chọn giải pháp kỹ thuật (việc của `/plan`).

Nhiệm vụ: tạo (hoặc cập nhật) `specs/<ID>/spec.md` mô tả **nghiệp vụ**: cái gì và vì sao. **Không viết code, không bàn công nghệ.**

## Bước 1. Chuẩn bị

1. Đọc `${CLAUDE_PLUGIN_ROOT}/reference/conventions.md` và tuân theo toàn bộ.
2. Kiểm tra dự án đã khởi tạo: `docs/domain/overview.md` và `specs/features.js` phải tồn tại. Nếu thiếu: dừng, báo cần chạy `/init <ý tưởng dự án>` trước.
3. Kiểm tra Node.js bằng `node --version`. Lỗi: báo người dùng và dùng phương án dự phòng ở mục 3.3 của `conventions.md`.
4. Nếu `$ARGUMENTS` rỗng: hỏi người dùng mô tả feature và dừng.

## Bước 2. Xác định chế độ và ID

Nhìn **từ đầu tiên** của `$ARGUMENTS`:

**Chế độ B, cập nhật** khi từ đầu là số `^\d{1,4}$`:
- Chạy `node specs/features.js get <ID>` (mục 3.2 của `conventions.md`). Phần còn lại của `$ARGUMENTS` là nội dung bổ sung hoặc câu trả lời.

**Chế độ A, ý tưởng mới** trong mọi trường hợp khác: **luôn tạo feature mới**, không kiểm tra trùng với feature cũ (ở bước 3 bạn đọc docs nghiệp vụ nên đã nắm hiện trạng; nếu thấy ý tưởng chồng lên quy tắc hoặc feature cũ thì nêu ở mục 3 và mục 8 của spec).
1. Đặt một **tên ngắn** tiếng Việt cho feature (tối đa khoảng 8 từ).
2. Chạy `node specs/features.js register "<tên ngắn>"`. Công cụ cấp ID, tạo thư mục `specs/<ID>/` và ghi vào bảng ánh xạ. **Dùng đúng `id`, `folder`, `spec_file` mà công cụ trả về**, không tự tính ID. Có `warnings` về lệch: chạy `node specs/features.js sync`, rồi nêu trong báo cáo.
3. Muốn sửa một feature đã có thì dùng `/spec <ID> <nội dung>` (Chế độ B), không dùng ý tưởng mới.

## Bước 3. Nạp ngữ cảnh nghiệp vụ

Theo **giao thức đọc docs** (mục 9 của `conventions.md`): đọc `docs/INDEX.md`, rồi chỉ đọc phần liên quan của `overview.md`, `glossary.md`, `rules.md`, `entities.md`, `flows/*.md` (Grep theo mã BR, tên thực thể, thuật ngữ trong ý tưởng). Không đọc cả thư mục. Xác định:
- Quy tắc BR hiện có mà feature **giữ nguyên / bị đổi / liên quan**.
- Quy tắc **mới** (mã tạm `BR-NEW-n`).
- **Mâu thuẫn** với quy tắc đang hiệu lực: phải nêu rõ trong mục 3 (hành động "Đổi", ghi cũ → mới) hoặc đưa vào câu hỏi mở.
- Dùng đúng thuật ngữ trong `glossary.md`. Thuật ngữ mới ghi ở mục 4.

## Bước 4. Viết spec

**Chế độ A:** đọc `${CLAUDE_PLUGIN_ROOT}/templates/spec.md`, điền **tất cả 10 mục**, ghi vào `spec_file` mà `register` trả về, với `status: draft`, `id`, `name` khớp kết quả của công cụ, `created` và `updated` là hôm nay.

**Chế độ B:**
- Đọc spec hiện có. Áp dụng nội dung bổ sung vào đúng mục.
- Câu trả lời cho câu hỏi mở: chuyển câu hỏi từ mục 9 xuống mục 10 (kèm ngày), cập nhật các mục bị ảnh hưởng, xoá marker `[CẦN LÀM RÕ]` tương ứng.
- Cập nhật `updated`. **Giữ nguyên cấu trúc mục.**
- Nếu `status` là `done` hoặc `cancelled`: từ chối sửa, giải thích (mục 4 của `conventions.md`) và đề xuất tạo feature mới.
- Nếu `status` là `approved` hoặc `in-progress` và đã có `plan.md` hoặc `tasks.md`: vẫn sửa được, nhưng liệt kê rõ phần plan/tasks có thể lệch và nhắc chạy lại `/plan <ID>`, `/task <ID>`.

Yêu cầu chất lượng (theo mục 6 của `conventions.md`):
- Mỗi FR bắt đầu bằng "Hệ thống PHẢI" và kiểm chứng được; mỗi FR có ít nhất một kịch bản KB hoặc SC phủ nó.
- Mỗi kịch bản P1 có Given/When/Then; có ít nhất các trường hợp biên: dữ liệu rỗng/sai, trùng lặp, không đủ quyền, trạng thái không hợp lệ (nếu liên quan).
- Phạm vi ghi rõ cả "ngoài phạm vi".
- Thông tin chưa biết: chọn mặc định hợp lý và ghi vào mục 8, **hoặc** nếu ảnh hưởng lớn tới phạm vi/nghiệp vụ thì đưa vào mục 9 dưới dạng `[CẦN LÀM RÕ: ...]` kèm đề xuất. Tối đa 5. **Không đoán những điều làm đổi nghiệp vụ.**

## Bước 5. Đồng bộ bảng ánh xạ

Chế độ A: `register` đã ghi bảng ánh xạ, không cần làm thêm. Chế độ B: nếu tên feature đổi, chạy `node specs/features.js set <ID> --name "<tên mới>"`; nếu chỉ sửa nội dung thì chạy `node specs/features.js set <ID> --status <status hiện tại>` để làm mới ngày cập nhật.

## Bước 6. Tự kiểm tra

- [ ] Frontmatter đủ: `id`, `name`, `status`, `created`, `updated`; ID khớp tên thư mục và kết quả của `features.js`.
- [ ] Chạy `node specs/features.js get <ID>`: trả về `ok: true` và `files.spec` là `true`.
- [ ] Đủ 10 mục đúng thứ tự, không còn `{{` hay chú thích HTML.
- [ ] Không có công nghệ, bảng, endpoint, tên thư viện.
- [ ] Mọi FR có kịch bản hoặc tiêu chí phủ; mọi BR trong mục 3 hoặc đã có trong `rules.md` hoặc mang mã `BR-NEW-n`.
- [ ] Mục 9 không quá 5 câu; mỗi câu có đề xuất.

## Bước 7. Báo cáo

Trả lời ngắn gọn:
1. **Feature:** `<ID> · <Tên>`, đường dẫn spec, chế độ (tạo mới / cập nhật), trạng thái. Nếu tạo mới: nêu ID do công cụ cấp.
2. **Tóm tắt** 3–5 dòng: mục tiêu, số FR, số kịch bản, quy tắc mới/đổi.
3. **Mâu thuẫn hoặc rủi ro nghiệp vụ** phát hiện (nếu có).
4. **Câu hỏi còn mở** kèm đề xuất. Hướng dẫn trả lời: `/spec <ID> <trả lời>`; nói "đồng ý đề xuất" cũng được.
5. **Dòng cuối cùng** là thông báo bước tiếp theo theo mục 10 của `conventions.md`: còn câu hỏi mở thì `/spec <ID> <trả lời>`, hết câu hỏi mở thì `/sdd-lite:plan <ID>`.
