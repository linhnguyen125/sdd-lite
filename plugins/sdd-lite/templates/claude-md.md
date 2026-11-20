# {{Tên dự án}}

{{2–3 câu: dự án là gì, dành cho ai, giải quyết vấn đề gì.}}

## Công nghệ
| Hạng mục | Lựa chọn |
|---|---|
| Ngôn ngữ / framework | {{...}} |
| Lưu trữ | {{...}} |
| Kiểm thử | {{...}} |
| Triển khai | {{...}} |

## Lệnh thường dùng
```
{{cài đặt}}
{{chạy dev}}
{{chạy test}}
{{lint / kiểm tra kiểu}}
{{build}}
```

## Cấu trúc mã nguồn
{{Các thư mục chính và vai trò, 3–8 dòng. Chưa có code: ghi "Chưa có, sẽ chốt ở feature đầu tiên".}}

## Quy ước code
- {{Đặt tên, định dạng, xử lý lỗi, ...}}

## Nguyên tắc dự án
<!-- 3–5 nguyên tắc cố định. /plan đối chiếu với mục này. -->
1. {{Ví dụ: Logic nghiệp vụ phải có test viết trước.}}
2. {{Ví dụ: Không đưa bí mật vào mã nguồn; đọc từ biến môi trường.}}
3. {{Ví dụ: Ưu tiên giải pháp đơn giản nhất chạy được.}}

## Quy trình làm việc (SDD Lite)
Mỗi feature có một ID cố định (`0001`, `0002`, ...), thư mục `specs/<ID>/`.

| Lệnh | Việc làm |
|---|---|
| `/spec <ý tưởng>` | Tạo hoặc tìm feature, viết `spec.md` (nghiệp vụ) |
| `/spec <ID> <bổ sung>` | Cập nhật spec, trả lời câu hỏi mở |
| `/plan <ID>` | Viết `plan.md` (kỹ thuật) |
| `/task <ID>` | Sinh `tasks.md` |
| `/implement <ID>` | Thực thi công việc theo thứ tự, test trước |
| `/sync-domain <ID>` | Đối chiếu code với spec, gộp nghiệp vụ vào `docs/` |
| `/push <ID>` | Đẩy feature `done` lên GitHub: nhánh `feature/<ID>`, commit và push bằng git, pull request bằng MCP github |

## Tài liệu: đọc gì khi nào
- **Đọc `docs/INDEX.md` trước** để biết file nào chứa gì và khi nào cần đọc. Không đọc cả `docs/`; dùng Grep theo mã (`BR-012`, `ADR-0003`) hoặc tên thực thể rồi đọc đoạn liên quan.
- Nghiệp vụ hiện tại: `docs/domain/` (`overview.md`, `rules.md`, `entities.md`, `glossary.md`, `flows/`).
- Kỹ thuật hiện tại: `docs/tech/` (`architecture.md`, `decisions.md`, `data-schema.md`, `api.md`).
- Danh mục feature (ID ↔ tên): khối `REGISTRY` trong `specs/features.js`, hoặc chạy `node specs/features.js list --table`.
- Sửa `docs/` thì cập nhật `docs/INDEX.md` trong cùng lượt.
- Quy tắc: `docs/domain/` và `docs/tech/` mô tả hệ thống **như đang chạy**; `specs/` mô tả **thay đổi** từng feature. Feature `done` không sửa trực tiếp, thay đổi sau đó là feature mới.
