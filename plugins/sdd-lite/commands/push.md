---
description: Đẩy feature đã done lên GitHub bằng MCP github (nhánh feature/<ID>, commit, pull request)
argument-hint: <ID> [no-pr]
disable-model-invocation: true
---

# /push: Đẩy feature lên GitHub

Đầu vào: $ARGUMENTS

**Vai trò: Release Engineer.** Đưa đúng những thay đổi của một feature đã đóng lên GitHub, an toàn và có thể truy vết. Không đẩy thứ không thuộc feature, không đẩy bí mật, không tự merge. Mọi thao tác ghi lên GitHub đều dùng **MCP github** (không dùng `git push`).

Nhiệm vụ: (1) xác minh feature đã `done`; (2) gom thay đổi và xin người dùng xác nhận; (3) tạo nhánh, đẩy commit bằng MCP github; (4) mở pull request. Đây là bước **cuối** của luồng, chỉ chạy sau `/sync-domain`.

## Bước 1. Chuẩn bị

1. Đọc `${CLAUDE_PLUGIN_ROOT}/reference/conventions.md` và tuân theo toàn bộ.
2. Lấy **ID** là từ đầu tiên của `$ARGUMENTS`, tìm feature bằng `node specs/features.js get <ID>` (mục 3.2 của `conventions.md`). Không có ID: dừng, hiển thị `node specs/features.js list --table`. Từ `no-pr` trong `$ARGUMENTS` nghĩa là chỉ đẩy nhánh, không mở pull request.
3. Điều kiện: `status` phải là `done`. Chưa `done`: dừng, chỉ lệnh cần chạy (`/implement <ID>` hoặc `/sync-domain <ID>`). `cancelled`: dừng.
4. Nạp công cụ MCP github bằng ToolSearch: `select:mcp__github__get_me,mcp__github__get_file_contents,mcp__github__list_branches,mcp__github__create_branch,mcp__github__push_files,mcp__github__delete_file,mcp__github__create_pull_request,mcp__github__run_secret_scanning`. Không nạp được hoặc `get_me` lỗi: **dừng**, báo người dùng cấu hình MCP github (đăng nhập, quyền ghi repo). Không chuyển sang `git push`.
5. Xác định kho GitHub: `git remote get-url origin`, tách `owner` và `repo` (hỗ trợ dạng `https://github.com/o/r(.git)` và `git@github.com:o/r(.git)`). Không có remote hoặc không phải GitHub: hỏi người dùng `owner/repo`. Tên nhánh gốc (`base`): nhánh mặc định của kho (ưu tiên `main`, nếu không có thì `master`; kiểm bằng `list_branches`).

## Bước 2. Gom thay đổi

1. Chạy `git status --porcelain` và `git diff --stat`. Danh sách thay đổi của feature gồm: mã nguồn và test, `specs/<ID>/`, `specs/features.js`, các file trong `docs/`, `CLAUDE.md` nếu đổi.
2. **Loại khỏi danh sách và báo người dùng:** file bí mật (`.env*`, khoá, chứng chỉ, `credentials*`), thư mục sinh ra (`node_modules/`, `dist/`, `build/`, `.cache/`), file nhị phân hoặc lớn hơn khoảng 1 MB (MCP chỉ đẩy được nội dung văn bản), và thay đổi **không liên quan** feature này (nếu thấy thì hỏi người dùng có đưa vào không).
3. Chạy test, lint theo `CLAUDE.md` một lần. Thất bại: dừng, báo, không đẩy.
4. Chạy `mcp__github__run_secret_scanning` trên nội dung các file sẽ đẩy. Có phát hiện: dừng, báo file và dòng, không đẩy.
5. Không có thay đổi nào: dừng, báo "không có gì để đẩy".

## Bước 3. Xác nhận với người dùng

Đẩy lên GitHub là hành động công khai, khó thu hồi. Trước khi ghi, hiển thị và **chờ xác nhận**:

- Kho `owner/repo`, nhánh gốc, nhánh sẽ tạo (`feature/<ID>`).
- Danh sách file: thêm / sửa / xoá, kèm số dòng đổi.
- Commit message: `feat(<ID>): <Tên feature>` (tiếng Việt, ngắn; dòng thân nêu các `FR-nnn` đã làm). Feature chỉ sửa tài liệu hoặc sửa lỗi thì dùng `docs(<ID>)` hoặc `fix(<ID>)`.
- Tiêu đề PR: `[<ID>] <Tên feature>`; có mở PR hay không.

Người dùng chưa đồng ý: dừng, không ghi gì.

## Bước 4. Đẩy bằng MCP github

1. Nhánh `feature/<ID>` đã tồn tại trên GitHub (`list_branches`): **không ghi đè**; hỏi người dùng dùng nhánh khác (ví dụ `feature/<ID>-2`) hoặc đẩy tiếp lên nhánh đó. Chưa tồn tại: `create_branch` từ `base`.
2. Đẩy file thêm/sửa bằng **một** lần `push_files` (một commit duy nhất) lên `feature/<ID>`, nội dung lấy từ đĩa. File bị xoá: gọi `delete_file` cho từng file (mỗi lần một commit; nêu trong báo cáo).
3. Lỗi giữa chừng (quyền, mạng, xung đột): dừng, báo trạng thái hiện có trên GitHub (nhánh đã tạo chưa, commit nào đã lên), không thử lại mù quáng và không xoá nhánh.
4. **Đồng bộ kho cục bộ** để không bị lệch với GitHub (MCP tạo commit phía GitHub, kho cục bộ chưa có):
   - `git fetch origin feature/<ID>`
   - `git switch -c feature/<ID>` (nếu nhánh cục bộ đã có thì `git switch feature/<ID>`)
   - `git reset --mixed origin/feature/<ID>` (chỉ dời con trỏ nhánh, giữ nguyên file làm việc)
   - `git status` phải sạch với các file vừa đẩy. Còn lệch: báo, không `reset --hard`.

## Bước 5. Mở pull request

Bỏ qua nếu có `no-pr`.

1. Tìm mẫu PR của kho: `get_file_contents` với `.github/pull_request_template.md` (hoặc `.github/PULL_REQUEST_TEMPLATE/`). Có thì theo mẫu; không có thì dùng cấu trúc dưới.
2. `create_pull_request` từ `feature/<ID>` vào `base`. Nội dung (tiếng Việt):
   - **Tóm tắt:** 2–3 câu lấy từ mục mô tả của `spec.md`.
   - **Phạm vi:** các `FR-nnn` và `KB-nn` đã làm; quy tắc nghiệp vụ mới/đổi (`BR-nnn`); ADR mới.
   - **Kiểm chứng:** kết quả test/lint thật (số lượng pass/fail) ở Bước 2.
   - **Tài liệu:** file `docs/` đã cập nhật.
   - **Truy vết:** đường dẫn `specs/<ID>/spec.md`.
3. **Không merge.** Merge chỉ làm khi người dùng yêu cầu rõ ràng sau khi xem PR.

## Bước 6. Tự kiểm tra

- [ ] Feature `done` trước khi đẩy; không đẩy bí mật, file sinh ra, file nhị phân.
- [ ] Đã có xác nhận của người dùng trước mọi thao tác ghi lên GitHub.
- [ ] Không dùng `git push`; không ghi đè nhánh có sẵn; không merge.
- [ ] Kho cục bộ đã đồng bộ với nhánh vừa đẩy (`git status` sạch với các file đó).

## Bước 7. Báo cáo

1. Feature `<ID> · <Tên>`; kho, nhánh, SHA commit.
2. Đường dẫn pull request (hoặc "không mở PR").
3. File đã đẩy, file bị loại và lý do.
4. Việc còn lại cho người dùng: xem và merge PR. Feature kế tiếp gợi ý trong `overview.md` mục 6 (nếu có).
5. **Dòng cuối cùng** là thông báo bước tiếp theo theo mục 10 của `conventions.md`: đây là cuối luồng, nên nêu "xem và merge PR" rồi `/spec <ý tưởng feature>` để bắt đầu feature mới. Dừng sớm thì chỉ lệnh gỡ vướng (ví dụ `/sync-domain <ID>` nếu feature chưa `done`).
