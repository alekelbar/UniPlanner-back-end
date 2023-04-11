import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import {
  SESSION_TYPES,
  Session,
  SessionSchema,
} from './entities/session.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

describe('Session controller', () => {
  let controller: SessionsController;
  let service: SessionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB),
        MongooseModule.forFeature([
          {
            name: Session.name,
            schema: SessionSchema,
          },
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      controllers: [SessionsController],
      providers: [SessionsService],
    }).compile();

    controller = moduleRef.get<SessionsController>(SessionsController);
    service = moduleRef.get<SessionsService>(SessionsService);
  });

  describe('Session testing', () => {
    it('create method should be called', async () => {
      const mockImplementation = jest.fn();
      jest.spyOn(service, 'create').mockImplementation(mockImplementation);

      await controller.create({
        duration: 20,
        name: 'anything',
        type: SESSION_TYPES.RESTING,
        user: '63f6640fd384c4f5c109fa59',
      });

      expect(mockImplementation).toHaveBeenCalled();
    });

    it('remove method should be called', async () => {
      const mockImplementation = jest.fn();
      jest.spyOn(service, 'remove').mockImplementation(mockImplementation);

      await controller.remove('6407928b9a7a383e05c7abad');

      expect(mockImplementation).toHaveBeenCalled();
    });

    it('findAllFromUser method should be called', async () => {
      const mockImplementation = jest.fn();
      jest
        .spyOn(service, 'findAllFromUser')
        .mockImplementation(mockImplementation);

      await controller.findAllFromUser('63f6640fd384c4f5c109fa59', 1);

      expect(mockImplementation).toHaveBeenCalled();
    });
  });
});
