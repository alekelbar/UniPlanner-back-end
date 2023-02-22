import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { CareerService } from './career.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export enum CAREERS_EXCEPTION {
  NOT_FOUND = 'La carrera propocionada no existe',
}

@Controller('careers')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findPaginate(@Query('page') page: number = 0) {
    return this.careerService.findPaginate(page);
  }

  @Get('all')
  findAll() {
    return this.careerService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.careerService.findOne(id);
  }
}
