import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { UserModule } from '../src/user/user.module';

describe('UserController (e2e)', () => {
  let user: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    user = moduleFixture.createNestApplication();
    await user.init();
  });

  it('/user/login (POST) successLogin', async () => {
    const res = await request(user.getHttpServer()).post('/user/login').send({
      email: 'test@gmail.com',
      password: 'password',
    });
    expect(res.body.object).toBe({ user: 'test@gmail.com' });
    expect(res.statusCode).toBe(200);
  });
  it('/user/login (POST) failLogin', async () => {
    const res = await request(user.getHttpServer())
      .post('/user/login')
      .send({});

    expect(res.body.statusCode).toBe(500);
  });
  it('/user/login (POST) failEmail', async () => {
    const res = await request(user.getHttpServer()).post('/user/login').send({
      email: 'testgmail.com',
      password: 'password',
    });

    expect(res.body.statusCode).toBe(401);
  });
  it('/user/login (POST) failPassword', async () => {
    const res = await request(user.getHttpServer()).post('/user/login').send({
      email: 'testgmail.com',
      password: 'paword',
    });

    expect(res.body.statusCode).toBe(401);
  });
});
