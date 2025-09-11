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

## M5 – Auth Module + JWT(JSON Web Token)

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

## M6 – Guard + Role-based Access (Authorization với RBAC (Role-based Access Control))

- Mục tiêu: Kiểm soát quyền truy cập theo role.

- File tạo:
- src/auth/jwt-auth.guard.ts
- src/auth/roles.guard.ts
- src/auth/roles.decorator.ts

- Tác dụng file:
- jwt-auth.guard.ts: check token JWT có hợp lệ không.
- roles.guard.ts: đọc metadata, check role của user có khớp không.
- roles.decorator.ts: tạo, gán metadata @Roles('admin') vào route.

- Tổng kết:
- API yêu cầu login: dùng JwtAuthGuard.
- API yêu cầu role cụ thể: @UseGuards(JwtAuthGuard, RolesGuard) + @Roles('admin').

- Bổ sung:
- Sử dụng ROLES_KEY để định danh metadata.
- APP_GUARD sử dụng ở auth.module -> chạy toàn cục, không cần gắn từng controller.
- @UseGuards -> áp dụng cục bộ, hoặc override behavior.

## M7 – Authentication (OAuth2 + Session)

- OAuth login thông qua bên thứ 3 (gg, github, fb, ...)
- session (kho lưu trữ tạm thời) -> nhận biết user login (mỗi lần login là 1 session)
- sessionId được lưu trên server, user gửi request kèm sessionId, server tìm thông tin user qua sessionId
- JWT: không lưu ở server, lưu ở client, thồn tin lưu được mã hóa dựa trên SECRET_KEY

| Tiêu chí           | Session-based        | JWT (Token-based)        | OAuth2                  |
| ------------------ | -------------------- | ------------------------ | ----------------------- |
| Kiểu lưu trữ       | Server giữ session   | Client giữ token         | Client giữ              |
|                    |                      |                          | accesstoken             |
|                    |                      |                          |                         |
| Trạng thái         | **Stateful**         | **Stateless**            | **Stateless**           |
|                    |                      |                          |                         |
| Scale nhiều server | Khó                  | Dễ                       | Dễ                      |
|                    | (phải share session) | (chỉ cần verify token)   | (token do provider cấp) |
|                    |                      |                          |                         |
| Xóa ngay           | Dễ (xóa trên server) | Khó (chỉ chờ token       | Phụ thuộc vào provider  |
|                    |                      | hết hạn hoặc blacklist)  |                         |
|                    |                      |                          |                         |
| Bảo mật            | An toàn nếu          | Token dễ lộ, cần HTTPS   | An toàn, xác thực chéo  |
|                    | bảo vệ cookie        |                          |                         |
|                    |                      |                          |                         |
| Use case           | Web truyền thống     | SPA, mobile, API backend | Login qua google,       |
|                    | intranet             |                          | github, ...             |

- Session: đơn giản, phù hợp web truyền thống.
- JWT: linh hoạt, stateless, phù hợp API/mobile.
- OAuth2: chuyên cho SSO và login qua bên thứ ba.

## M8 - CRUD TASK + ENTITY

- Tạo module Task
- thêm module task to app server

## M9 - Security

- CSRF - Cross-Site Request Forgery = tấn công “giả mạo yêu cầu từ site khác”.
- sessionId lưu ở cookie bị lộ -> request -> server nhận sessionId -> thực hiện request
- CSRF Protection:
- CSRF token: Server sinh ra một token ngẫu nhiên -> nhúng vào form hoặc header -> server kiểm tra token khi có request.
- SameSite Cookie: Gắn thuộc tính SameSite cho cookie -> browser không gửi cookie khi request từ domain khác.
- Origin/Referer: Server kiểm tra Origin header hoặc Referer có khớp domain không
- Double Submit Cookie: Server gửi 1 cookie CSRF token + nhúng token vào form. Client gửi cả cookie và form token -> server so sánh 2 giá trị -> nếu khớp thì hợp lệ.

- helmet là tập hợp các middleware bảo mật header HTTP.
- vd:
- Content-Security-Policy (CSP): Ngăn chặn XSS (Cross-Site Scripting) bằng cách chỉ cho phép tải script, style, image từ nguồn đáng tin cậy.
- X-Frame-Options: Ngăn clickjacking (chèn trang vào iframe để lừa user).
- Strict-Transport-Security (HSTS): Ép buộc trình duyệt chỉ dùng HTTPS, không cho phép HTTP (
  có thể tắt: app.use(helmet({hsts: false}));
  )
- X-Content-Type-Options: Ngăn trình duyệt đoán sai loại MIME.
- X-XSS-Protection (dành cho trình duyệt cũ): Bật bộ lọc XSS của browser.
- Referrer-Policy: Kiểm soát thông tin referrer (nguồn gốc request) mà browser gửi đi.
- Cross-Origin Resource Policy / Cross-Origin Embedder Policy / Cross-Origin Opener Policy: Giúp chống một số tấn công liên quan đến CORS và chia sẻ tài nguyên giữa các origin khác nhau.

- Rate limiting: giới hạn số lượng request cho 1 client(IP, user, token, ...)
- Ngăn DDoS (Distributed Denial of Service): quá nhiều request làm server quá tải.
- Giảm brute-force attack (ví dụ: thử password liên tục).
- Kiểm soát API usage: giới hạn số request cho từng user/token.

- CORS: Cross-Origin Resource Sharing: Chỉ cho phép web (frontend) gọi API từ cùng origin (protocol + domain + port).

- Hash password (bcrypt): mã hóa password bằng bcrypt

## M10 - Logging

- AuditLog Entity: cấu trúc bảng để lưu log.
- DTO: định nghĩa dữ liệu khi ghi log.
- Service: API nội bộ để ghi/xem log.
- Controller: cho phép admin truy vấn log.
- Module: đóng gói, export để dùng trong toàn hệ thống.

## M11 - Error Handling & Validation

- Global exception filter: đảm bảo mọi lỗi đều trả về 1 format thống nhất.
- Class-validator cho DTO: validate dữ liệu đầu vào.
- Custom pipes: Pipe trong NestJS dùng để transform và validate dữ liệu trước khi đến controller.
- Interceptor transform response (success wrapper): format response trả về từ API(success wrapper). có thể transform tất cả API hoặc một API nhất định(@UseInterceptors(TransformInterceptor)).

## M12 - Testing

- npm install --save-dev @nestjs/testing
- tạo file jest.config, thêm moduleNameMapper để jest nhận diện đường dẫn @
- tạo unit test cho các chức năng của service và controller

- Test service: đảm bảo logic chức năng hoạt động đúng, không phụ thuộc HTTP layer: check CRUD, check function xử lý, có thê mock reponsitory (fake data DB) để test nhanh mà không cần connect DB
- => test chức năng của ứng dụng -> đảm bảo logic xử lý chuẩn.

- Test controller: đảm bảo API endpoint hoạt động đúng khi gọi từ bên ngoài:
- kiểm tra endpoint format data, status code;
- Test flow request → controller → service → response;
- Xác minh request DTO validation, response shape (ví dụ có id, username), và HTTP status (201, 200, 404, 400...);
- Thường mock service, để controller test chỉ tập trung vào request/response, không test lại business logic.
- => kiểm tra API ứng dụng -> đảm bảo API endpoints hoạt động đúng, dữ liệu trả về đúng cho client.

- e2e: sử dụng supertest, giả lập request thực tế từ client đến API , đi qua toàn bộ pipeline NestJS (middleware -> guard -> interceptor -> service -> DB) => đảm bảo controller mapping đúng route, kiểm tra dữ liệu trả về client.
- auth flow (reg -> log -> access): kiểm tra luồng đăng nhập
- cần có jest-e2e.json để tạo lệnh test npm run test:e2e

- Coverage report: kiểm tra xem bao nhiêu code đã được test => cải thiện chất lượng test
- chay coverage: npm run test:cov

- có thể tạo lệnh scripts để chạy đồng thời: "test:all": "npm run test:cov && npm run test:e2e -- --coverage"

## M13 - Deployment
