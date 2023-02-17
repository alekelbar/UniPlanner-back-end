import { Module } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { DeliverablesController } from './deliverables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deliverable, DeliverableSchema } from './entities/deliverable.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Deliverable.name,
        schema: DeliverableSchema,
      },
    ]),
  ],
  controllers: [DeliverablesController],
  providers: [DeliverablesService],
})
export class DeliverablesModule {}
