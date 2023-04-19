import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { CareerService } from './career.service';
import { Career } from './entities/career.entity';

export enum CAREERS_EXCEPTION {
  NOT_FOUND = 'La carrera propocionada no existe',
}

@Controller('careers')
export class CareerController {
  constructor(
    private readonly careerService: CareerService,
    private readonly userService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findPaginate(@Query('page') page: number = 0) {
    return this.careerService.findPaginate(page);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  CareersById(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.findAllCareers(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':careerId/:userId')
  addCareer(
    @Param('careerId', ParseMongoIdPipe) careerId: string,
    @Param('userId', ParseMongoIdPipe) userId: string,
  ): Promise<Career> {
    return this.userService.addCareer(careerId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':careerId/:userId')
  removeCareer(
    @Param('careerId', ParseMongoIdPipe) careerId: string,
    @Param('userId', ParseMongoIdPipe) userId: string,
  ): Promise<Career> {
    return this.userService.removeCareer(careerId, userId);
  }

  @Get('find/all')
  findAll() {
    return this.careerService.findAll();
  }
}
