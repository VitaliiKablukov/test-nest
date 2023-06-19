import { Module } from '@nestjs/common';
import { NestredisService } from './nestredis.service';
import { NestredisController } from './nestredis.controller';
import { RedisModule } from 'nestjs-redis';
@Module({
  providers: [NestredisService],
  controllers: [NestredisController],
  imports: [
    RedisModule.register({
      host: 'localhost',
      port: 6379,
    }),
  ],
})
export class NestredisModule {}
