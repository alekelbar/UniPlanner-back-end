import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Career, CareerSchema } from './entities/career.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Career.name,
        schema: CareerSchema,
      },
    ]),
    ConfigModule
  ],
  controllers: [CareerController],
  providers: [CareerService],
})
export class CareerModule {}
