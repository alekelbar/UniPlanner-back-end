import {
  ArrayMinSize,
  IsAlphanumeric,
  IsArray,
  IsEmail,
  IsMongoId,
  IsString,
  MinLength,
} from 'class-validator';

import { ObjectId } from 'mongoose';

export class RegisterUserDto {
  @IsString()
  @MinLength(8)
  identification: string;

  @IsString()
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
  careers: ObjectId[];
}
