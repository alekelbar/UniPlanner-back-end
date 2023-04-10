import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Course, CourseSchema } from './entities/course.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { Career, CareerSchema } from 'src/careers/entities/career.entity';
import {
  Deliverable,
  DeliverableSchema,
} from 'src/deliverables/entities/deliverable.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

describe('courses controller', () => {
  let controller: CoursesController;
  let service: CoursesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB),
        MongooseModule.forFeature([
          { name: Course.name, schema: CourseSchema },
          { name: User.name, schema: UserSchema },
          { name: Career.name, schema: CareerSchema },
          { name: Deliverable.name, schema: DeliverableSchema },
        ]),
      ],
      controllers: [CoursesController],
      providers: [CoursesService],
    }).compile();

    controller = moduleRef.get<CoursesController>(CoursesController);
    service = moduleRef.get<CoursesService>(CoursesService);
  });

  describe('courses testing', () => {
    it('should be return all courses from a user in page one', async () => {
      const result: { count: number; courses: Course[] } = {
        count: 1,
        courses: [],
      };

      jest
        .spyOn(service, 'findAllFromUser')
        .mockImplementation(async () => result);

      expect(
        await controller.findAllFromUser(
          1,
          '63f1269a0c372e9d902957e6',
          '63f6640fd384c4f5c109fa59',
        ),
      ).toStrictEqual(result);
    });

    it('should be call create method', async () => {
      const mockCreate = jest.fn();
      jest.spyOn(service, 'create').mockImplementation(mockCreate);

      await controller.create({
        career: '63f1269a0c372e9d902957e6',
        courseDescription: 'My description',
        credits: 2,
        name: 'My course',
        user: '63f6640fd384c4f5c109fa59',
      });

      expect(mockCreate).toHaveBeenCalled();
    });

    it('should be call update method', async () => {
      const mockCreate = jest.fn();
      jest.spyOn(service, 'update').mockImplementation(mockCreate);

      await controller.update('63f8edca651e6f7f8b197869', {
        career: '63f1269a0c372e9d902957e6',
        courseDescription: 'My description',
        credits: 2,
        name: 'My course',
        user: '63f6640fd384c4f5c109fa59',
      });

      expect(mockCreate).toHaveBeenCalled();
    });

    it('should be call remove method', async () => {
      const mockCreate = jest.fn();
      jest.spyOn(service, 'remove').mockImplementation(mockCreate);

      await controller.remove('63f8edca651e6f7f8b197869');

      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
