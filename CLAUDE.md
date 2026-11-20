# SDD Lite (plugin Claude Code)

Plugin Claude Code cho quy trình Spec-Driven Development gọn nhẹ, dành cho cá nhân, viết bằng tiếng Việt. Rút gọn từ [github/spec-kit](https://github.com/github/spec-kit) và thêm tầng tài liệu nghiệp vụ bền vững (`docs/domain/`). Repo này là **nơi phát triển plugin**, không phải dự án dùng plugin.

## Cấu trúc repo

```
.claude-plugin/marketplace.json     # marketplace "sdd-lite-marketplace", trỏ tới plugins/sdd-lite
README.md                           # hướng dẫn cài đặt và sử dụng (cho người dùng plugin)
plugins/sdd-lite/
  .claude-plugin/plugin.json
  commands/        init, spec, plan, task, implement, sync-domain, push (prompt của từng lệnh)
  agents/          code-reviewer (reviewer độc lập, chỉ đọc; /implement gọi ở Bước 4)
  reference/conventions.md          # NGUỒN SỰ THẬT về quy ước: ID, trạng thái, mã định danh, quy chuẩn docs
  templates/       khuôn Markdown cho mọi file mà lệnh sinh ra
    stack-rules/<stack>/            # rules kỹ thuật theo stack (hiện có electron-vue); /init chép vào .claude/rules/ của dự án
  scripts/features.js               # công cụ cấp ID + bảng ánh xạ; /init chép vào specs/features.js của dự án người dùng
```

## Cách hoạt động (để sửa cho đúng)

- Luồng: `/init` (một lần) → `/spec` → `/plan` → `/task` → `/implement` → `/sync-domain` → `/push`. Mỗi feature có ID 4 chữ số cố định (`0001`...), thư mục `specs/<ID>/`, không kèm slug.
- Hai tầng tài liệu trong dự án người dùng: `docs/domain/` + `docs/tech/` mô tả hệ thống **như đang chạy**; `specs/<ID>/` mô tả **thay đổi** của từng feature. `/sync-domain` gộp feature đã xong vào `docs/`.
- `docs/INDEX.md` là bản đồ docs để AI chỉ đọc phần cần; mọi lệnh đọc docs theo "giao thức đọc docs" (mục 9 của `conventions.md`).
- Mỗi lệnh có một đoạn **Vai trò** ngay trước "Nhiệm vụ" (init: PO/SA, spec: BA/PM, plan: SA, task: Tech Lead, implement: Senior Dev, sync-domain: QA + Tech Writer, push: Release Engineer). Persona nằm trong prompt, không tách agent, vì các bước này cần hỏi lại người dùng. Chỉ review độc lập mới dùng agent. Agent không đọc được `${CLAUDE_PLUGIN_ROOT}`, nên đường dẫn file do lệnh truyền vào prompt.
- Plugin Claude Code **không có thành phần "rules"**, nên rules của stack được `/init` chép từ `templates/stack-rules/<stack>/` vào `.claude/rules/` (có frontmatter `paths:`). Thêm stack mới: tạo thư mục mới cùng tên và thêm điều kiện ở mục "Quy tắc kỹ thuật theo stack" của `init.md`. Không nhầm với `docs/domain/rules.md` (quy tắc nghiệp vụ BR).
- ID do `scripts/features.js` cấp (`register`), trạng thái đổi bằng `set`. AI không tự tính ID. Không có Node thì dùng phương án thủ công (mục 3.3 của `conventions.md`).
- `/push` là lệnh duy nhất ghi lên GitHub: `git` cục bộ để commit và push, MCP github (`mcp__github__*`) chỉ để kiểm tra tài khoản và mở pull request. Không đẩy nội dung file bằng MCP (`push_files` bắt gõ lại toàn bộ file, chậm và tốn token; MCP còn tạo commit phía GitHub làm kho cục bộ lệch). Không thêm bước ghi lên GitHub vào lệnh khác.
- Mỗi lệnh đọc `${CLAUDE_PLUGIN_ROOT}/reference/conventions.md` trước khi làm việc, và đọc template qua `${CLAUDE_PLUGIN_ROOT}/templates/`.

## Quy tắc khi sửa plugin

1. **Quy ước chỉ nằm ở `conventions.md`.** Đổi quy ước (định dạng ID, trạng thái, mã, quy chuẩn docs) thì sửa ở đó, rồi rà các lệnh và template có nhắc tới. Không chép quy ước vào nhiều nơi.
2. **Template là khuôn bắt buộc.** Đổi tiêu đề, số mục, thứ tự mục của `spec.md`, `plan.md`, `tasks.md` thì phải sửa các lệnh nhắc tới số mục (ví dụ "đủ 10 mục", "mục 12 của plan", "mục 3 của spec"). Mọi feature của người dùng phải ra cùng một khuôn.
3. **Viết tiếng Việt có dấu** cho nội dung lệnh, template, README. Tên file, thư mục, ID, khoá frontmatter, giá trị `status`, tên lệnh: tiếng Anh/ASCII.
4. **Placeholder** trong template dùng `{{...}}`; chú thích hướng dẫn dùng `<!-- ... -->` và lệnh phải yêu cầu xoá khi điền.
5. **`scripts/features.js`:**
   - Giữ nguyên cặp marker `// <registry>` và `// </registry>` cùng dòng `const REGISTRY = [];` ở bản gốc; script tự ghi đè khối này.
   - Không thêm thư viện ngoài; chỉ dùng module có sẵn của Node (>= 14). Mọi lệnh in JSON, lỗi thoát mã 1.
   - File được **chép nguyên văn** vào dự án người dùng, nên không thêm placeholder hay đường dẫn tuyệt đối.
   - Sửa xong phải chạy lại bài kiểm tra bên dưới.
6. **Không dùng tên file `CLAUDE.md` trong `templates/`** (Claude Code sẽ nạp nhầm làm memory). Template CLAUDE.md của người dùng tên là `claude-md.md`.
7. Lệnh thay đổi trạng thái feature dùng `node specs/features.js set`, không sửa tay `REGISTRY` hay frontmatter.
8. Plugin được copy vào cache khi cài, nên lệnh chỉ được tham chiếu file **bên trong** `plugins/sdd-lite/`, qua `${CLAUDE_PLUGIN_ROOT}`.

## Kiểm tra

Chạy từ gốc repo:

```
claude plugin validate .
node --check plugins/sdd-lite/scripts/features.js
```

Kiểm tra script trong thư mục tạm (không chạy trong repo này, vì nó ghi vào chính file):

```
mkdir -p <tmp>/specs && cp plugins/sdd-lite/scripts/features.js <tmp>/specs/
cd <tmp>
node specs/features.js register "Tên thử"      # tạo specs/0001/, ghi REGISTRY
node specs/features.js set 1 --status approved # kiểm tra frontmatter spec.md được cập nhật
node specs/features.js list --table
```

Thử lệnh với Claude Code mà không cần cài: `claude --plugin-dir ./plugins/sdd-lite` (trong một thư mục thử trống), rồi chạy `/sdd-lite:init <ý tưởng>`.

## Lưu ý đã biết

- `/init` và có thể cả `/plan` trùng tên lệnh có sẵn của Claude Code; người dùng cần gõ dạng đầy đủ `/sdd-lite:init`, `/sdd-lite:plan`.
- `/spec <ý tưởng>` cố ý **không kiểm tra trùng** với feature cũ (AI đã đọc docs và code ở bước nạp ngữ cảnh); muốn sửa feature cũ phải dùng `/spec <ID> ...`.
- Thư mục `specs/` chỉ nhận thư mục đúng 4 chữ số (`0001`); thư mục kiểu `0001-ten` bị bỏ qua.
- Các lệnh chưa được chạy thử đầu cuối với AI thật; mọi thay đổi prompt nên thử bằng `--plugin-dir` trên một ý tưởng nhỏ.

## Chia sẻ

Đẩy repo lên GitHub, người dùng cài bằng `/plugin marketplace add <user>/<repo>` rồi `/plugin install sdd-lite@sdd-lite-marketplace`. Tăng `version` trong `plugin.json` và `marketplace.json` (hai file phải khớp nhau) khi phát hành bản mới.

Quy ước version (semver, đang ở 0.x):

| Loại thay đổi | Tăng | Ví dụ |
|---|---|---|
| Sửa lỗi, chỉnh câu chữ prompt, không đổi hành vi | patch (0.3.0 → 0.3.1) | sửa typo, làm rõ một bước |
| Thêm tính năng, tương thích ngược | minor (0.3.0 → 0.4.0) | thêm lệnh, thêm stack mới |
| Đổi làm hỏng dự án cũ (ID, khuôn `spec.md`...) | minor khi còn 0.x, major khi đã ≥ 1.0 | đổi định dạng ID |

Tăng đúng một bậc từ bản hiện tại, không nhảy cách. Phiên bản 1.0.0 chỉ khi các lệnh đã được chạy thử đầu cuối với AI thật.
