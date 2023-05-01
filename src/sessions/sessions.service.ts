import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, userDocument } from 'src/auth/entities/user.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session, SessionDocument } from './entities/session.entity';

export enum SESSION_EXCEPTIONS {
  USER_NOT_FOUND = 'No se encontro al usuario',
  INTERNAL_SERVER_ERROR = 'Error interno',
  NOT_FOUND = 'No se encontro el recurso',
}

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) private userModel: Model<userDocument>,
    private configService: ConfigService,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const user = await this.userModel.findById(createSessionDto.user);
    if (!user) {
      throw new BadRequestException(SESSION_EXCEPTIONS.USER_NOT_FOUND);
    }

    try {
      return await this.sessionModel.create(createSessionDto);
    } catch (error) {
      throw new InternalServerErrorException(
        SESSION_EXCEPTIONS.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllFromUser(id: string, page: number) {
    try {
      // verficar que el ENTREGABLE exista
      const user = await this.userModel.findById(id);

      if (!user)
        throw new BadRequestException(SESSION_EXCEPTIONS.USER_NOT_FOUND);

      const limit = this.configService.get('limitPerPage');
      const skip = this.configService.get('skipPerPage') * page;

      const [sessions, count] = await Promise.all([
        this.sessionModel.find({ user: id }).limit(limit).skip(skip),
        this.sessionModel.countDocuments({ user: id }),
      ]);

      return {
        count,
        sessions,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        SESSION_EXCEPTIONS.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<Session> {
    try {
      if (!(await this.sessionModel.findById(id))) {
        throw new BadRequestException(SESSION_EXCEPTIONS.NOT_FOUND);
      }

      return this.sessionModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        SESSION_EXCEPTIONS.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
