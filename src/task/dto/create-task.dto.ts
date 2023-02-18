import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(15)
  descripcion: string;

  @IsString()
  status: string;

  @IsString()
  delivery: string;
}