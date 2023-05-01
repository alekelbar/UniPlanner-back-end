import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Query } from '@nestjs/common';
import { string } from 'joi';
import { Course } from './entities/course.entity';

@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get('grade/:courseId')
  getGradesById(@Param('courseId', ParseMongoIdPipe) courseId: string) {
    return this.coursesService.getGradesById(courseId);
  }

  @Get()
  findAll(@Query('page') page: number = 0) {
    return this.coursesService.findAll(page);
  }

  @Get('user/:idUser/career/:idCareer')
  findAllFromUser(
    @Query('page') page: number = 0,
    @Param('idUser', ParseMongoIdPipe) idUser: string,
    @Param('idCareer', ParseMongoIdPipe) idCareer: string,
  ) {
    return this.coursesService.findAllFromUser(page, idUser, idCareer);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.coursesService.remove(id);
  }
}
