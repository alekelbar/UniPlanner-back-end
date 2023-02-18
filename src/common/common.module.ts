import { Module } from '@nestjs/common';
import { EnconderService } from './services/enconder.service';

@Module({
  providers: [EnconderService],
  exports: [EnconderService],
})
export class CommonModule {}
