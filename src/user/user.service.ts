import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateDto } from 'src/dto/create.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { jwtConstants } from './constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  async registration(dto: CreateDto) {
    const user = await prisma.user.findMany({
      where: {
        email: dto.email,
      },
    });
    console.log(user);

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

    console.log(user[0]);

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
    await this.cacheManager.set('cached_item', { key: 32 });
    const cachedItem = await this.cacheManager.get('cached_item');
    console.log(cachedItem);
    return {
      user: user[0].email,
      token,
    };
  }
  async logout(req) {
    const user = prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        token: '',
      },
    });
    return user;
  }
}
