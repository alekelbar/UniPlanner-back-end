import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsOptional()
  _id?: string;

  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(10)
  descripcion: string;

  @IsString()
  status: string;

  @IsString()
  delivery: string;
}
