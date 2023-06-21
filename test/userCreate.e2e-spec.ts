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

  it('/user/createUser (POST) successCreate', async () => {
    const res = await request(user.getHttpServer())
      .post('/user/createUser')
      .send({
        email: 'test1@gmail.com',
        password: 'password',
      });
    expect(res.body).toBe({ NewUser: 'test1@gmail.com' });
    expect(res.body.statusCode).toBe(201);
  });
  it('/user/createUser (POST) failCreate', async () => {
    const res = await request(user.getHttpServer())
      .post('/user/createUser')
      .send({});

    expect(res.body.statusCode).toBe(400);
  });
  it('/user/createUser (POST) failEmail', async () => {
    const res = await request(user.getHttpServer())
      .post('/user/createUser')
      .send({
        email: 'testg1mail.com',
        password: 'password',
      });

    expect(res.body.statusCode).toBe(400);
  });
  it('/user/createUser (POST) failPassword', async () => {
    const res = await request(user.getHttpServer())
      .post('/user/createUser')
      .send({
        email: 'test1@gmail.com',
        password: 'pass',
      });

    expect(res.body.statusCode).toBe(409);
  });
});
