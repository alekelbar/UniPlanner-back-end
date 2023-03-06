import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { SESSION_TYPES } from '../entities/session.entity';

export class CreateSessionDto {
  @IsString()
  @MinLength(5)
  name: String; // nombre de la sesión

  @IsNumber()
  @IsPositive()
  duration: number; // duración en minutos

  @IsString()
  @IsEnum(SESSION_TYPES)
  type: String; // tipo de sesión; por ejemplo "trabajo" o "descanso"

  @IsMongoId()
  user: string; // Usuario dueño de esta sesión
}
