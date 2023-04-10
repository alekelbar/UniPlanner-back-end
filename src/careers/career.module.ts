import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Career, CareerSchema } from './entities/career.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { EnconderService } from 'src/common/services/enconder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Career.name,
        schema: CareerSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [CareerController],
  providers: [CareerService, AuthService, EnconderService],
  exports: [CareerService], // si se necesita utilizar en otros módulos
})
export class CareerModule {}
