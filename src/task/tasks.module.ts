import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema, Task } from './entities/task.entity';
import { ConfigModule } from '@nestjs/config';
import { Deliverable, DeliverableSchema } from 'src/deliverables/entities/deliverable.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Deliverable.name, schema: DeliverableSchema },
    ]),
    ConfigModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
