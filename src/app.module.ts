import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { NestredisModule } from './nestredis/nestredis.module';

@Module({
  imports: [DatabaseModule, UserModule, RedisModule, NestredisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
