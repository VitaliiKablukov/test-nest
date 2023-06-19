import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

import { Request, Response, NextFunction } from 'express';
import { jwtConstants } from 'src/user/constants';
const prisma = new PrismaClient();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing JWT token');
    }

    try {
      const { id } = this.jwtService.verify(token, jwtConstants);

      const currentUser = await prisma.user.findFirst({ where: { id: id } });
      req.user = currentUser;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
}
export interface CustomRequest extends Request {
  user: object;
}
