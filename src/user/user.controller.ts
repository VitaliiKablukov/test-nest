import { Controller, Post, Body, Req } from '@nestjs/common';
import { Get, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { CreateDto } from '../dto/create.dto';
import { UserService } from './user.service';
import { LoginDto } from '../dto/login.dto';
import { CustomRequest } from '../middlewares/authMiddlewares.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post('createUser')
  async create(@Body() dto: CreateDto) {
    const res = await this.userService.registration(dto);
    return res;
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const res = await this.userService.login(dto);
    const cache = await this.userService.getCache();

    return { ...res, cache };
  }
  @Get('logout')
  async logout(@Req() req: CustomRequest) {
    await this.userService.logout(req);
    return { message: 'Logout success' };
  }
}
