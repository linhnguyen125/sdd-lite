---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "tests/**"
  - "e2e/**"
---

# Kiểm thử cho Electron + Vue

## Phân tầng
| Tầng | Công cụ | Kiểm gì |
|---|---|---|
| Đơn vị (logic thuần ở main và renderer) | Vitest | Quy tắc nghiệp vụ, hàm tiện ích, validate IPC, store Pinia |
| Component | Vitest + `@vue/test-utils` (môi trường `jsdom`/`happy-dom`) | Hiển thị, sự kiện, các trạng thái tải/lỗi/rỗng |
| E2E | Playwright với `_electron.launch()` | Luồng người dùng chính trên app thật đã build |

## Quy tắc
- Test viết trước, theo kịch bản trong `spec.md` (mỗi KB/SC P1 có ít nhất một test).
- Logic nghiệp vụ phải nằm trong module không phụ thuộc `electron` để test không cần mock nặng. Nếu buộc phải mock, mock ở **biên** (`ipcMain`, `dialog`, `fs`), không mock logic đang kiểm.
- Component test mock `window.api` bằng đối tượng có đúng kiểu; không gọi IPC thật.
- Mỗi `ipcMain.handle` có test cho: đầu vào hợp lệ, đầu vào sai (bị từ chối), lỗi từ dịch vụ phía dưới.
- E2E chỉ cho luồng quan trọng (khởi động, luồng nghiệp vụ lõi, lưu/đọc dữ liệu); chạy trên bản build, dùng thư mục dữ liệu tạm cho mỗi lần chạy, không đụng dữ liệu thật của người dùng.
- Test không phụ thuộc thứ tự, không phụ thuộc thời gian thực (dùng fake timers), không sleep cố định.
- Độ phủ: logic nghiệp vụ nhắm tối thiểu 80%; không chạy theo con số cho phần giao diện thuần.
