import { IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  descripcion: string;

  @IsString()
  status: string;

  @IsString()
  delivery: string;
}
