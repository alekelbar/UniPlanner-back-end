import {
  IsDate,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

export class CreateDeliverableDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(250)
  description: string;

  @IsDate()
  deadline: Date;

  @IsString()
  status: string;

  @IsNumber()
  note: number;

  @IsDate()
  createdAt: Date;

  @IsNumber()
  percent: number;

  @IsString()
  course: string;
}
