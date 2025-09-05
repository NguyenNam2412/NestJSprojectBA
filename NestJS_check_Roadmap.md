# check list and note for roadmap

## M0 – Khởi tạo project

- Mục tiêu: Tạo skeleton project NestJS.

- File tạo:
- main.ts
- app.module.ts
- app.controller.ts
- app.service.ts

- Tác dụng file:
- main.ts: entry point, khởi chạy app Nest.
- app.module.ts: root module, import các module khác.
- app.controller.ts: định nghĩa route cơ bản.
- app.service.ts: xử lý logic đơn giản, ví dụ return “Hello World”.

- Tổng kết: Xây dựng bộ khung chuẩn của một app NestJS.

## M1 – Config và Validation

- Mục tiêu: Quản lý biến môi trường và validate config.

- File tạo:
- .env
- src/config/configuration.ts
- src/config/validation.ts

- Tác dụng file:
- .env: chứa biến môi trường (DB, PORT, SECRET…).
- configuration.ts: load các biến .env và export object config.
- validation.ts: dùng Joi để validate biến môi trường khi load.

- Tổng kết: Đảm bảo cấu hình chuẩn, tránh runtime error do thiếu biến môi trường.

## M2 – Database Module

- Mục tiêu: Kết nối database qua TypeORM.

- File tạo:
- src/database/database.module.ts

- Tác dụng file:
- database.module.ts: dùng TypeOrmModule.forRootAsync để kết nối DB động qua .env.

- Tổng kết: Thiết lập kết nối database chuẩn.
- Bổ sung:
- Các DB như PostgreSQL, MySQL, Oracle cần driver ngoài.
- SQLite chỉ cần file .sqlite, không cần user/pass.

## M3 – Cấu trúc Module

- Mục tiêu: Chia module rõ ràng (Separation of concerns).

- File tạo:
- src/
  config/
  database/
  user/
  user.module.ts
  user.controller.ts
  user.service.ts
  user.entity.ts
  auth/
  auth.module.ts
  auth.controller.ts
  auth.service.ts
  jwt.strategy.ts
  app.module.ts

- Tác dụng file:
- entity.ts: Định nghĩa bảng trong DB.
  Chứa: Decorator @Entity('users'), các cột @Column() như id, username, password, role.
  Ý nghĩa: Mỗi entity tương ứng với một bảng thật trong database.

- module.ts: Import TypeOrmModule.forFeature([...]) → để inject repository ... vào service.
  Đăng ký Service và Controller.
  Ý nghĩa: Nơi gom toàn bộ logic liên quan.

- service.ts: Vai trò: Xử lý business logic.
  Chứa: Các hàm CRUD (createUser, findAll, findById, update, delete).
  Tương tác DB qua @InjectRepository(...).
  Ý nghĩa: Tách logic khỏi controller, code dễ bảo trì, test unit dễ hơn.

- controller.ts: Vai trò: Định nghĩa route cho user.
  Chứa: Các API như GET /..., POST /..., GET /.../:id.
  Gọi sang Service.
  Ý nghĩa: Chỉ làm nhiệm vụ “nhận request → gọi service → trả response”.

- auth.\*: xử lý login, JWT, strategy.

- jwt.strategy.ts: Vai trò: Xử lý verify JWT khi có request gửi token.
  Chứa: Class JwtStrategy extends PassportStrategy(Strategy).
  Ý nghĩa: Khi API được bảo vệ bởi JwtAuthGuard, Nest sẽ chạy JwtStrategy để giải mã token và trả về user.

- Tổng kết: App module (app.module.ts) import cả UserModule và AuthModule.
- Controller <-> Service <-> Repository được liên kết rõ ràng, mỗi module tự quản lý.

## M4 – User Module + Entity

- Mục tiêu: Xây dựng bảng user trong DB.

- File tạo:
- src/user/user.entity.ts

- Tác dụng file:
- user.entity.ts: định nghĩa bảng users bằng decorator @Entity, chứa các cột (id, username, password, role...).

- Tổng kết: Tự động sync với DB, có thể thêm/xóa/sửa bảng chỉ cần chỉnh entity.

## M5 – Auth Module + JWT

- Mục tiêu: Tạo login/register với JWT.

- File tạo:
- src/auth/auth.module.ts
- src/auth/auth.service.ts
- src/auth/auth.controller.ts
- src/auth/jwt.strategy.ts

- Tác dụng file:
- auth.module.ts: import JwtModule, config JWT secret/expiry.
- auth.service.ts: xử lý login, validate user.
- auth.controller.ts: expose API /auth/login, /auth/register.
- jwt.strategy.ts: verify JWT khi request gửi kèm token.

- Tổng kết: Hoàn chỉnh login với JWT, backend biết được user nào đang request.

## M6 – Guard + Role-based Access

- Mục tiêu: Kiểm soát quyền truy cập theo role.

- File tạo:
- src/auth/jwt-auth.guard.ts
- src/auth/roles.guard.ts
- src/auth/roles.decorator.ts

- Tác dụng file:
- jwt-auth.guard.ts: check token JWT có hợp lệ không.
- roles.decorator.ts: tạo metadata @Roles('admin').
- roles.guard.ts: check role của user có khớp không.

- Tổng kết:
- API yêu cầu login: dùng JwtAuthGuard.
- API yêu cầu role cụ thể: @UseGuards(JwtAuthGuard, RolesGuard) + @Roles('admin').

- Bổ sung:
- Sử dụng ROLES_KEY để định danh metadata.
