---
description: Đẩy feature đã done lên GitHub (git cục bộ để commit và push, MCP github để mở pull request)
argument-hint: <ID> [no-pr]
disable-model-invocation: true
---

# /push: Đẩy feature lên GitHub

Đầu vào: $ARGUMENTS

**Vai trò: Release Engineer.** Đưa đúng những thay đổi của một feature đã đóng lên GitHub, an toàn và có thể truy vết. Không đẩy thứ không thuộc feature, không đẩy bí mật, không tự merge, không ghi đè lịch sử.

Phân công công cụ (vì MCP github chỉ nhận nội dung file qua tham số, đẩy code bằng MCP buộc phải gõ lại toàn bộ file, chậm và tốn):
- **`git` cục bộ:** tạo nhánh, commit, push.
- **MCP github:** kiểm tra tài khoản, mở pull request.

Nhiệm vụ: (1) xác minh feature đã `done`; (2) gom thay đổi và xin người dùng xác nhận; (3) commit và push lên nhánh `feature/<ID>`; (4) mở pull request. Đây là bước **cuối** của luồng, chỉ chạy sau `/sync-domain`.

## Bước 1. Chuẩn bị

1. Đọc `${CLAUDE_PLUGIN_ROOT}/reference/conventions.md` và tuân theo toàn bộ.
2. Lấy **ID** là từ đầu tiên của `$ARGUMENTS`, tìm feature bằng `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" get <ID>` (mục 3.2 của `conventions.md`). Không có ID: dừng, hiển thị `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" list --table`. Từ `no-pr` trong `$ARGUMENTS` nghĩa là chỉ push nhánh, không mở pull request.
3. Điều kiện: `status` phải là `done`. Chưa `done`: dừng, chỉ lệnh cần chạy (`/implement <ID>` hoặc `/sync-domain <ID>`). `cancelled`: dừng.
4. Kiểm tra git: `git --version`, `git rev-parse --is-inside-work-tree` và `git remote get-url origin`. Không phải kho git hoặc không có remote `origin`: dừng, báo người dùng khởi tạo kho và thêm remote (không tự `git init`, không tự thêm remote).
5. Tách `owner` và `repo` từ URL của `origin` (hỗ trợ `https://github.com/o/r(.git)` và `git@github.com:o/r(.git)`). Không phải GitHub: vẫn push được, nhưng bỏ qua Bước 5 và báo người dùng tự mở pull request.
6. Nhánh gốc (`base`): nhánh mặc định của kho, lấy bằng `git symbolic-ref --short refs/remotes/origin/HEAD` (bỏ tiền tố `origin/`); lỗi thì ưu tiên `main`, rồi `master`.
7. Nếu cần mở pull request (không có `no-pr`): nạp công cụ MCP github bằng ToolSearch `select:mcp__github__get_me,mcp__github__create_pull_request`, gọi `get_me` để xác nhận đã đăng nhập. Không nạp được hoặc `get_me` lỗi: **không dừng**; vẫn commit và push, rồi ở Bước 5 báo người dùng cấu hình MCP github hoặc tự mở pull request.

## Bước 2. Gom thay đổi

1. Chạy `git status --porcelain` và `git diff --stat` (cả file chưa theo dõi). Danh sách thay đổi của feature gồm: mã nguồn và test, `specs/<ID>/`, `specs/features.json`, các file trong `docs/`, `CLAUDE.md` nếu đổi.
2. **Loại khỏi danh sách và báo người dùng:** file bí mật (`.env*`, khoá, chứng chỉ, `credentials*`), thư mục sinh ra (`node_modules/`, `dist/`, `build/`, `.cache/`), file lớn bất thường (hơn khoảng 5 MB), và thay đổi **không liên quan** feature này (nếu thấy thì hỏi người dùng có đưa vào không).
3. Chạy test, lint theo `CLAUDE.md` một lần. Thất bại: dừng, báo, không push.
4. Quét bí mật trong phần sẽ commit: Grep các mẫu phổ biến (khoá API, `BEGIN ... PRIVATE KEY`, `password=`, `secret=`, `token=`, chuỗi kết nối kèm mật khẩu) trên các file thêm/sửa. Có phát hiện: dừng, báo file và dòng, không push.
5. Không có thay đổi nào: dừng, báo "không có gì để đẩy".

## Bước 3. Xác nhận với người dùng

Push lên GitHub là hành động công khai, khó thu hồi. Trước khi ghi, hiển thị và **chờ xác nhận**:

- Kho `owner/repo`, nhánh gốc, nhánh sẽ tạo (`feature/<ID>`).
- Danh sách file: thêm / sửa / xoá, kèm số dòng đổi.
- Commit message: `feat(<ID>): <Tên feature>` (tiếng Việt, ngắn; dòng thân nêu các `FR-nnn` đã làm). Feature chỉ sửa tài liệu hoặc sửa lỗi thì dùng `docs(<ID>)` hoặc `fix(<ID>)`.
- Tiêu đề PR: `[<ID>] <Tên feature>`; có mở PR hay không.

Người dùng chưa đồng ý: dừng, không ghi gì.

## Bước 4. Commit và push bằng git

1. Kiểm tra nhánh `feature/<ID>`: cục bộ (`git branch --list feature/<ID>`) và trên remote (`git ls-remote --heads origin feature/<ID>`). Đã tồn tại ở một trong hai nơi: **không ghi đè**; hỏi người dùng dùng nhánh khác (ví dụ `feature/<ID>-2`) hoặc tiếp tục trên nhánh đó.
2. Tạo nhánh từ vị trí hiện tại: `git switch -c feature/<ID>`.
3. Thêm **đúng các file trong danh sách đã xác nhận**: `git add -- <file> ...`. Không dùng `git add -A` hay `git add .`.
4. Commit: `git commit` với message đã xác nhận (truyền qua heredoc hoặc `-F -`). Không `--no-verify`, không `--amend`. Hook pre-commit thất bại: sửa nguyên nhân rồi tạo commit mới.
5. Push: `git push -u origin feature/<ID>`. **Không** dùng `--force`.
6. Lỗi (xác thực, quyền, mạng, bị từ chối): dừng, báo nguyên văn lỗi, nói rõ commit đã nằm ở kho cục bộ và nhánh nào. **Không** chuyển sang đẩy file bằng MCP github (phải gõ lại toàn bộ nội dung), không thử lại mù quáng, không xoá nhánh.
7. Xác nhận: `git status -sb` phải báo nhánh khớp `origin/feature/<ID>`; ghi lại SHA bằng `git rev-parse --short HEAD`.

## Bước 5. Mở pull request

Bỏ qua nếu có `no-pr`, hoặc remote không phải GitHub.

1. MCP github không dùng được (Bước 1.7): **không** làm gì thêm; báo nhánh đã push và gợi ý người dùng cấu hình MCP github hoặc mở pull request thủ công trên GitHub.
2. Tìm mẫu PR của kho ngay trong thư mục làm việc (Glob `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE/*`). Có thì theo mẫu; không có thì dùng cấu trúc dưới.
3. `create_pull_request` từ `feature/<ID>` vào `base`. Nội dung (tiếng Việt):
   - **Tóm tắt:** 2–3 câu lấy từ mục mô tả của `spec.md`.
   - **Phạm vi:** các `FR-nnn` và `KB-nn` đã làm; quy tắc nghiệp vụ mới/đổi (`BR-nnn`); ADR mới.
   - **Kiểm chứng:** kết quả test/lint thật (số lượng pass/fail) ở Bước 2.
   - **Tài liệu:** file `docs/` đã cập nhật.
   - **Truy vết:** đường dẫn `specs/<ID>/spec.md`.
4. **Không merge.** Merge chỉ làm khi người dùng yêu cầu rõ ràng sau khi xem PR.

## Bước 6. Tự kiểm tra

- [ ] Feature `done` trước khi push; không đẩy bí mật, file sinh ra, file quá lớn.
- [ ] Đã có xác nhận của người dùng trước khi commit và push.
- [ ] Chỉ `git add` đúng danh sách đã xác nhận; không `--force`, không `--no-verify`, không ghi đè nhánh có sẵn, không merge.
- [ ] Nhánh cục bộ khớp `origin/feature/<ID>` (`git status -sb`).
- [ ] Không dùng MCP github để đẩy nội dung file.

## Bước 7. Báo cáo

1. Feature `<ID> · <Tên>`; kho, nhánh, SHA commit.
2. Đường dẫn pull request (hoặc "không mở PR" kèm lý do).
3. File đã đẩy, file bị loại và lý do.
4. Việc còn lại cho người dùng: xem và merge PR. Feature kế tiếp gợi ý trong `overview.md` mục 6 (nếu có).
5. **Dòng cuối cùng** là thông báo bước tiếp theo theo mục 10 của `conventions.md`: đây là cuối luồng, nên nêu "xem và merge PR" rồi `/spec <ý tưởng feature>` để bắt đầu feature mới. Dừng sớm thì chỉ lệnh gỡ vướng (ví dụ `/sync-domain <ID>` nếu feature chưa `done`).
