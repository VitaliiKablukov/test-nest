import {
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateDto } from '../dto/create.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { jwtConstants } from './constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const prisma = new PrismaClient();

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private jwtService: JwtService,
  ) {}
  onModuleInit() {
    this.setCache();
  }

  async setCache() {
    for (let i = 0; i < 10; i++) {
      const res = await this.cacheManager.set(
        `number:${i}`,
        { key: `number:${i}` },
        360000,
      );
    }
  }
  async registration(dto: CreateDto) {
    const user = await prisma.user.findMany({
      where: {
        email: dto.email,
      },
    });

    if (user.length) {
      throw new HttpException('Email is already used', 409);
    }

    const hashPassword = bcrypt.hashSync(dto.password, bcrypt.genSaltSync(10));

    dto.password = hashPassword;

    const res = await prisma.user.create({
      data: { ...dto, password: hashPassword },
    });
    return { NewUser: dto.email };
  }

  async login(dto: LoginDto) {
    const user = await prisma.user.findMany({
      where: {
        email: dto.email,
      },
    });

    if (user.length == 0) {
      throw new UnauthorizedException();
    }

    const isValidPassword = bcrypt.compareSync(dto.password, user[0].password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user[0].id,
    };
    const token = await this.jwtService.signAsync(payload, jwtConstants);
    await prisma.user.update({
      where: {
        id: user[0].id,
      },
      data: { token: token },
    });

    return {
      user: user[0].email,
      token,
    };
  }
  async logout(req) {
    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        token: '',
      },
    });
    return user;
  }
  async getCache() {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      const res = await this.cacheManager.get(`number:${i}`);

      promises.push(res);
    }

    return promises;
  }
}
