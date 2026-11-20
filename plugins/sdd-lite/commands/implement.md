---
description: Thực thi các công việc trong tasks.md của một feature theo ID (test trước, tick từng việc)
argument-hint: <ID> [T003 | T003-T006 | phase 3]
disable-model-invocation: true
---

# /implement: Triển khai

Đầu vào: $ARGUMENTS

**Vai trò: Senior Developer.** Làm đúng việc được giao, theo TDD, code tối thiểu, sạch, bám quy ước của dự án. Không tự quyết nghiệp vụ hay kiến trúc; gặp chỗ spec/plan thiếu hoặc sai thì dừng và báo. Cuối lượt, mã nguồn được một reviewer độc lập kiểm tra (Bước 4).

Nhiệm vụ: viết code theo `tasks.md`, từng công việc một, đúng thứ tự, và đánh dấu tiến độ.

## Bước 1. Chuẩn bị

1. Đọc `${CLAUDE_PLUGIN_ROOT}/reference/conventions.md` và tuân theo toàn bộ.
2. Lấy **ID** là từ đầu tiên của `$ARGUMENTS`, tìm feature bằng `node specs/features.js get <ID>` (mục 3.2 của `conventions.md`). Không có ID: dừng, hiển thị `node specs/features.js list --table`.
3. Điều kiện: `spec.md`, `plan.md`, `tasks.md` phải tồn tại; thiếu thì dừng và chỉ đúng lệnh cần chạy (`/plan`, `/task`). `status` là `done` hoặc `cancelled`: dừng.
4. Phạm vi chạy (phần còn lại của `$ARGUMENTS`):
   - Không có: chạy mọi công việc chưa `[x]`, theo thứ tự.
   - `T003` hoặc `T003-T006`: chỉ các công việc đó.
   - `phase N`: chỉ phase đó.
5. Đọc `spec.md`, `plan.md`, `tasks.md`, `CLAUDE.md` (lệnh test/lint, quy ước, nguyên tắc). Đọc các file mã nguồn mà công việc sẽ đụng tới. Cần tra nghiệp vụ hoặc kỹ thuật ngoài spec/plan (ví dụ nội dung một `BR-nnn`, một ADR): theo giao thức đọc docs (mục 9 của `conventions.md`), dùng `docs/INDEX.md` và Grep, không đọc cả `docs/`.
6. Nếu `status` đang là `approved`: chạy `node specs/features.js set <ID> --status in-progress`.

## Bước 2. Vòng lặp từng công việc

Với mỗi công việc chưa xong, theo thứ tự trong `tasks.md`:

1. **Kiểm tra phụ thuộc:** các công việc nó phụ thuộc đã `[x]` chưa. Chưa thì làm việc đó trước hoặc dừng và báo.
2. **Công việc viết test:** viết test theo kịch bản/FR liên quan, chạy và **xác nhận test thất bại đúng lý do** (chưa có triển khai), không phải lỗi cú pháp.
3. **Công việc triển khai:** viết **lượng code tối thiểu** để test pass, bám plan (mục 3, 5, 6, 7). Chạy lại test để xác nhận pass. Sau đó dọn gọn nếu cần, test vẫn pass.
4. **Công việc cấu hình/khác:** làm đúng mô tả, kiểm tra bằng cách chạy lệnh liên quan.
5. **Tick ngay** `- [ ]` → `- [x]` trong `tasks.md` khi xong, cập nhật dòng "Tiến độ" và `updated`.
6. Tới **Checkpoint**: chạy lệnh kiểm chứng của checkpoint (test của kịch bản, lệnh trong `CLAUDE.md`); chỉ đi tiếp khi pass.

Quy tắc code: theo quy ước và nguyên tắc trong `CLAUDE.md`; xử lý lỗi rõ ràng; kiểm tra dữ liệu đầu vào ở biên hệ thống; không đưa bí mật vào mã; không để code debug; ưu tiên tạo bản mới thay vì sửa đổi trạng thái chung khi hợp lý.

## Bước 3. Khi gặp vấn đề

- **Test thất bại không sửa được sau vài lần thử có cơ sở:** dừng, báo nguyên nhân nghi ngờ, không làm yếu test để cho qua.
- **Spec hoặc plan thiếu, mâu thuẫn, hoặc sai:** **dừng**, không tự đoán nghiệp vụ. Báo rõ chỗ nào, đề xuất `/spec <ID> ...` hoặc `/plan <ID>`.
- **Cần việc ngoài kế hoạch** (ví dụ phát hiện thiếu một bước): thêm vào mục "Phát sinh trong lúc triển khai" của `tasks.md` dưới dạng công việc mới (mã `T` tiếp theo), làm nếu nhỏ và cần thiết cho feature, và nêu trong báo cáo. Không mở rộng phạm vi nghiệp vụ.
- Không commit git trừ khi người dùng yêu cầu.

## Bước 4. Review độc lập

Chạy khi lượt này đã hoàn thành ít nhất một công việc **triển khai** (không chỉ công việc test hoặc cấu hình). Bỏ qua nếu bị dừng giữa chừng vì vấn đề ở Bước 3, và ghi rõ trong báo cáo là chưa review.

1. Chạy toàn bộ test, lint, kiểm tra kiểu theo `CLAUDE.md` **trước**; chỉ review khi chúng pass (hoặc nêu rõ cái nào đang hỏng).
2. Gọi agent `code-reviewer` bằng công cụ Agent (`subagent_type: "sdd-lite:code-reviewer"`; nếu không gọi được theo tên đó, dùng agent đa dụng với cùng nhiệm vụ). Prompt phải chứa: đường dẫn `spec.md`, `plan.md`, `tasks.md`, `CLAUDE.md`; danh sách file đã tạo/sửa; các mã `Tnnn` đã làm trong lượt. Agent chỉ đọc, không sửa file.
3. Xử lý kết quả:
   - **CRITICAL/HIGH về code:** sửa trong lượt này (giữ TDD: thêm hoặc chỉnh test trước nếu là lỗi hành vi), chạy lại test, rồi gọi reviewer **thêm một lần** để xác nhận. Tối đa **2 vòng review**; còn tồn đọng thì ghi vào báo cáo và mục "Phát sinh trong lúc triển khai" của `tasks.md`.
   - **MEDIUM/LOW:** sửa nếu nhỏ và nằm trong phạm vi công việc; còn lại ghi vào báo cáo. Không mở rộng phạm vi.
   - **"Vấn đề ở spec/plan":** không tự sửa; đề xuất `/spec <ID> ...` hoặc `/plan <ID>`.
   - Reviewer có thể sai: kiểm chứng phát hiện trong code trước khi sửa; bác bỏ thì nêu lý do ngắn trong báo cáo.

## Bước 5. Tự kiểm tra khi kết thúc phiên

- [ ] Mọi công việc đã làm đều được tick; không tick công việc chưa làm xong hoặc chưa có bằng chứng chạy.
- [ ] Chạy lại toàn bộ test, lint, kiểm tra kiểu theo `CLAUDE.md` (sau khi sửa theo review); ghi rõ kết quả thật (pass/fail, số lượng).
- [ ] Không còn code debug, TODO bỏ lửng, bí mật trong mã.
- [ ] Không còn phát hiện CRITICAL/HIGH chưa xử lý mà chưa báo.

## Bước 6. Báo cáo

1. Feature `<ID> · <Tên>`, tiến độ `X/Y`.
2. Công việc đã làm trong lượt này; file đã tạo/sửa.
3. Kết quả test, lint (số liệu thật). Nếu thất bại: nói thẳng.
4. **Kết quả review:** kết luận, số phát hiện theo mức độ, cái đã sửa, cái còn tồn đọng (hoặc "chưa review" kèm lý do).
5. Vấn đề, giả định, hoặc việc phát sinh.
6. **Dòng cuối cùng** là thông báo bước tiếp theo theo mục 10 của `conventions.md`: còn việc chưa `[x]` hoặc review còn tồn đọng thì `/implement <ID>`; xong hết thì `/sync-domain <ID>`; spec/plan sai hoặc thiếu thì `/spec <ID> ...` hoặc `/sdd-lite:plan <ID>`. Áp dụng cả khi dừng giữa chừng ở Bước 3.
