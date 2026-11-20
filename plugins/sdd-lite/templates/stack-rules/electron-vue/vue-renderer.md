---
paths:
  - "src/renderer/**"
  - "**/*.vue"
---

# Vue 3 (renderer)

## Cú pháp và cấu trúc
- Vue 3 + Composition API + `<script setup lang="ts">`. Không dùng Options API cho mã mới.
- Props và emits có kiểu: `defineProps<{...}>()`, `defineEmits<{...}>()`. Không truyền object tuỳ ý.
- Tên component nhiều từ, PascalCase (`UserCard.vue`). Một component một trách nhiệm; vượt khoảng 300 dòng thì tách.
- Logic dùng lại tách thành composable `useXxx()` trong `composables/`; trạng thái dùng chung đặt trong store **Pinia** (setup store), không truyền sâu qua props nhiều tầng.
- Tổ chức theo **tính năng** (`features/<tên>/{components,composables,store}`) thay vì theo loại file.

## Reactivity
- `ref` cho giá trị đơn, `reactive` cho object ít đổi hình dạng. Dùng `computed` cho giá trị suy ra; `watch` chỉ cho tác dụng phụ.
- Không phá reactivity bằng cách destructure `reactive`/store; dùng `toRefs`/`storeToRefs`.
- Không sửa trực tiếp props. Muốn đổi thì emit sự kiện hoặc dùng `v-model`/`defineModel`.
- `v-for` luôn có `:key` ổn định (không dùng index nếu danh sách đổi thứ tự).
- Danh sách lớn: virtual scroll, không render hàng nghìn dòng.

## Gọi vào Electron
- Chỉ gọi qua `window.api` (đã có type). Không import module Node/Electron trong mã renderer.
- Bọc lời gọi IPC trong composable hoặc service (`services/`), không rải `window.api` khắp component. Xử lý trạng thái **đang tải / lỗi / rỗng** và hiện thông báo thân thiện, không hiện lỗi thô.
- Đăng ký sự kiện từ main trong `onMounted`, **huỷ trong `onUnmounted`** (tránh rò rỉ và nhận trùng).

## An toàn
- Không dùng `v-html` với nội dung từ ngoài; bắt buộc làm sạch (DOMPurify) nếu thực sự cần.
- Không lưu bí mật trong store hay `localStorage`.

## Chất lượng
- ESLint (`eslint-plugin-vue`, bộ `vue3-recommended`) + `vue-tsc --noEmit` phải sạch trước khi tick xong việc.
- Không `any` không lý do; không `console.log` còn sót.
- Truy cập được: phần tử tương tác dùng `<button>`/`<a>`/label đúng ngữ nghĩa, hỗ trợ bàn phím.
