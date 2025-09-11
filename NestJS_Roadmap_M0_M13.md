# 📘 Roadmap Backend NestJS (M0 → M13)

## M0 -- Bootstrap Project

- Tạo thư mục dự án `NestJSprojectBA`.
- `npm init -y`.
- Cài NestJS core + TypeScript
  (`@nestjs/core @nestjs/common rxjs typescript ts-node @types/node`).
- Tạo `tsconfig.json`.
- Cài ESLint + Prettier.
- Cài Jest (`jest ts-jest @types/jest`).
- Tạo skeleton `main.ts`, `app.module.ts`, `app.controller.ts`,
  `app.service.ts`.
- Scripts npm: `start`, `start:dev`, `build`, `lint`, `format`,
  `test`.

## M1 -- Config Module

- Thêm `@nestjs/config`.
- Đọc `.env` qua `ConfigModule.forRoot({ isGlobal: true })`.
- Tạo `config/` folder (vd: `config/database.config.ts`).
- Fail-fast: nếu thiếu env → throw error.
- Validation env bằng `class-validator`.

## M2 -- Database SQLLite

- Cài `pg` + ORM (TypeORM hoặc Prisma).
- Config kết nối từ `.env`.
- Tạo `database.module.ts`.
- Migration script.
- CRUD model cơ bản (User).

## M3 -- User Module

- Tạo `users/` với controller, service, entity.
- CRUD User.
- DTO + validation (`class-validator`, `class-transformer`).
- Quy tắc: chỉ Admin có thể CRUD, user thường chỉ đọc profile.

## M4 -- Authentication (JWT)

- Cài `@nestjs/passport passport passport-jwt`.
- Cài `bcrypt` để hash password.
- Login, Register, Refresh token.
- Guard `JwtAuthGuard`.
- Protect routes.

## M5 -- Authorization (RBAC)

- Role-based guard.
- Decorator `@Roles('admin')`.
- Admin vs User permission.
- Liên kết Role với User entity.

## M6 -- Authentication (Session + Cookie)

- Cài `express-session` + `@nestjs/passport passport-local`.
- Config session store.
- CSRF protection.
- Logout với session.

## M7 -- Authentication (OAuth2)

- Cài `passport-google-oauth20`, `passport-github2`.
- Tạo `auth.oauth.ts`.
- Đăng nhập Google/GitHub.
- Mapping dữ liệu OAuth → User entity.

## M8 -- Business Module (Task/Article)

- Tạo module `tasks/`.
- CRUD Task (title, description, ownerId).
- User thường: chỉ thấy task của mình.
- Admin: thấy tất cả.
- Test với JWT/Session/OAuth.

## M9 -- Security

- Cài `helmet`, `rate-limiter-flexible`.
- Config CORS.
- Hash password (bcrypt).
- Refresh + access token tách biệt.
- CSRF cho session.
- Rate limit login để chống brute-force.

## M10 -- Logging

- Tích hợp `winston` hoặc NestJS Logger.
- Middleware log request/response.
- Tạo custom logger service.
- Lưu log vào file.

## M11 -- Error Handling & Validation

- Global exception filter.
- Class-validator cho DTO.
- Custom pipes.
- Interceptor transform response (success wrapper).

## M12 -- Testing

- Unit test service (Jest).
- E2E test controller (Supertest).
- Test auth flow (register → login → access protected route).
- Coverage report.

## M13 -- Deployment

- Tạo `Dockerfile` + `docker-compose.yml` (NestJS + SQLLite).
- Script DB migration trong Docker.
- Hướng dẫn deploy local vs production.
- Optional: Heroku/Render/Railway/AWS EC2.
- Add `README.md` chi tiết:
  - Giới thiệu
  - Cài đặt
  - Chạy local
  - Deploy
  - Swagger API docs
  - Cách đổi authentication method
