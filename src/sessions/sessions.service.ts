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
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session, SessionDocument } from './entities/session.entity';

export enum SESSION_EXCEPTIONS {
  USER_NOT_FOUND = 'User not found',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NOT_FOUND = 'Not Found',
}

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) private userModel: Model<userDocument>,
    private configService: ConfigService,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
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

      const sessions = await this.sessionModel
        .find({ user: id })
        .limit(this.configService.get('limitPerPage'))
        .skip(this.configService.get('skipPerPage') * page);

      const count = (await this.sessionModel.find({ user: id })).length;

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

  async remove(id: string) {
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
