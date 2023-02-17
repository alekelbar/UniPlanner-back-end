import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './entities/course.entity';
import { Model } from 'mongoose';
import { User, userDocument } from '../users/entities/user.entity';
import { Career, CareerDocument } from '../careers/entities/career.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(Career.name) private careerModel: Model<CareerDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    let course: CourseDocument;
    try {
      // check if the user exits
      const user = await this.userModel.findById(createCourseDto.user);
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      // check if the career exist
      const career = await this.careerModel.findById(createCourseDto.career);
      if (!career) {
        throw new BadRequestException('Career does not exist');
      }
      // create the course
      course = await this.courseModel.create(createCourseDto);
    } catch (error) {
      if (error.code == 11000) {
        throw new BadRequestException('this course already exits');
      }

      throw new InternalServerErrorException();
    }
    return course;
  }

  async findAll() {
    return await this.courseModel.find();
  }

  async findOne(id: string) {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException('not found');
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    // check it does not exist
    if (!(await this.courseModel.findById(id))) {
      throw new NotFoundException('not found, the course does not exist');
    }

    const courseUpdate = this.courseModel.findOneAndUpdate(
      { _id: id },
      updateCourseDto,
      { new: true },
    );

    if (!courseUpdate) {
      throw new InternalServerErrorException();
    }

    return courseUpdate;
  }

  async remove(id: string) {
    if (!(await this.courseModel.findById(id))) {
      throw new NotFoundException(
        'Could not be deleted, because the course does not exist',
      );
    }

    const removeItem = await this.courseModel.findOneAndRemove({ _id: id });
    if (!removeItem) {
      throw new InternalServerErrorException();
    }

    return removeItem;
  }
}
