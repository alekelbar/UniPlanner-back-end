import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  courseDescription: string;

  @IsNumber()
  @IsPositive()
  credits: number;

  @IsString()
  career: string;
  
  @IsString()
  user: string;
}
