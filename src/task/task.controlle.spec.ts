import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TASK_STATUS, Task, TaskSchema } from './entities/task.entity';
import {
  Deliverable,
  DeliverableSchema,
} from 'src/deliverables/entities/deliverable.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('task controller', () => {
  let constroller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB),
        MongooseModule.forFeature([
          { name: Task.name, schema: TaskSchema },
          { name: Deliverable.name, schema: DeliverableSchema },
        ]),
      ],
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    constroller = moduleRef.get<TasksController>(TasksController);
    service = moduleRef.get<TasksService>(TasksService);
  });

  describe('Tasks testing', () => {
    it('create method should be called', async () => {
      const mockImplementation = jest.fn();

      jest.spyOn(service, 'create').mockImplementation(mockImplementation);

      await constroller.create({
        name: 'Task name',
        delivery: '63fb9c2ef6a86bd77492c9ac',
        descripcion: 'Task desc',
        status: TASK_STATUS.COMPLETED,
      });

      expect(mockImplementation).toHaveBeenCalled();
    });

    it('remove method should be called', async () => {
      const mockImplementation = jest.fn();

      jest.spyOn(service, 'remove').mockImplementation(mockImplementation);

      await constroller.remove('642c583d342c8e2780ce3952');

      expect(mockImplementation).toHaveBeenCalled();
    });

    it('update method should be called', async () => {
      const mockImplementation = jest.fn();

      jest.spyOn(service, 'update').mockImplementation(mockImplementation);

      await constroller.update('642c583d342c8e2780ce3952', {});

      expect(mockImplementation).toHaveBeenCalled();
    });

    it('findOne method should be called', async () => {
      const mockImplementation = jest.fn();

      jest.spyOn(service, 'findOne').mockImplementation(mockImplementation);

      await constroller.findOne('642c583d342c8e2780ce3952');

      expect(mockImplementation).toHaveBeenCalled();
    });
  });
});
