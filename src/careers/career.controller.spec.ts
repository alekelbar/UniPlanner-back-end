import { Test } from '@nestjs/testing';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Career, CareerSchema } from './entities/career.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { EnconderService } from 'src/common/services/enconder.service';

describe('CareerController', () => {
  let careerController: CareerController;
  let careerService: CareerService;
  let userService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB),
        MongooseModule.forFeature([
          { name: Career.name, schema: CareerSchema },
          { name: User.name, schema: UserSchema },
        ]),
        AuthModule,
      ],
      controllers: [CareerController],
      providers: [CareerService, AuthService, EnconderService],
    }).compile();

    careerController = moduleRef.get<CareerController>(CareerController);
    careerService = moduleRef.get<CareerService>(CareerService);
    userService = moduleRef.get<AuthService>(AuthService);
  });

  describe('test all careers methods', () => {
    it('should return an array of careers', async () => {
      const result: Career[] = [
        { name: 'career name' },
        { name: 'career name 2' },
      ];

      jest
        .spyOn(careerService, 'findAll')
        .mockImplementation(async () => result);

      expect(await careerController.findAll()).toBe(result);
    });

    it('It should return the career that was added', async () => {
      const result = { name: 'Ingenieria en Sistemas de Información' };

      jest
        .spyOn(userService, 'addCareer')
        .mockImplementation(async () => result);

      expect(
        await careerController.removeCareer(
          '63f1269a0c372e9d902957e6',
          '63f6640fd384c4f5c109fa59',
        ),
      ).toStrictEqual(result);
    });

    it('It should return the career that was removed', async () => {
      const result = { name: 'Ingenieria en Sistemas de Información' };

      jest
        .spyOn(userService, 'removeCareer')
        .mockImplementation(async () => result);

      const dataRes = await careerController.removeCareer(
        '63f1269a0c372e9d902957e6',
        '63f6640fd384c4f5c109fa59',
      );

      expect(dataRes).toStrictEqual(result);
    });

    it('It should return the career that was selected by an user', async () => {
      const result = [
        {
          _id: '63f1269a0c372e9d902957e6',
          name: 'Ingenieria en Sistemas de Información',
        },
      ];

      jest
        .spyOn(userService, 'findAllCareers')
        .mockImplementation(async () => result);

      const dataRes = await careerController.CareersById('alekelbar');

      expect(dataRes).toStrictEqual(result);
    });
  });
});
