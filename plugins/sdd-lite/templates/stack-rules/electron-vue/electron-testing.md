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
| Component | Vitest + `@vue/test-utils` (môi trường `jsdom`/`happy-dom`) | **Chỉ** component có logic tương tác đáng kể (form, luồng nhiều bước); bỏ qua component chỉ hiển thị |
| E2E | Playwright với `_electron.launch()` | Luồng người dùng chính trên app thật đã build |

## Quy tắc
- **Ít mà chắc:** chỉ test luồng quan trọng và quy tắc nghiệp vụ; không test code tầm thường, không viết nhiều test chỉ khác dữ liệu mẫu (dùng `it.each`). Chi tiết ở mục 6b của `conventions.md` của plugin.
- Test viết trước, theo kịch bản trong `spec.md`: mỗi KB P1 một test luồng chính, thêm nhánh lỗi chỉ khi spec nêu.
- Logic nghiệp vụ phải nằm trong module không phụ thuộc `electron` để test không cần mock nặng. Nếu buộc phải mock, mock ở **biên** (`ipcMain`, `dialog`, `fs`), không mock logic đang kiểm.
- Component test mock `window.api` bằng đối tượng có đúng kiểu; không gọi IPC thật.
- Validate đầu vào IPC: test **một lần** ở schema/hàm validate dùng chung (bảng ca hợp lệ/sai), không lặp lại cho từng `ipcMain.handle`. Handler chỉ cần test nếu có logic riêng ngoài việc chuyển tiếp.
- E2E chỉ cho luồng quan trọng (khởi động, luồng nghiệp vụ lõi, lưu/đọc dữ liệu); chạy trên bản build, dùng thư mục dữ liệu tạm cho mỗi lần chạy, không đụng dữ liệu thật của người dùng.
- Test không phụ thuộc thứ tự, không phụ thuộc thời gian thực (dùng fake timers), không sleep cố định.
- Không đặt chỉ tiêu độ phủ; đừng thêm test chỉ để tăng con số.
