import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Deliverable,
  DeliverableDocument,
} from 'src/deliverables/entities/deliverable.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';

enum TASK_EXCEPTIONS {
  NOT_EXIST = 'No se encontro el recurso',
  INVALID_TASK = 'Error de validación',
  DELIVERABLE_NOT_FOUND = 'No se encontro el entregable correspondiente',
  INTERNAL_ERROR = 'Error interno',
}

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Deliverable.name)
    private deliverableModel: Model<DeliverableDocument>,
    private configService: ConfigService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
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

      const limit = this.configService.get('limitPerPage');
      const skip = this.configService.get('skipPerPage') * page;

      const [tasks, count] = await Promise.all([
        this.taskModel.find({ delivery: id }).limit(limit).skip(skip),
        this.taskModel.countDocuments({ course: id }),
      ]);

      return {
        count,
        tasks,
      };
    } catch (error) {
      throw new InternalServerErrorException(TASK_EXCEPTIONS.INTERNAL_ERROR);
    }
  }

  async findAll(page: number): Promise<Task[]> {
    return await this.taskModel
      .find()
      .limit(this.configService.get('limitPerPage'))
      .skip(this.configService.get('skipPerPage') * page);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new BadRequestException(TASK_EXCEPTIONS.NOT_EXIST);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    if (!this.exist(id)) {
      throw new BadRequestException(TASK_EXCEPTIONS.NOT_EXIST);
    }
    try {
      return await this.taskModel.findByIdAndUpdate(
        { _id: id },
        updateTaskDto,
        {
          runValidators: true,
          new: true,
        },
      );
    } catch (error) {
      if (error._message != TASK_EXCEPTIONS.INVALID_TASK) {
        throw new BadRequestException(TASK_EXCEPTIONS.INVALID_TASK);
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<Task> {
    if (!this.exist(id)) {
      throw new BadRequestException(TASK_EXCEPTIONS.NOT_EXIST);
    }
    try {
      return await this.taskModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(TASK_EXCEPTIONS.INTERNAL_ERROR);
    }
  }

  async exist(id: string) {
    return await this.taskModel.findById(id);
  }
}
