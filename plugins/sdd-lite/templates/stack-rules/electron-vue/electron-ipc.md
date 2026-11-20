---
paths:
  - "src/main/**"
  - "src/preload/**"
  - "src/renderer/**"
  - "electron/**"
---

# Electron: process và IPC

## Ranh giới process
- **Main process**: truy cập hệ thống (file, mạng, DB, dialog, menu, tray). Giữ mỏng: nhận lệnh, gọi service, trả kết quả.
- **Preload**: chỉ là cầu nối. Không chứa logic nghiệp vụ.
- **Renderer (Vue)**: chỉ giao diện. Không import `electron`, `fs`, `path`, `child_process`. Mọi thứ cần quyền hệ thống đi qua API do preload cung cấp.
- Logic nghiệp vụ viết thành **module thuần** (không import `electron`) để test được bằng Vitest mà không cần khởi động Electron.

## Preload và `contextBridge`
- Chỉ phơi ra **hàm cụ thể** qua `contextBridge.exposeInMainWorld('api', {...})`, mỗi hàm một việc. **Không** phơi `ipcRenderer`, `send`, `on` chung chung hay cho truyền tên kênh tuỳ ý.
- Khai báo kiểu cho `window.api` ở một nơi duy nhất (ví dụ `src/preload/index.d.ts`) để renderer có type.
- Sự kiện từ main sang renderer: hàm đăng ký trả về **hàm huỷ đăng ký**; không để lộ đối tượng `event` gốc.

## Kênh IPC
- Tên kênh khai báo ở **một file hằng số dùng chung** (`<miền>:<hành động>`, ví dụ `settings:get`), không viết chuỗi rải rác.
- Yêu cầu có phản hồi: dùng `ipcRenderer.invoke` + `ipcMain.handle`. Chỉ dùng `send`/`on` cho thông báo một chiều.
- Mỗi `handle` **kiểm tra dữ liệu vào** (schema, ví dụ zod): kiểu, độ dài, giá trị cho phép; từ chối đầu vào sai bằng lỗi rõ ràng. Coi dữ liệu từ renderer là không tin cậy.
- Mỗi `handle` kiểm tra nguồn gửi (`event.senderFrame.url` thuộc ứng dụng) với kênh nhạy cảm.
- Không nhận đường dẫn file tuỳ ý từ renderer rồi đọc/ghi thẳng; dùng hộp thoại `dialog` ở main hoặc chuẩn hoá và giới hạn trong thư mục cho phép (chống path traversal).
- Lỗi: main ném `Error` có thông điệp ngắn; không trả stack trace hay đường dẫn nội bộ về renderer.

## Vòng đời
- Dọn tài nguyên khi đóng cửa sổ/thoát: huỷ listener, đóng handle DB, dừng tiến trình con.
- Tác vụ nặng hoặc chặn (nén, băng thông lớn, CPU) không chạy trên main thread: dùng `utilityProcess` hoặc worker.
