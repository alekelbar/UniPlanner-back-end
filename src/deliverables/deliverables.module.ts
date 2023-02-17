import { Module } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { DeliverablesController } from './deliverables.controller';

@Module({
  controllers: [DeliverablesController],
  providers: [DeliverablesService]
})
export class DeliverablesModule {}
