---
description: Khởi tạo dự án SDD Lite từ một ý tưởng - tạo CLAUDE.md, docs/domain, docs/tech và specs/features.json (bản mỏng)
argument-hint: <ý tưởng dự án>
disable-model-invocation: true
---

# /init: Khởi tạo dự án

Ý tưởng người dùng: $ARGUMENTS

**Vai trò: Product Owner kiêm Solution Architect khởi đầu.** Chốt tầm nhìn và phạm vi bản đầu trước, rồi mới chọn nền tảng đơn giản nhất đáp ứng được; không thiết kế quá mức cho nhu cầu chưa có. Điều chưa biết thì nêu rõ là giả định hoặc câu hỏi mở, không giấu thành quyết định.

Nhiệm vụ: từ ý tưởng, tạo bộ tài liệu nền **mỏng** cho dự án. **Không viết code, không dựng khung dự án** (không chạy `npm init`, `git init`, ...). Chỉ tạo tài liệu.

## Bước 1. Chuẩn bị

1. Đọc `${CLAUDE_PLUGIN_ROOT}/reference/conventions.md` và tuân theo toàn bộ.
2. Kiểm tra trạng thái dự án hiện tại bằng Glob: `CLAUDE.md`, `docs/domain/overview.md`, `docs/tech/architecture.md`, `specs/features.json`.
   - **Không ghi đè** bất kỳ file nào đã tồn tại. File nào đã có thì giữ nguyên và báo cuối lệnh.
   - Nếu `docs/domain/overview.md` đã tồn tại: dừng, báo dự án đã khởi tạo, gợi ý dùng `/spec <ý tưởng feature>`. Chỉ tiếp tục nếu người dùng nói rõ muốn bổ sung các file còn thiếu.
3. Chạy `node --version`. Lỗi: vẫn tiếp tục, nhưng báo người dùng cần cài Node.js (>= 14) để dùng công cụ cấp ID `features.js` của plugin; nếu không, các lệnh sẽ dùng phương án thủ công (mục 3.3 của `conventions.md`).
4. Nếu thư mục đã có code (ví dụ `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `*.csproj`), đọc các file manifest đó để lấy sẵn ngôn ngữ, framework, lệnh chạy/test. Không đoán nếu manifest không nói.

## Bước 2. Làm rõ ý tưởng

- Nếu `$ARGUMENTS` rỗng: hỏi người dùng mô tả ý tưởng rồi **dừng**, chờ trả lời.
- Nếu ý tưởng còn thiếu thông tin quan trọng, hỏi **một lượt, tối đa 5 câu**, mỗi câu kèm đề xuất mặc định để người dùng chỉ cần trả lời "đồng ý". Chỉ hỏi những điều thật sự cần, thuộc các nhóm:
  1. Vấn đề và người dùng chính.
  2. Phạm vi phiên bản đầu (có / chưa làm).
  3. Nền tảng và công nghệ ưa thích hoặc bắt buộc (web, mobile, CLI, ngôn ngữ, cơ sở dữ liệu).
  4. Ràng buộc đặc biệt (offline, bảo mật, pháp lý, hạn chót).
  5. Nghiệp vụ lõi hoặc quy tắc đặc thù đã biết trước.
- Nếu ý tưởng đã đủ rõ, **không hỏi**, tiến hành luôn. Điều nhỏ chưa biết: chọn mặc định hợp lý, ghi vào "Giả định và ràng buộc". Điều lớn chưa biết: ghi vào "Câu hỏi còn mở" của `overview.md`.
- Chọn công nghệ: ưu tiên điều người dùng đã nêu hoặc manifest đã có. Nếu chưa có, đề xuất stack đơn giản, phổ biến, hợp với một người làm, và ghi rõ đó là đề xuất để người dùng duyệt (không giấu thành quyết định đã chốt).

## Bước 3. Tạo tài liệu

Với mỗi file: đọc template tương ứng, điền đầy đủ theo quy ước mục 6 của `conventions.md`, rồi ghi vào đích. Giữ nguyên cấu trúc mục của template.

| Đích | Template trong `${CLAUDE_PLUGIN_ROOT}/templates/` | Mức điền |
|---|---|---|
| `CLAUDE.md` | `claude-md.md` | Điền đủ. Phần chưa có code ghi "Chưa có, sẽ chốt ở feature đầu tiên". Lệnh chưa biết thì ghi lệnh chuẩn của stack đã chọn |
| `docs/domain/overview.md` | `overview.md` | Điền đủ, đây là file quan trọng nhất |
| `docs/domain/glossary.md` | `glossary.md` | Điền các khái niệm cốt lõi rút từ ý tưởng; xoá dòng mẫu |
| `docs/domain/rules.md` | `rules.md` | Chỉ giữ tiêu đề và đầu bảng, **không bịa quy tắc**. Nếu người dùng đã nêu quy tắc cụ thể, ghi BR-001... với nguồn "Khởi tạo dự án" |
| `docs/domain/entities.md` | `entities.md` | Điền các thực thể rõ ràng từ ý tưởng; chưa rõ thì chỉ giữ tiêu đề. Mọi thực thể ghi `Hiện trạng: Dự kiến` (chưa có code) |
| `docs/tech/architecture.md` | `architecture.md` | Mỏng: tổng quan, công nghệ, cấu trúc thư mục dự kiến, phi chức năng. Mọi thành phần ghi `Dự kiến`; không mô tả luồng/sơ đồ như đang chạy (mục 8.10 của `conventions.md`) |
| `docs/tech/decisions.md` | `decisions.md` | ADR-0001... chỉ cho quyết định lớn, khó đảo ngược (mục 8.12 của `conventions.md`), nguồn "Khởi tạo dự án". Trạng thái `Hiệu lực` nếu người dùng đã chốt, `Đề xuất` nếu là gợi ý của AI |
| `specs/features.json` | (không có template) | **Không chép script vào dự án**: `features.js` nằm trong plugin và được gọi trực tiếp. Tạo bảng ánh xạ rỗng bằng cách chạy `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" sync` (tạo `specs/` và `specs/features.json`). Xong chạy `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" list`: phải trả về `ok: true` và `next_id: "0001"` |
| `docs/INDEX.md` | `docs-index.md` | **Tạo sau cùng.** Chỉ liệt kê file thực sự vừa tạo; điền đủ nhóm quy tắc, thực thể, ADR từ các file đó (bảng nào chưa có dòng thì giữ đầu bảng, bỏ dòng mẫu) |

### Quy tắc kỹ thuật theo stack (tuỳ chọn)

Nếu stack đã chọn là **Electron + Vue** (do người dùng nêu, hoặc manifest có `electron` và `vue`): chép **nguyên văn** mọi file `*.md` trong `${CLAUDE_PLUGIN_ROOT}/templates/stack-rules/electron-vue/` vào `.claude/rules/` của dự án (Glob để liệt kê, đọc bằng Read rồi ghi bằng Write; không ghi đè file đã có). Đây là quy tắc kỹ thuật cho Claude (bảo mật, IPC, Vue, kiểm thử, đóng gói), **khác** với `docs/domain/rules.md` là quy tắc nghiệp vụ `BR-nnn`. Không điền placeholder.
- Các file dùng `paths:` theo bố cục `src/main`, `src/preload`, `src/renderer` (electron-vite). Nếu dự án đã có code với bố cục khác, sửa `paths:` cho khớp; chưa có code thì giữ nguyên và ghi vào `architecture.md` rằng bố cục dự kiến theo các đường dẫn đó.
- Stack khác: bỏ qua mục này, không tự bịa rules.

Mọi file trong `docs/` phải theo quy chuẩn mục 8 của `conventions.md` (khuôn đầu file, H2 là đơn vị tra cứu).

Thư mục `docs/domain/flows/`, `docs/tech/data-schema.md`, `docs/tech/api.md` **chưa tạo**; sẽ tạo khi cần.

Điền `{{Tên dự án}}`, ngày hôm nay, và mọi placeholder. Không để sót `{{...}}` hay chú thích HTML.

## Bước 4. Tự kiểm tra

- [ ] Không còn `{{` trong các file vừa tạo (Grep).
- [ ] `overview.md` mục 6 có danh sách hướng tính năng, sắp theo thứ tự nên làm, tính năng nghiệp vụ lõi đứng đầu.
- [ ] `architecture.md` và `decisions.md` khớp nhau (mỗi công nghệ trong bảng có ADR).
- [ ] `docs/domain/` không nhắc công nghệ.
- [ ] Không có file nào bị ghi đè.
- [ ] Stack Electron + Vue: `.claude/rules/` có đủ 5 file stack-rules; stack khác: không tạo gì ở đó.
- [ ] Mỗi file trong `docs/` (trừ INDEX) có đủ H1, dòng `> Tóm tắt`, dòng `Cập nhật lần cuối`.
- [ ] `docs/INDEX.md` khớp với các file thực sự tồn tại và các H2 của chúng.

## Bước 5. Báo cáo

Trả lời ngắn gọn bằng tiếng Việt:
1. Danh sách file đã tạo (kể cả `.claude/rules/*` nếu có), file đã bỏ qua vì tồn tại sẵn.
2. Tóm tắt 3–5 dòng: dự án làm gì, stack đã chọn (nêu rõ phần nào là đề xuất cần duyệt), phạm vi bản đầu.
3. Câu hỏi còn mở (nếu có).
4. Gợi ý feature đầu tiên (nghiệp vụ lõi).
5. **Dòng cuối cùng** là thông báo bước tiếp theo theo mục 10 của `conventions.md`, ví dụ: `/spec <mô tả feature đầu tiên>`.
