import {
  IsAlphanumeric,
  IsEmail,
  IsMongoId,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(9)
  @MaxLength(9)
  identification: string;

  @IsString()
  @MinLength(10)
  fullname: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  @IsAlphanumeric()
  password: string;

  @IsMongoId()
  career: string;
}
