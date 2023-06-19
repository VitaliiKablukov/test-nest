import { Test, TestingModule } from '@nestjs/testing';
import { NestredisController } from './nestredis.controller';

describe('NestredisController', () => {
  let controller: NestredisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NestredisController],
    }).compile();

    controller = module.get<NestredisController>(NestredisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
