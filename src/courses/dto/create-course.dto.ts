import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsString()
  courseDescription: string;

  @IsNumber()
  @IsPositive()
  credits: number;

  @IsString()
  career: string;
  
  @IsString()
  user: string;
}
