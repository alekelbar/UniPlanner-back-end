import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDocument } from 'src/courses/entities/course.entity';
import { Task, TaskDocument } from 'src/task/entities/task.entity';
import { Course } from '../courses/entities/course.entity';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';
import {
  Deliverable,
  DeliverableDocument,
} from './entities/deliverable.entity';

enum DELIVERABLES_EXCEPTIONS {
  NOT_EXIST = 'deliverable does not exits',
  COURSE_NOT_FOUND = 'course does not exist',
  INVALID_SCHEMA = 'data structure has been incorrect(probably, status)',
  VALIDATION_FAILED = 'Validation failed',
  INTERNAL_ERROR = 'internal error',
  HAS_TASKS = 'has tasks',
}

@Injectable()
export class DeliverablesService {
  constructor(
    @InjectModel(Deliverable.name)
    private deliverableModel: Model<DeliverableDocument>,
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    private configService: ConfigService,
  ) {}

  async create(
    createDeliverableDto: CreateDeliverableDto,
  ): Promise<Deliverable> {
    try {
      if (!createDeliverableDto.createdAt) {
        createDeliverableDto.createdAt = Date();
      }
      return await this.deliverableModel.create(createDeliverableDto);
    } catch (error) {
      throw new InternalServerErrorException(
        DELIVERABLES_EXCEPTIONS.INTERNAL_ERROR,
      );
    }
  }

  async findAll(page: number): Promise<Deliverable[]> {
    return await this.deliverableModel
      .find()
      .limit(this.configService.get('limitPerPage'))
      .skip(this.configService.get('skipPerPage') * page);
  }

  async findAllFromCourse(id: string, page: number) {
    try {
      // verficar que el curso exista
      const course = await this.courseModel.findById(id);

      if (!course)
        throw new BadRequestException(DELIVERABLES_EXCEPTIONS.COURSE_NOT_FOUND);

      const limit = this.configService.get('limitPerPage');
      const skip = this.configService.get('skipPerPage') * page;

      const [deliverables, count] = await Promise.all([
        this.deliverableModel.find({ course: id }).limit(limit).skip(skip),
        this.deliverableModel.countDocuments({ course: id }),
      ]);

      return {
        count,
        deliverables,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        DELIVERABLES_EXCEPTIONS.INTERNAL_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Deliverable> {
    const deliverable = await this.deliverableModel.findById(id);

    if (!deliverable)
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.NOT_EXIST);

    return deliverable;
  }

  async update(
    id: string,
    updateDeliverableDto: UpdateDeliverableDto,
  ): Promise<Deliverable> {
    // check if deliverable already exist
    if (!this.existInDb(id))
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.NOT_EXIST);

    try {
      return await this.deliverableModel.findOneAndUpdate(
        { _id: id },
        updateDeliverableDto,
        { new: true, runValidators: true },
      );
    } catch (error) {
      if (error._message == DELIVERABLES_EXCEPTIONS.VALIDATION_FAILED) {
        throw new BadRequestException(DELIVERABLES_EXCEPTIONS.INVALID_SCHEMA);
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<Deliverable> {
    // check if deliverable already exist
    if (!this.existInDb(id))
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.NOT_EXIST);

    if ((await this.taskModel.find({ delivery: id })).length) {
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.HAS_TASKS);
    }

    try {
      return await this.deliverableModel.findOneAndRemove({
        _id: id,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        DELIVERABLES_EXCEPTIONS.INTERNAL_ERROR,
      );
    }
  }

  async existInDb(id: string) {
    return await this.deliverableModel.findById(id);
  }
}
