---
paths:
  - "src/main/**"
  - "src/preload/**"
  - "electron/**"
  - "**/*.html"
---

# Electron: bảo mật (bắt buộc)

Ứng dụng desktop chạy với quyền của người dùng, một lỗ hổng ở renderer có thể thành chiếm máy. Các điều dưới đây không có ngoại lệ nếu không có ADR ghi lý do.

## Cấu hình cửa sổ
- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, `webSecurity: true`. Không bao giờ tắt; đây cũng là mặc định của Electron hiện đại, đừng ghi đè ngược lại.
- Không bật `nodeIntegrationInWorker`, `nodeIntegrationInSubFrames`, `allowRunningInsecureContent`, `enableBlinkFeatures`.
- Không dùng module `remote`.

## Nội dung và điều hướng
- Chỉ nạp nội dung **của chính ứng dụng** (`file://` tới bundle, hoặc dev server khi `NODE_ENV=development`). Không `loadURL` trang web bên ngoài vào cửa sổ có preload.
- Đặt `webContents.setWindowOpenHandler(() => ({ action: 'deny' }))` và chặn `will-navigate` tới origin lạ.
- `shell.openExternal` chỉ nhận URL đã kiểm tra: parse bằng `new URL()`, cho phép `https:` (và `mailto:` nếu cần). Không truyền chuỗi người dùng/mạng vào thẳng.
- Có Content-Security-Policy trong `index.html` hoặc qua `session.webRequest`: `default-src 'self'`; không dùng `unsafe-eval`; `unsafe-inline` chỉ khi bắt buộc và có lý do.

## Bí mật và dữ liệu
- Không đưa khoá API, token vào mã nguồn hay bundle renderer (mã renderer đọc được bằng DevTools). Bí mật của người dùng lưu bằng `safeStorage`; bí mật của dịch vụ để ở backend.
- Không ghi bí mật, token, đường dẫn cá nhân vào log.

## Đường ống cập nhật và đóng gói
- Cập nhật Electron theo bản vá bảo mật; không ghim phiên bản cũ quá hạn hỗ trợ.
- Bật Electron Fuses khi đóng gói: `RunAsNode` tắt, `EnableNodeCliInspectArguments` tắt, `OnlyLoadAppFromAsar` bật.
- Auto-update chỉ qua kênh HTTPS và bản phát hành đã ký.
