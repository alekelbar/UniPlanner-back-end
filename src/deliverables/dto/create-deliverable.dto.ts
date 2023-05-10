import {
  IsDate,
  IsString,
  MinLength,
  IsNumber,
  IsMongoId,
  IsEnum,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { DELIVERABLE_STATUS, DELIVERABLE_TAGS } from '../entities/deliverable.entity';

export class CreateDeliverableDto {
  @IsOptional()
  _id: string;

  @IsOptional()
  createdAt: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
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
  @Min(0)
  note: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  percent: number;

  @IsMongoId()
  course: string;
}
