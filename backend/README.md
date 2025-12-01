# Code thử nghiệm ReactJS

### Lưu ý
- Lệnh chạy: `npm run dev`
- Các file trong đây không phải là JavaScript, mà là TypeScript (giống JS nhưng có type và interface các thứ,...) nên file không phải là .jsx mà là .treadsx

### Cấu trúc chính
Chia theo các module (Chat, Home, ...)

Mỗi module sẽ bao gồm:
- components/
- pages/
- hooks/
- utils/
- ...

Ngoài ra, ở ngoài các modules có folder shared/, cấu trúc giống các module bên trong, chứa những code có khả năng tái sử dụng cao.

### Một số thư viện / framework cần tìm hiểu
1. TailwindCSS (ý tưởng là giống **Bootstrap**, thêm những class đã được định nghĩa sẵn)
2. Shadcn (UI kit gồm các components và blocks xây sẵn)
- Component: Ví dụ như button, sidebar, card, carousel (https://ui.shadcn.com/docs/components)
- Block: Ví dụ như admin dashboard có sidebar, trang login, trang xác nhận OTP,... (https://ui.shadcn.com/blocks)
- Muốn dùng 1 component hoặc block có sẵn thì chỉ cần vào terminal gõ:

  ```bash
  npx shadcn@latest add (tên component hoặc block muốn dùng)
  ```

  Khi đó sẽ tự động có 1 đống file .tsx được thêm vào shared/components

  + Nếu đó là component thì các file mới sẽ được thêm vào 1 folder ui/ ở trong đó
  + Nếu là 1 block thì nó sẽ ở trong folder components chứ ko phải folder ui/, khuyến khích chuyển đống đó sang module riêng.

3. Lucide React: Đơn giản chỉ là 1 thư viện icon, có web để tra icon nên không cần quan tâm lắm.

### Project này đang sử dụng mẫu block
A left and right sidebar (https://ui.shadcn.com/blocks/sidebar#sidebar-15) 