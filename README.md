# SDD Lite

Plugin Claude Code cho quy trình Spec-Driven Development **gọn nhẹ, dành cho cá nhân**, viết bằng tiếng Việt. Rút gọn từ ý tưởng của [github/spec-kit](https://github.com/github/spec-kit), thêm một tầng tài liệu nghiệp vụ bền vững (`docs/domain/`) để dự án nhiều nghiệp vụ không bị mất tri thức.

## Cài đặt

Từ GitHub (sau khi đẩy thư mục này lên một repo):

```
/plugin marketplace add <user>/<repo>
/plugin install sdd-lite@sdd-lite-marketplace
```

Từ thư mục cục bộ (dùng trên máy của bạn hoặc để thử):

```
/plugin marketplace add D:\Vibe code\SDD
/plugin install sdd-lite@sdd-lite-marketplace
```

Chạy thử không cần cài: `claude --plugin-dir ./plugins/sdd-lite`

## Các lệnh

Lệnh của plugin có tên đầy đủ dạng `/sdd-lite:<lệnh>`. Tên ngắn (`/spec`, `/plan`...) dùng được khi không trùng lệnh khác. **`/init` và có thể cả `/plan` trùng lệnh có sẵn của Claude Code, nên hãy gõ `/sdd-lite:init` và `/sdd-lite:plan`.**

| Lệnh | Việc làm | Sinh ra |
|---|---|---|
| `/sdd-lite:init <ý tưởng dự án>` | Khởi tạo dự án | `CLAUDE.md`, `docs/domain/*`, `docs/tech/*`, `specs/features.js` |
| `/spec <ý tưởng feature>` | Tạo feature mới (script tự cấp ID) | `specs/<ID>/spec.md` |
| `/spec <ID> <bổ sung>` | Cập nhật spec, trả lời câu hỏi mở | cập nhật `spec.md` |
| `/sdd-lite:plan <ID>` | Kế hoạch kỹ thuật | `plan.md` |
| `/task <ID>` | Chia công việc | `tasks.md` |
| `/implement <ID> [T003 \| T003-T006 \| phase N]` | Viết code theo công việc, test trước | code, tick `tasks.md` |
| `/sync-domain <ID>` | Đối chiếu code với spec, gộp vào `docs/`, đóng feature | cập nhật `docs/`, `status: done` |

## Quy trình

```
/sdd-lite:init <ý tưởng>        một lần cho cả dự án
        │
        ▼
/spec <ý tưởng feature>  →  cấp ID 0001  →  trả lời câu hỏi mở: /spec 0001 <trả lời>
        ▼
/sdd-lite:plan 0001  →  /task 0001  →  /implement 0001  →  /sync-domain 0001
```

## ID feature

- 4 chữ số, bắt đầu `0001`, tăng dần; thư mục `specs/0001/`.
- `/spec <ý tưởng>` chạy `node specs/features.js register "<tên ngắn>"` để cấp ID mới và tạo thư mục; luôn tạo feature mới, không kiểm tra trùng. Muốn sửa feature đã có: `/spec <ID> <nội dung>`.
- ID không đổi, không tái sử dụng (kể cả feature bị huỷ).
- Các lệnh còn lại nhận ID làm tham số: `/task 0003`.
- Feature `done` không sửa trực tiếp; thay đổi nghiệp vụ sau đó là feature mới.

### `specs/features.js`: bảng ánh xạ và công cụ cấp ID

`/init` chép file này vào `specs/`. Khối `REGISTRY` ở đầu file là bảng ánh xạ **ID ↔ tên feature** (kèm trạng thái, ngày cập nhật). File cũng là công cụ dòng lệnh, cần Node.js >= 14, không cần cài thư viện:

| Lệnh | Việc làm |
|---|---|
| `node specs/features.js register "<tên ngắn>"` | Cấp ID mới, tạo `specs/<ID>/`, ghi bảng ánh xạ |
| `node specs/features.js get <ID>` | Tra feature theo ID, cho biết `spec`/`plan`/`tasks` đã có chưa |
| `node specs/features.js set <ID> --status <s>` | Đổi trạng thái, cập nhật cả frontmatter `spec.md` |
| `node specs/features.js list [--table]` | Liệt kê mọi feature |
| `node specs/features.js sync` | Dựng lại bảng ánh xạ từ thư mục |

Thư mục `specs/` vẫn là nguồn sự thật về sự tồn tại của feature; công cụ tự phát hiện và cảnh báo khi bảng lệch với thư mục. Không có Node.js thì lệnh dùng phương án thủ công (mục 3.3 của `conventions.md`). File cũng `require()` được: `{ REGISTRY, idToName, nameToId }`.

## Hai tầng tài liệu

| Tầng | Vai trò | Vòng đời |
|---|---|---|
| `docs/domain/` và `docs/tech/` | Hệ thống **như đang chạy** | Sống mãi, cập nhật bởi `/sync-domain` |
| `specs/<ID>/` | **Thay đổi** của từng feature | Dùng một lần, giữ làm lịch sử |

`docs/domain/` chỉ chứa nghiệp vụ (không nhắc công nghệ); kỹ thuật nằm ở `docs/tech/` và `plan.md`.

## Phụ lục `docs/INDEX.md` và quy chuẩn docs

`docs/INDEX.md` là bản đồ của toàn bộ `docs/`: mỗi file một dòng "nội dung" và "đọc khi nào", cộng danh mục nhóm quy tắc (kèm dải mã BR), thực thể, luồng và ADR. AI đọc file này trước rồi chỉ mở đúng phần cần, thay vì đọc cả thư mục.

Quy chuẩn (chi tiết ở mục 8 và 9 của `reference/conventions.md`):
- Mỗi file docs có khuôn đầu cố định: H1, dòng `> Tóm tắt`, dòng `Cập nhật lần cuối`.
- H2 là đơn vị tra cứu và có tên ổn định (một nhóm quy tắc, một thực thể, một ADR).
- Mỗi thông tin một nơi, nơi khác trỏ bằng mã. Tra cứu bằng Grep theo mã (`BR-012`).
- File vượt khoảng 400 dòng thì tách theo H2.
- Sửa `docs/` thì cập nhật INDEX trong cùng lượt; `/sync-domain` đối chiếu INDEX với thực tế.
- Dự án dựng bằng bản cũ chưa có INDEX: lệnh đầu tiên cần đọc docs sẽ tự tạo từ nội dung hiện có.

## Cấu trúc plugin

```
.claude-plugin/marketplace.json
plugins/sdd-lite/
  .claude-plugin/plugin.json
  commands/            init, spec, plan, task, implement, sync-domain
  reference/conventions.md   quy ước chung: ID, trạng thái, mã định danh, quy tắc viết, quy chuẩn docs
  templates/             khuôn Markdown cho mọi file sinh ra
  scripts/features.js    công cụ cấp ID + bảng ánh xạ; /init chép vào specs/features.js của dự án
```

Muốn đổi cách làm việc: sửa `reference/conventions.md` (quy ước) hoặc `templates/` (khuôn). Mọi feature sẽ theo cùng một khuôn.
