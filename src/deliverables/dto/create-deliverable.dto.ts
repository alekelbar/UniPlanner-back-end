import {
  IsDate,
  IsString,
  MinLength,
  IsNumber,
  IsMongoId,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { DELIVERABLE_STATUS, DELIVERABLE_TAGS } from '../entities/deliverable.entity';

export class CreateDeliverableDto {
  @IsOptional()
  _id: string;

  @IsOptional()
  createdAt: string;

  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDate()
  deadline: Date;

  @IsString()
  @IsEnum(DELIVERABLE_STATUS)
  status: string;

  @IsString()
  @IsEnum(DELIVERABLE_TAGS)
  importance: string;

  @IsString()
  @IsEnum(DELIVERABLE_TAGS)
  urgency: string;

  @IsNumber()
  note: number;

  @IsNumber()
  percent: number;

  @IsMongoId()
  course: string;
}
