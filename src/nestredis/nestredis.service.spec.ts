import { Test, TestingModule } from '@nestjs/testing';
import { NestredisService } from './nestredis.service';

describe('NestredisService', () => {
  let service: NestredisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestredisService],
    }).compile();

    service = module.get<NestredisService>(NestredisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
