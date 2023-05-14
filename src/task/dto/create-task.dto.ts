import { IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  descripcion: string;

  @IsString()
  status: string;

  @IsString()
  delivery: string;
}
