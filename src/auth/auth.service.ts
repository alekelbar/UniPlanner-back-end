import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, userDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { EnconderService } from '../common/services/enconder.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { Career, CareerDocument } from '../careers/entities/career.entity';
import { CAREERS_EXCEPTION } from '../careers/career.controller';

enum USER_EXCEPTIONS {
  NOT_FOUND = 'USER Not Found',
  ALREADY_EXISTS = 'USER Already Exists',
  INTERNAL_ERROR = 'Tuvimos un error en el servidor',
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(Career.name) private careerModel: Model<CareerDocument>,
    private encoder: EnconderService,
    private jwtService: JwtService,
  ) {}

  async addCareer(careerId: string, userId: string) {
    const career = await this.careerModel.findById(careerId);
    if (!career) {
      throw new BadRequestException(CAREERS_EXCEPTION.NOT_FOUND);
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(USER_EXCEPTIONS.NOT_FOUND);
    }
    try {
      const updated = await this.userModel.updateOne(
        { _id: userId },
        { $push: { career: careerId } },
        { new: true },
      );
      return updated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(USER_EXCEPTIONS.INTERNAL_ERROR);
    }
  }

  async findAllCareers(identification: string) {
    const user = await this.findOneByIdentification(identification);

    if (!user) {
      throw new BadRequestException(USER_EXCEPTIONS.NOT_FOUND);
    }

    const { career: userCareers } = user;

    const careers = userCareers.map(
      async (career) => await this.careerModel.findById(career),
    );

    try {
      return await Promise.all(careers);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async register(createUserDto: RegisterUserDto) {
    let user: userDocument;
    try {
      user = await this.userModel.create(createUserDto);
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException(USER_EXCEPTIONS.ALREADY_EXISTS);

      throw new InternalServerErrorException();
    }

    const { identification, id, fullname, email } = user;

    return {
      token: this.getJwt({ identification }),
      user: {
        identification,
        id,
        fullname,
        email,
      },
    };
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.findOneByIdentification(
        loginUserDto.identification,
      );
      const { password: userPass } = user;
      const { password: loginPass } = loginUserDto;

      if (!(await this.encoder.comparePassword(loginPass, userPass))) {
        throw new UnauthorizedException();
      }

      const { identification, id, fullname, email, career } = user;

      return {
        token: this.getJwt({ identification }),
        user: {
          identification,
          id,
          fullname,
          email,
          career
        },
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  findAll() {
    return this.userModel.find();
  }

  async findOneByIdentification(identification: string) {
    const user = await this.userModel.findOne({ identification });

    if (!user) {
      throw new BadRequestException('user Not found');
    }
    return user;
  }

  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
