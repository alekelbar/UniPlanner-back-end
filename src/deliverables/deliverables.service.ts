import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';
import {
  Deliverable,
  DeliverableDocument,
} from './entities/deliverable.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CourseDocument } from 'src/courses/entities/course.entity';
import { Course } from '../courses/entities/course.entity';

enum DELIVERABLES_EXCEPTIONS {
  NOT_EXIST = 'deliverable does not exits',
  COURSE_NOT_FOUND = 'course does not exist',
  INVALID_SCHEMA = 'data structure has been incorrect(probably, status)',
  VALIDATION_FAILED = 'Validation failed',
  INTERNAL_ERROR = 'internal error',
}

@Injectable()
export class DeliverablesService {
  constructor(
    @InjectModel(Deliverable.name)
    private deliverableModel: Model<DeliverableDocument>,
    private configService: ConfigService,
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  async create(createDeliverableDto: CreateDeliverableDto) {
    try {
      const deliverable = await this.deliverableModel.create(
        createDeliverableDto,
      );
      return deliverable;
    } catch (error) {
      throw new InternalServerErrorException(
        DELIVERABLES_EXCEPTIONS.INTERNAL_ERROR,
      );
    }
  }

  async findAll(page: number) {
    const deliverables = await this.deliverableModel
      .find()
      .limit(this.configService.get('limitPerPage'))
      .skip(this.configService.get('skipPerPage') * page);

    if (!deliverables) throw new InternalServerErrorException();
    return deliverables;
  }

  async findAllFromCourse(id: string, page: number) {
    try {
      // verficar que el curso exista
      const course = await this.courseModel.findById(id);

      if (!course)
        throw new BadRequestException(DELIVERABLES_EXCEPTIONS.COURSE_NOT_FOUND);

      const deliverables = await this.deliverableModel
        .find({ course: id })
        .limit(this.configService.get('limitPerPage'))
        .skip(this.configService.get('skipPerPage') * page);

      const count = (await this.deliverableModel.find({ course: id })).length;

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

  async findOne(id: string) {
    const deliverable = await this.deliverableModel.findById(id);

    if (!deliverable)
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.NOT_EXIST);

    return deliverable;
  }

  async update(id: string, updateDeliverableDto: UpdateDeliverableDto) {
    // check if deliverable already exist
    if (!this.existInDb(id))
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.NOT_EXIST);

    try {
      const deliverableUpdated = await this.deliverableModel.findOneAndUpdate(
        { _id: id },
        updateDeliverableDto,
        { new: true, runValidators: true },
      );

      return deliverableUpdated;
      
    } catch (error) {
      if (error._message == DELIVERABLES_EXCEPTIONS.VALIDATION_FAILED) {
        throw new BadRequestException(DELIVERABLES_EXCEPTIONS.INVALID_SCHEMA);
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    // check if deliverable already exist

    if (!this.existInDb(id))
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.NOT_EXIST);
    try {
      const deliverableDeleted = await this.deliverableModel.findOneAndRemove({
        _id: id,
      });
      return deliverableDeleted;
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
