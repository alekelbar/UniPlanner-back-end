import {
  ArrayMinSize,
  IsAlphanumeric,
  IsArray,
  IsEmail,
  IsMongoId,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ObjectId } from 'mongoose';

export class RegisterUserDto {
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

  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  career: ObjectId[];
}
