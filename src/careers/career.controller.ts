import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { CareerService } from './career.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('careers')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Get()
  findAll(@Query('page') page: number = 0) {
    return this.careerService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.careerService.findOne(id);
  }
}
