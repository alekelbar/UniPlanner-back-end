import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {
  Deliverable,
  DeliverableDocument,
} from 'src/deliverables/entities/deliverable.entity';

enum TASK_EXCEPTIONS {
  NOT_EXIST = 'Task does not exist',
  INVALID_TASK = 'Task validation failed',
  DELIVERABLE_NOT_FOUND = 'DELIVERABLE not found',
  INTERNAL_ERROR = 'Internal error',
}

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Deliverable.name)
    private deliverableModel: Model<DeliverableDocument>,
    private configService: ConfigService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      return await this.taskModel.create(createTaskDto);
    } catch (error) {
      if (error._message != TASK_EXCEPTIONS.INVALID_TASK) {
        throw new InternalServerErrorException();
      }
      throw new BadRequestException(TASK_EXCEPTIONS.INVALID_TASK);
    }
  }

  async findAllFromDeliverables(page: number, id: string) {
    try {
      // verficar que el ENTREGABLE exista
      const deliverable = await this.deliverableModel.findById(id);

      if (!deliverable)
        throw new BadRequestException(TASK_EXCEPTIONS.DELIVERABLE_NOT_FOUND);

      const tasks = await this.taskModel
        .find({ delivery: id })
        .limit(this.configService.get('limitPerPage'))
        .skip(this.configService.get('skipPerPage') * page);

      const count = (await this.taskModel.find({ course: id })).length;

      return {
        count,
        tasks,
      };
    } catch (error) {
      throw new InternalServerErrorException(TASK_EXCEPTIONS.INTERNAL_ERROR);
    }
  }

  findAll(page: number) {
    return this.taskModel
      .find()
      .limit(this.configService.get('limitPerPage'))
      .skip(this.configService.get('skipPerPage') * page);
  }

  async findOne(id: string) {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new BadRequestException(TASK_EXCEPTIONS.NOT_EXIST);
    }
    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    if (!this.exist(id)) {
      throw new BadRequestException(TASK_EXCEPTIONS.NOT_EXIST);
    }
    try {
      return this.taskModel.findByIdAndUpdate({ _id: id }, updateTaskDto, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      if (error._message != TASK_EXCEPTIONS.INVALID_TASK) {
        throw new BadRequestException(TASK_EXCEPTIONS.INVALID_TASK);
      }
      throw new InternalServerErrorException();
    }
  }

  remove(id: string) {
    if (!this.exist(id)) {
      throw new BadRequestException(TASK_EXCEPTIONS.NOT_EXIST);
    }
    try {
      return this.taskModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(TASK_EXCEPTIONS.INTERNAL_ERROR);
    }
  }

  async exist(id: string) {
    return await this.taskModel.findById(id);
  }
}
