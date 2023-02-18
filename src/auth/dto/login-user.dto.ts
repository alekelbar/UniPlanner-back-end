import {
  IsAlphanumeric,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @MinLength(9)
  @MaxLength(9)
  identification: string;

  @IsString()
  @MinLength(8)
  @IsAlphanumeric()
  password: string;

}
