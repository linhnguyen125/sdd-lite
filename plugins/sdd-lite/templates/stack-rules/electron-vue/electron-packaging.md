---
paths:
  - "electron-builder.*"
  - "forge.config.*"
  - "package.json"
  - ".github/workflows/**"
  - "build/**"
---

# Electron: đóng gói và phát hành

- Dùng **một** công cụ đóng gói (electron-builder hoặc Electron Forge), chốt bằng ADR; không trộn cả hai.
- Phiên bản ứng dụng theo SemVer, nguồn duy nhất là `package.json`.
- Phụ thuộc: chỉ để vào `dependencies` thứ thực sự chạy trong app; công cụ build/test để `devDependencies` để bundle nhỏ.
- Module native (SQLite, serialport, ...): rebuild đúng phiên bản Electron (`electron-rebuild` hoặc cấu hình của công cụ đóng gói), kiểm tra trên **mỗi hệ điều hành mục tiêu**, không chỉ máy dev.
- Ký mã (Windows code signing, macOS signing + notarization) cho bản phát hành. Chứng chỉ và mật khẩu chỉ nằm trong secret của CI, không vào repo.
- Auto-update (`electron-updater` hoặc tương đương): chỉ HTTPS, bản đã ký, có cách quay lui khi bản mới lỗi. Thử luồng cập nhật trước khi phát hành.
- Đường dẫn dữ liệu người dùng lấy từ `app.getPath('userData')`; không ghi vào thư mục cài đặt. Có kế hoạch di trú dữ liệu khi đổi cấu trúc (migration có phiên bản).
- Build chạy trên CI từ nhánh sạch: `lint` → `vue-tsc` → test → build → (E2E trên bản build) → ký → phát hành. Bản phát hành không được lẫn mã debug hay `devTools` mở sẵn.
