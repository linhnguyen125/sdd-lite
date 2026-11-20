# Quy ước chung của SDD Lite

Tài liệu này là **nguồn sự thật duy nhất** về quy ước. Mọi lệnh (`init`, `spec`, `plan`, `task`, `implement`, `sync-domain`, `push`) phải đọc và tuân theo trước khi làm việc.

## 1. Đường dẫn plugin

- Thư mục plugin: `${CLAUDE_PLUGIN_ROOT}`. Template Markdown nằm ở `${CLAUDE_PLUGIN_ROOT}/templates/`, script chạy lệnh (JS) nằm ở `${CLAUDE_PLUGIN_ROOT}/scripts/`.
- Nếu chuỗi `${CLAUDE_PLUGIN_ROOT}` xuất hiện nguyên văn (chưa được thay thế), dùng Glob tìm `**/sdd-lite/templates/spec.md` để xác định thư mục plugin, rồi dùng đường dẫn đó.

## 2. Cấu trúc thư mục của dự án người dùng

```
CLAUDE.md                          # ngữ cảnh + nguyên tắc dự án (ngắn)
docs/
  INDEX.md                         # BẢN ĐỒ docs: AI đọc file này TRƯỚC
  domain/                          # NGHIỆP VỤ: không nhắc công nghệ
    overview.md                    # bức tranh tổng thể, phạm vi
    glossary.md                    # thuật ngữ
    rules.md                       # quy tắc nghiệp vụ BR-001, BR-002, ...
    entities.md                    # thực thể ở mức khái niệm
    flows/<slug>.md                # luồng nghiệp vụ (tạo khi cần)
  tech/                            # KỸ THUẬT
    architecture.md                # kiến trúc, stack
    decisions.md                   # ADR-0001, ADR-0002, ...
    data-schema.md                 # schema thực tế (tạo khi cần)
    api.md                         # giao diện công khai (tạo khi cần)
specs/
  features.js                      # BẢNG ÁNH XẠ ID <-> tên feature + công cụ cấp ID (Node.js)
  0001/
    spec.md                        # /spec
    plan.md                        # /plan
    tasks.md                       # /task
```

## 3. ID feature

- Định dạng: **4 chữ số**, bắt đầu từ `0001`, tăng dần. Thư mục: `specs/<ID>/`.
- ID **cố định**: không đổi, không đánh lại, **không tái sử dụng**, kể cả khi feature bị huỷ (giữ nguyên thư mục, đặt trạng thái `cancelled`).
- Thư mục feature chỉ gồm ID (`specs/0001/`), không kèm tên. Tên feature nằm ở frontmatter `spec.md` và trong bảng ánh xạ `specs/features.js`.

### 3.1. Công cụ `specs/features.js` (cấp ID mới)

`specs/features.js` vừa là **bảng ánh xạ ID ↔ tên feature** (khối `REGISTRY` ở đầu file), vừa là công cụ dòng lệnh. Chạy từ gốc dự án, cần Node.js >= 14, không cần cài thư viện. Mọi lệnh in JSON (`ok: true/false`) ra stdout; `ok: false` là lỗi, đọc trường `error`.

| Lệnh | Việc làm | Ai dùng |
|---|---|---|
| `node specs/features.js register "<tên ngắn>"` | **Cấp ID mới**, tạo thư mục `specs/<ID>/`, ghi vào bảng ánh xạ; trả về `id`, `folder`, `spec_file` | `/spec` |
| `node specs/features.js get <ID>` | Tra feature theo ID: tên, trạng thái, thư mục, file nào đã tồn tại (`spec`, `plan`, `tasks`) | mọi lệnh có tham số ID |
| `node specs/features.js set <ID> --status <s>` | Đổi trạng thái (và/hoặc `--name`), **tự cập nhật cả frontmatter `spec.md`** | `/plan`, `/implement`, `/sync-domain` |
| `node specs/features.js list [--table]` | Liệt kê mọi feature | tra cứu |
| `node specs/features.js sync` | Dựng lại bảng ánh xạ từ các thư mục và frontmatter | khi `warnings` báo lệch |

Quy tắc dùng:
1. **Chỉ lệnh `register` được tạo ID mới.** Không tự tính ID bằng tay khi Node chạy được, và không tự tạo thư mục `specs/<ID>/`.
2. Tên truyền vào `register` là **tên ngắn** (tối đa khoảng 8 từ, tiếng Việt có dấu), không phải cả đoạn ý tưởng.
3. `/spec <ý tưởng>` **luôn tạo feature mới**; không có bước kiểm tra trùng. Muốn sửa feature đã có thì dùng `/spec <ID> ...`.
4. Có `warnings` về lệch giữa bảng và thư mục: chạy `sync`, rồi nêu trong báo cáo.
5. Không sửa tay khối `REGISTRY` (trừ khi dùng phương án dự phòng ở 3.3).

### 3.2. Tìm feature theo ID (các lệnh khác nhận ID làm tham số)

1. Chạy `node specs/features.js get <ID>`. Công cụ tự đệm số 0 (`3` → `0003`) và từ chối `0000`.
2. `ok: true`: dùng `feature.folder` và `files`. `ok: false` (không có feature, ID sai): dừng, báo lỗi và liệt kê `features` trong kết quả.
3. Nếu người dùng **không truyền ID**: không đoán. Chạy `node specs/features.js list --table`, hiển thị bảng và yêu cầu chạy lại kèm ID.

### 3.3. Phương án dự phòng khi không có Node.js

Nếu `node --version` lỗi: báo người dùng (khuyến nghị cài Node.js), rồi làm thủ công:
1. Glob thư mục con của `specs/` khớp `^\d{4}-`; đọc khối `REGISTRY` trong `specs/features.js`. `ID mới = số lớn nhất trong cả hai + 1`, đệm đủ 4 chữ số, chưa có thì `0001`. Thư mục và bảng lệch nhau thì tin thư mục.
2. Tạo thư mục `specs/<ID>/`, thêm một dòng vào `REGISTRY` đúng định dạng của các dòng khác (`{"id":..,"name":..,"status":..,"updated":..}`), giữ thứ tự tăng dần theo ID.
3. Tìm theo ID: kiểm tra thư mục `specs/<ID>/` có tồn tại; không có thì dừng và báo.
4. Đổi trạng thái: sửa cả `REGISTRY` và frontmatter `spec.md`.

## 4. Trạng thái feature (trường `status` trong frontmatter của spec.md)

| Trạng thái | Ý nghĩa | Ai đặt |
|---|---|---|
| `draft` | Đang soạn hoặc còn câu hỏi mở | `/spec` |
| `approved` | Spec đã chốt, đã lập plan | `/plan` |
| `in-progress` | Đang triển khai | `/implement` |
| `done` | Hoàn tất, nghiệp vụ đã được gộp vào `docs/` | `/sync-domain` |
| `cancelled` | Huỷ, giữ lại để tra cứu | Người dùng yêu cầu |

Feature `done` hoặc `cancelled` **không sửa trực tiếp**. Thay đổi nghiệp vụ sau đó là một feature mới, ghi rõ feature cũ nào bị ảnh hưởng.

## 5. Mã định danh

| Mã | Phạm vi | Nằm ở | Ví dụ |
|---|---|---|---|
| `BR-nnn` | Toàn dự án, tăng dần | `docs/domain/rules.md` | `BR-012` |
| `BR-NEW-n` | Tạm thời trong 1 spec, chờ gán số thật ở `/sync-domain` | `spec.md` | `BR-NEW-1` |
| `FR-nnn` | Trong 1 feature | `spec.md` | `FR-001` |
| `KB-nn` | Kịch bản, trong 1 feature | `spec.md` | `KB-01` |
| `SC-nnn` | Tiêu chí hoàn thành, trong 1 feature | `spec.md` | `SC-001` |
| `Tnnn` | Công việc, trong 1 feature | `tasks.md` | `T001` |
| `ADR-nnnn` | Quyết định kỹ thuật, toàn dự án | `docs/tech/decisions.md` | `ADR-0003` |

Khi trích dẫn từ ngoài feature, ghi kèm ID feature: `0003/FR-001`.

## 6. Quy tắc viết

1. Viết **tiếng Việt có dấu**. Tên file, tên thư mục, ID, khoá frontmatter, giá trị `status`: tiếng Anh/ASCII.
2. **Template là khuôn bắt buộc**: giữ nguyên tiêu đề, số mục và thứ tự mục. Không thêm, xoá, đổi tên mục. Mục không áp dụng thì ghi đúng một dòng `Không áp dụng: <lý do>`.
3. Không để lại placeholder `{{...}}` hoặc chú thích hướng dẫn dạng `<!-- ... -->` trong file đã sinh ra.
4. **Tài liệu nghiệp vụ** (`docs/domain/`, `spec.md`) không nhắc công nghệ (framework, thư viện, bảng, endpoint). Chỗ đó thuộc `plan.md` và `docs/tech/`.
5. Mỗi yêu cầu phải **kiểm chứng được** (có thể viết thành test hoặc kiểm tra bằng mắt theo tiêu chí rõ ràng). Tránh từ mơ hồ: "nhanh", "thân thiện", "phù hợp".
6. Điều chưa biết: ghi `[CẦN LÀM RÕ: <câu hỏi>]` thay vì đoán. Tối đa 5 mục như vậy trong một spec; điều nhỏ hơn thì chọn mặc định hợp lý và ghi vào mục Giả định.
7. Ngày dùng định dạng `YYYY-MM-DD`.
8. Không tự ý commit hoặc đẩy lên git. Chỉ làm khi người dùng yêu cầu; ngoại lệ duy nhất là `/push`, và `/push` vẫn phải được người dùng xác nhận trước khi ghi lên GitHub. Mọi thao tác ghi lên GitHub dùng MCP github, không dùng `git push`.

## 7. Đồng bộ trạng thái và bảng ánh xạ

- Nguồn sự thật: **thư mục** `specs/<ID>/` quyết định feature có tồn tại; **frontmatter `spec.md`** quyết định trạng thái; khối `REGISTRY` trong `specs/features.js` là bản ánh xạ cho tra cứu nhanh.
- Mỗi lệnh làm đổi trạng thái feature chỉ cần gọi `node specs/features.js set <ID> --status <s>`; công cụ cập nhật cả `REGISTRY` lẫn frontmatter `spec.md` (cùng `updated`). Không sửa tay hai nơi.
- Khi `warnings` báo lệch: chạy `node specs/features.js sync`.

## 8. Quy chuẩn tài liệu trong `docs/`

Mục tiêu: người và AI tìm đúng thông tin cần mà không phải đọc cả thư mục.

1. **Khuôn đầu file bắt buộc.** Mỗi file trong `docs/` (trừ `INDEX.md`) bắt đầu bằng đúng thứ tự: tiêu đề H1; dòng `> Tóm tắt: <1–2 câu: file này chứa gì, dùng khi nào>`; dòng `Cập nhật lần cuối: YYYY-MM-DD`.
2. **H2 là đơn vị tra cứu.** Trong `rules.md` mỗi H2 là một nhóm quy tắc; trong `entities.md` mỗi H2 là một thực thể; trong `decisions.md` mỗi H2 là một ADR. Tên H2 **ổn định**: không đổi tên tuỳ tiện vì `docs/INDEX.md` và việc Grep dựa vào đó. Đổi tên thì cập nhật INDEX cùng lúc.
3. **Một thông tin, một nơi.** Mỗi sự thật chỉ nằm ở một file (nguồn sự thật). Nơi khác chỉ trỏ bằng mã (`BR-012`, `ADR-0003`) hoặc đường dẫn, không chép lại.
4. **Tra cứu bằng mã.** Mọi quy tắc, quyết định, feature đều có mã ổn định (mục 5). Câu hỏi "BR-012 nói gì" phải trả lời được bằng một lần Grep.
5. **Ưu tiên bảng và câu ngắn** cho thông tin tra cứu; văn xuôi chỉ để giải thích lý do. Mỗi ô/mục tự đủ nghĩa, không phụ thuộc đoạn đọc trước.
6. **Cỡ file.** File vượt khoảng 400 dòng thì tách theo H2 thành thư mục cùng tên (ví dụ `docs/domain/rules/<nhom>.md`), mỗi file con theo đúng khuôn mục 1, rồi cập nhật `docs/INDEX.md` và mọi liên kết trỏ tới. Việc tách do `/sync-domain` thực hiện.
7. **Liên kết** dùng đường dẫn tương đối từ gốc dự án (`docs/domain/rules.md`) và mã, không dùng "xem ở trên".
8. **Cập nhật INDEX cùng lúc.** Mọi thao tác thêm/xoá/đổi tên file hoặc H2 trong `docs/` phải cập nhật `docs/INDEX.md` trong cùng lượt làm việc. Không bao giờ để INDEX lệch với nội dung.
9. **Không xoá lịch sử.** Quy tắc và quyết định bị thay đổi thì đổi trạng thái thành `Đã thay thế bởi <mã mới>`, không xoá dòng.

## 9. Giao thức đọc docs (cho AI)

Áp dụng mỗi khi lệnh cần thông tin nghiệp vụ hoặc kỹ thuật hiện có trong `docs/`:

1. Đọc `docs/INDEX.md` trước. Nếu chưa có (dự án dựng bằng bản cũ): tạo từ `${CLAUDE_PLUGIN_ROOT}/templates/docs-index.md` bằng cách quét `docs/` (đọc dòng `> Tóm tắt` và các H2 của từng file), rồi báo cho người dùng.
2. Từ cột "Đọc khi" và các bảng danh mục, chọn **chỉ những file/mục liên quan** tới nhiệm vụ.
3. Tìm bằng **Grep** theo mã (`BR-012`, `ADR-0003`), tên thực thể, hoặc thuật ngữ; sau đó đọc đoạn quanh kết quả (Read với `offset`/`limit`). Chỉ đọc cả file khi file ngắn hoặc nhiệm vụ cần toàn bộ.
4. Gặp mâu thuẫn giữa INDEX và file thật: tin file thật, sửa INDEX, nêu trong báo cáo.
5. Ngoại lệ: `CLAUDE.md` và `spec.md`/`plan.md`/`tasks.md` của feature đang làm luôn đọc đầy đủ.

## 10. Thông báo bước tiếp theo (cuối mỗi lệnh)

Mỗi lệnh khi kết thúc (kể cả khi dừng giữa chừng) phải **in ra màn hình** một khối cuối cùng cho người dùng, là **dòng cuối cùng** của câu trả lời (sau báo cáo, không có gì đứng sau):

```
Bước tiếp theo: `<lệnh hoàn chỉnh>`
<1 dòng: vì sao là lệnh này>
```

Quy tắc:
1. Lệnh phải **chép chạy được ngay**: có ID thật (`/sdd-lite:plan 0003`, không phải `<ID>`), trừ khi cần người dùng điền nội dung (ví dụ `/spec <ý tưởng feature>`).
2. Lệnh `init` và `plan` ghi dạng đầy đủ `/sdd-lite:init`, `/sdd-lite:plan` vì trùng lệnh có sẵn của Claude Code; các lệnh khác ghi dạng ngắn.
3. Chọn lệnh theo kết quả **thực tế** của lượt chạy, theo bảng dưới. Dừng giữa chừng thì chỉ lệnh cần chạy để gỡ vướng, không chỉ lệnh kế tiếp của luồng.
4. Có nhiều khả năng thì liệt kê tối đa 2 lệnh, đánh dấu lệnh nên chạy trước.

| Lệnh vừa chạy xong | Tình huống | Bước tiếp theo |
|---|---|---|
| `init` | xong | `/spec <ý tưởng feature đầu tiên>` |
| `spec` | còn `[CẦN LÀM RÕ]` | `/spec <ID> <trả lời>` (hoặc "đồng ý đề xuất") |
| `spec` | hết câu hỏi mở | `/sdd-lite:plan <ID>` |
| `plan` | xong | `/task <ID>` |
| `plan` | spec có vấn đề | `/spec <ID> <chỉnh sửa>` |
| `task` | xong | `/implement <ID>` |
| `implement` | còn việc chưa `[x]` hoặc review còn tồn đọng | `/implement <ID>` |
| `implement` | xong hết | `/sync-domain <ID>` |
| `implement` | spec/plan sai hoặc thiếu | `/spec <ID> ...` hoặc `/sdd-lite:plan <ID>` |
| `sync-domain` | đã `done` | `/push <ID>` |
| `sync-domain` | còn khoảng trống CRITICAL/HIGH | `/implement <ID>` rồi chạy lại `/sync-domain <ID>` |
| `push` | đã đẩy | xem và merge PR; feature mới: `/spec <ý tưởng feature>` |
