import { IsHexColor, IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateUserSettingDto {
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
