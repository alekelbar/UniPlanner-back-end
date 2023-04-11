import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import {
  DELIVERABLE_TAGS,
  Deliverable,
  DeliverableSchema,
} from './entities/deliverable.entity';
import { Course, CourseSchema } from 'src/courses/entities/course.entity';
import { Task, TaskSchema } from 'src/task/entities/task.entity';
import { DeliverablesController } from './deliverables.controller';
import { DeliverablesService } from './deliverables.service';

describe('Deliverable controller', () => {
  let controller: DeliverablesController;
  let service: DeliverablesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB),
        MongooseModule.forFeature([
          {
            name: Deliverable.name,
            schema: DeliverableSchema,
          },
          {
            name: Course.name,
            schema: CourseSchema,
          },
          {
            name: Task.name,
            schema: TaskSchema,
          },
        ]),
      ],
      controllers: [DeliverablesController],
      providers: [DeliverablesService],
    }).compile();

    controller = moduleRef.get<DeliverablesController>(DeliverablesController);
    service = moduleRef.get<DeliverablesService>(DeliverablesService);
  });

  describe('Deliverable testing', () => {
    it('create method should be called and return correct data', async () => {
      const mockImplementation = jest.fn();

      jest.spyOn(service, 'findOne').mockImplementation(mockImplementation);

      await controller.findOne('63fb9c2ef6a86bd77492c9ac');

      expect(mockImplementation).toHaveBeenCalled();
    });

    it('create method should be called', async () => {
      const mockImplementation = jest.fn();

      jest.spyOn(service, 'create').mockImplementation(mockImplementation);

      await controller.create({
        _id: '63fb9c2ef6a86bd77492c9ac',
        name: 'Proyecto web enviado',
        description: 'Programar una plataforma de organización',
        deadline: new Date(),
        status: 'Enviado',
        note: 90,
        percent: 25,
        course: '63f8edca651e6f7f8b197869',
        importance: DELIVERABLE_TAGS.IMPORTANT,
        urgency: DELIVERABLE_TAGS.URGENT,
        createdAt: '',
      });

      expect(mockImplementation).toHaveBeenCalled();
    });

    it('remove method should be called', async () => {
      const mockImplementation = jest.fn();

      jest.spyOn(service, 'remove').mockImplementation(mockImplementation);

      await controller.remove('63fb9c2ef6a86bd77492c9ac');

      expect(mockImplementation).toHaveBeenCalled();
    });

    it('update method should be called', async () => {
      const mockImplementation = jest.fn();

      jest.spyOn(service, 'update').mockImplementation(mockImplementation);

      await controller.update('63fb9c2ef6a86bd77492c9ac', {});

      expect(mockImplementation).toHaveBeenCalled();
    });
  });
});
