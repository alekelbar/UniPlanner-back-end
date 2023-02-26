import { Module } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { DeliverablesController } from './deliverables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deliverable, DeliverableSchema } from './entities/deliverable.entity';
import { ConfigModule } from '@nestjs/config';
import { Course, CourseSchema } from '../courses/entities/course.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Deliverable.name,
        schema: DeliverableSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
    ConfigModule,
  ],
  controllers: [DeliverablesController],
  providers: [DeliverablesService],
})
export class DeliverablesModule {}
