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
import { User, userDocument } from '../auth/entities/user.entity';
import { Career, CareerDocument } from '../careers/entities/career.entity';
import { ConfigService } from '@nestjs/config';
import {
  Deliverable,
  DeliverableDocument,
} from '../deliverables/entities/deliverable.entity';

@Injectable()
export class CoursesService {
  // }
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(Career.name) private careerModel: Model<CareerDocument>,
    @InjectModel(Deliverable.name)
    private deliverableModel: Model<DeliverableDocument>,
    private configService: ConfigService,
  ) {}

  async findAllFromUser(page: number, idUser: string, idCareer: string) {

    try {
      const courses = await this.courseModel
        .find({ user: idUser, career: idCareer })
        .limit(this.configService.get('limitPerPage'))
        .skip(this.configService.get('skipPerPage') * page);

      if (!courses) {
        throw new NotFoundException('No courses found');
      }

      const count = (
        await this.courseModel.find({
          user: idUser,
          career: idCareer,
        })
      ).length;

      return {
        count,
        courses,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async create(createCourseDto: CreateCourseDto) {
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

    try {
      // create the course
      return await this.courseModel.create(createCourseDto);
    } catch (error) {
      if (error.code == 11000) {
        throw new BadRequestException('this course already exits');
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(page: number) {
    return await this.courseModel
      .find()
      .limit(this.configService.get('limitPerPage'))
      .skip(this.configService.get('skipPerPage') * page);
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

    try {
      const courseUpdate = this.courseModel.findOneAndUpdate(
        { _id: id },
        updateCourseDto,
        { new: true },
      );
      return courseUpdate;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    if (!(await this.courseModel.findById(id))) {
      throw new NotFoundException(
        'Could not be deleted, because the course does not exist',
      );
    }

    // verificar que no existen entregables vinculados a la carrera
    const deliverables = await this.deliverableModel.find({ course: id });
    if (deliverables.length > 0) {
      throw new BadRequestException(
        'Could not be deleted, because the course has deliverables',
      );
    }

    const removeItem = await this.courseModel.findOneAndRemove({ _id: id });
    if (!removeItem) {
      throw new InternalServerErrorException();
    }

    return removeItem;
  }
}
