import {
  IsAlphanumeric,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @MinLength(8)
  identification: string;

  @IsString()
  @MinLength(8)
  @IsAlphanumeric()
  password: string;
}
