import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth Flow (E2E)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  let token: string;

  it('Register a new user', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: '123456',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('testuser');
  });

  it('Login with registered user', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: '123456',
      })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    token = res.body.access_token;
  });

  it('Access protected route with token', async () => {
    const res = await request(server)
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.username).toBe('testuser');
  });

  it('Fail to access protected route without token', async () => {
    return request(server).get('/users/profile').expect(401);
  });
});
