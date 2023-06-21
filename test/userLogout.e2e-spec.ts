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

  it('/user/logout (GET) failLogout', async () => {
    const res = await request(user.getHttpServer()).get('/user/logout');
    expect(res.body.message).toBe('Missing JWT token');
    expect(res.body.statusCode).toBe(401);
  });
});
