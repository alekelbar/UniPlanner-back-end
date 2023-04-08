import {
  IsHexColor,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserSettingDto {
  @IsOptional()
  _id: string;

  @IsString()
  @IsMongoId()
  user: string;

  @IsNumber()
  importance: number;

  @IsNumber()
  urgency: number;

  @IsHexColor()
  do: string;

  @IsHexColor()
  prepare: string;

  @IsHexColor()
  delegate: string;

  @IsHexColor()
  ignore: string;
}
