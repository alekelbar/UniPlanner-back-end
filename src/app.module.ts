import { Module } from '@nestjs/common';
import { CareerModule } from './career/career.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CareerModule, CommonModule],
  controllers: [],
  exports: [],
  providers: [],
})
export class AppModule {}
