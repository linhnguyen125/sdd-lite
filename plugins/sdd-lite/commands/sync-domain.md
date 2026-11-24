---
description: Đối chiếu code với spec rồi gộp nghiệp vụ và kỹ thuật của feature vào docs/ và đóng feature (done)
argument-hint: <ID> [force]
disable-model-invocation: true
---

# /sync-domain: Hội tụ và đồng bộ tài liệu

Đầu vào: $ARGUMENTS

**Vai trò: QA kiêm Technical Writer.** Trước hết là QA: đối chiếu code với spec dựa trên bằng chứng, không tin lời tự báo cáo. Sau đó là người ghi tài liệu: ghi đúng cái hệ thống đang chạy (không phải cái đã dự định), ngắn gọn, mỗi thông tin chỉ ở một nơi.

Nhiệm vụ: (1) kiểm tra code đã đáp ứng spec chưa; (2) nếu rồi, gộp nghiệp vụ và kỹ thuật của feature vào `docs/domain/` và `docs/tech/`; (3) đóng feature. Đây là bước **bắt buộc** để đóng một feature.

## Bước 1. Chuẩn bị

1. Đọc `${CLAUDE_PLUGIN_ROOT}/reference/conventions.md` và tuân theo toàn bộ.
2. Lấy **ID** là từ đầu tiên của `$ARGUMENTS`, tìm feature bằng `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" get <ID>` (mục 3.2 của `conventions.md`). Không có ID: dừng, hiển thị `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" list --table`.
3. Điều kiện: `spec.md`, `plan.md`, `tasks.md` phải tồn tại. `status` đã là `done`: dừng, báo đã đồng bộ. `cancelled`: dừng.
4. Nếu còn công việc chưa `[x]` (ngoài các công việc đã ghi rõ là bỏ): **dừng**, liệt kê chúng, nhắc `/implement <ID>`. Chỉ tiếp tục khi `$ARGUMENTS` có từ `force`; khi đó ghi rõ trong báo cáo là đồng bộ khi còn dở dang.
5. Đọc đầy đủ `spec.md`, `plan.md`, `tasks.md`. Với `docs/`: theo giao thức đọc docs (mục 9 của `conventions.md`), đọc `docs/INDEX.md` rồi chỉ mở đúng các file/mục sẽ sửa (theo mục 12 của plan).

## Bước 2. Hội tụ: đối chiếu code với spec

Coi `spec.md`, `plan.md`, `tasks.md` là nguồn ý định duy nhất. Đánh giá **mã nguồn hiện tại** (không dựa vào lịch sử git).

**Giới hạn phạm vi đọc (tiết kiệm token):**
- Chỉ đụng tới các file có đường dẫn trong `tasks.md` và mục 7 của plan (file mới/sửa). **Không quét cả `src/`**, không đọc file ngoài danh sách trừ khi một bằng chứng bắt buộc chỉ ra file đó.
- **Grep trước, Read sau:** tìm bằng chứng bằng Grep theo mã truy vết (`FR-001`, `BR-004`), tên hàm/kênh, rồi chỉ Read đoạn quanh kết quả (`offset`/`limit`). Không đọc cả file code dài.
- **Không kiểm lại việc đã có bằng chứng:** `/implement` đã chạy review độc lập và tick công việc. Nếu `tasks.md` đã tick hết, mục "Phát sinh trong lúc triển khai" không còn tồn đọng CRITICAL/HIGH, thì chỉ **kiểm mẫu** bằng chứng cho từng FR P1 và từng BR Mới/Đổi (một lần Grep mỗi mục), không đọc lại toàn bộ code. Có dấu hiệu bất thường (tồn đọng, `force`, tasks.md chỉnh tay) mới kiểm đầy đủ từng mục.
- Chạy test/lint theo `CLAUDE.md` **một lần** (không chạy lại từng phần).

Với từng FR P1, BR (Mới/Đổi) và mục plan cần thiết, tìm bằng chứng theo giới hạn trên.

Phân loại từng khoảng trống:
- `thiếu`: yêu cầu chưa được làm.
- `một phần`: làm chưa đủ.
- `mâu thuẫn`: code làm khác spec.
- `ngoài yêu cầu`: code có thứ spec không yêu cầu.

Mức độ: CRITICAL (sai nghiệp vụ, mất dữ liệu, lỗ hổng), HIGH (một FR P1 thiếu/sai, test thất bại), MEDIUM, LOW.

**Nếu có khoảng trống CRITICAL hoặc HIGH, hoặc test đang thất bại:**
- Thêm một mục `## Phase hội tụ` vào **cuối** `tasks.md` (nếu đã có phase này thì thêm tiếp công việc vào đó), công việc mới mã `T` tiếp theo, mỗi việc ghi khoảng trống và mức độ. Không đổi mã công việc cũ, không bỏ tick công việc đã xong.
- **Dừng**, không sửa `docs/`, không đổi trạng thái. Báo cáo bảng khoảng trống và nhắc `/implement <ID>` rồi chạy lại `/sync-domain <ID>`.
- Không tự sửa code, không tự sửa spec trong bước này.

Nếu chỉ còn MEDIUM/LOW: ghi vào báo cáo và đi tiếp.

## Bước 3. Đồng bộ `docs/domain/`

Dùng mục 12 của plan và mục 3, 4 của spec làm danh sách việc. Mỗi file giữ nguyên cấu trúc template tương ứng trong `${CLAUDE_PLUGIN_ROOT}/templates/`.

1. **`rules.md`:**
   - Quy tắc `BR-NEW-n`: gán mã thật `BR-nnn` kế tiếp (số lớn nhất hiện có + 1), nguồn là ID feature, trạng thái `Hiệu lực`.
   - Quy tắc "Đổi": **không xoá** dòng cũ; đặt trạng thái `Đã thay thế bởi BR-xxx` và thêm dòng mới.
   - Cập nhật "Cập nhật lần cuối".
2. **`entities.md`:** thêm hoặc sửa khối thực thể (thuộc tính, quan hệ, vòng đời, BR liên quan, nguồn). Thực thể mà feature vừa xây trong code: đổi `Hiện trạng` thành `Đã có` và cập nhật theo code thực tế; thực thể chưa xây giữ `Dự kiến`.
3. **`glossary.md`:** thêm thuật ngữ mới (kể cả tên thực thể mới, ví dụ "Cài đặt ứng dụng"), giữ thứ tự bảng chữ cái. Đây là nơi duy nhất định nghĩa thuật ngữ (mục 8.14 của `conventions.md`).
4. **`flows/<slug>.md`:** nếu feature có luồng nhiều bước/tác nhân: tạo mới từ `templates/flow.md` hoặc cập nhật luồng có sẵn.
5. **`overview.md`:** nếu feature thuộc "Hướng tính năng dự kiến", đổi cột Feature thành `<ID> (done)`; cập nhật phạm vi nếu thay đổi.
6. **Ánh xạ mã tạm:** trong `spec.md` mục 3, thay `BR-NEW-n` bằng mã thật (ghi dạng `BR-017 (trước đó BR-NEW-1)`). Đây là chỉnh sửa duy nhất được phép trên spec ở bước này, ngoài frontmatter.

Tài liệu nghiệp vụ **không nhắc công nghệ**.

## Bước 4. Đồng bộ `docs/tech/`

1. **`decisions.md`:** chỉ quyết định **lớn, khó đảo ngược** ở mục 4 của plan mới thành ADR mới (`ADR-nnnn` kế tiếp, nguồn là ID feature; ngưỡng ở mục 8.12 của `conventions.md`). Quyết định nhỏ ghi một dòng vào `architecture.md` hoặc `data-schema.md`. ADR không chép chi tiết đã có ở `data-schema.md`/`api.md`, chỉ trỏ tới (mục 8.13). Quyết định đã được người dùng duyệt thì đổi `Đề xuất` thành `Hiệu lực`. Quyết định thay thế quyết định cũ: đổi trạng thái cũ thành `Đã thay thế bởi ADR-xxxx`.
2. **`architecture.md`:** cập nhật thành phần, công nghệ, luồng dữ liệu, cấu trúc thư mục nếu feature làm đổi; thành phần vừa xây đổi `Hiện trạng` thành `Đã có`, phần chưa xây giữ `Dự kiến`; sửa "Cập nhật lần cuối".
3. **`data-schema.md`:** nếu plan có thay đổi dữ liệu: tạo từ `templates/data-schema.md` nếu chưa có, rồi thêm/sửa theo **schema thực tế trong code** (đối chiếu **chỉ** file migration/model đã nêu ở mục 7 của plan, không chép từ plan nếu code khác).
4. **`api.md`:** nếu có giao diện mới/đổi: tạo từ `templates/api.md` nếu chưa có, rồi cập nhật theo code thực tế (**chỉ** file khai báo kênh/route đã nêu ở mục 7 của plan).

Với `docs/`: **chỉ sửa đúng H2/mục liên quan** (theo mục 12 của plan), dùng Edit tại chỗ; không ghi lại cả file, không đọc lại file docs không nằm trong danh sách sửa.
5. **`CLAUDE.md`:** nếu lệnh chạy/test, cấu trúc mã nguồn hoặc quy ước đã đổi, cập nhật phần tương ứng.

## Bước 4b. Cập nhật `docs/INDEX.md` và quy chuẩn docs

Làm **sau cùng** của việc sửa docs, theo mục 8 của `conventions.md`:

1. Mọi file/H2 vừa thêm, xoá, đổi tên: cập nhật `docs/INDEX.md` (bảng "Tài liệu", nhóm quy tắc kèm dải mã BR, thực thể, luồng, ADR kèm trạng thái). Sửa "Cập nhật lần cuối".
2. Mỗi file docs vừa sửa: còn đủ H1, dòng `> Tóm tắt` (sửa nếu nội dung đã đổi), dòng `Cập nhật lần cuối`.
3. **Kiểm tra cỡ file:** file nào trong `docs/` vượt khoảng 400 dòng thì tách theo H2 thành thư mục cùng tên (mục 8.6), rồi cập nhật INDEX và mọi liên kết trỏ tới. Nêu rõ việc tách trong báo cáo.
4. **Đối chiếu INDEX với thực tế:** Glob `docs/**/*.md` và Grep (`^## `) các H2 của `rules.md`, `entities.md`, `decisions.md` (chỉ in dòng H2, không đọc nội dung); mọi file và mục phải có trong INDEX, INDEX không được trỏ tới thứ không tồn tại.

## Bước 5. Đóng feature

- Chạy `node "${CLAUDE_PLUGIN_ROOT}/scripts/features.js" set <ID> --status done` (công cụ tự cập nhật bảng ánh xạ, `status` và `updated` trong `spec.md`).
- `tasks.md`: xác nhận dòng "Tiến độ" đúng.

## Bước 6. Tự kiểm tra

- [ ] Không còn `BR-NEW-` trong `spec.md` của feature, không còn `{{` hay chú thích HTML trong các file đã sửa.
- [ ] Mã BR/ADR mới liên tục, không trùng, không tái sử dụng.
- [ ] Không xoá quy tắc/quyết định cũ; chỉ đổi trạng thái.
- [ ] `docs/domain/` không nhắc công nghệ.
- [ ] Mọi thực thể và thành phần có `Hiện trạng` đúng với code; không ADR nào ghi trạng thái lẫn kiểu "Hiệu lực (đề xuất)"; ADR mới đạt ngưỡng 8.12 và không chép chi tiết đã có ở nơi khác.
- [ ] Mục 12 của plan đã được xử lý hết.
- [ ] `docs/INDEX.md` khớp hoàn toàn với file và H2 thực tế; không file docs nào vượt khoảng 400 dòng mà chưa tách.
- [ ] Mỗi thông tin chỉ nằm ở một nơi; nơi khác trỏ bằng mã (không chép lại).

## Bước 7. Báo cáo

1. Feature `<ID> · <Tên>` đã `done` (hoặc lý do dừng).
2. Bảng khoảng trống còn lại (nếu có, mức MEDIUM/LOW).
3. Danh sách thay đổi theo từng file docs (thêm gì, đổi gì, mã BR/ADR mới).
4. Feature kế tiếp gợi ý trong `overview.md` mục 6 (nếu có).
5. **Dòng cuối cùng** là thông báo bước tiếp theo theo mục 10 của `conventions.md`: đã `done` thì `/push <ID>` (đẩy lên GitHub: nhánh + pull request); còn khoảng trống CRITICAL/HIGH hoặc dừng sớm thì `/implement <ID>`, rồi chạy lại `/sync-domain <ID>`.
