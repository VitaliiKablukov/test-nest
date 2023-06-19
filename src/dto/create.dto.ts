import { IsEmail, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
