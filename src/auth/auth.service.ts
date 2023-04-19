import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CAREERS_EXCEPTION } from '../careers/career.controller';
import { Career, CareerDocument } from '../careers/entities/career.entity';
import { EnconderService } from '../common/services/enconder.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, userDocument } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwtPayload.interface';

export enum USER_EXCEPTIONS {
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

  async checkToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string) {
    const exists = await this.userModel.find({ _id: id });

    if (!exists) {
      throw new BadRequestException(USER_EXCEPTIONS.NOT_FOUND);
    }

    try {
      const user = await this.userModel.findByIdAndUpdate(
        { _id: id },
        updateUserDto,
        {
          new: true,
        },
      );
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException(USER_EXCEPTIONS.ALREADY_EXISTS);
      }
      throw new InternalServerErrorException(USER_EXCEPTIONS.INTERNAL_ERROR);
    }
  }

  async removeCareer(careerId: string, userId: string) {
    const career = await this.careerModel.findById(careerId).exec();

    if (!career) {
      throw new BadRequestException(CAREERS_EXCEPTION.NOT_FOUND);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(USER_EXCEPTIONS.NOT_FOUND);
    }

    try {
      await this.userModel.updateOne(
        { _id: userId },
        { $pull: { careers: careerId } },
      );

      return { name: career.name };
    } catch (error) {
      throw new InternalServerErrorException(USER_EXCEPTIONS.INTERNAL_ERROR);
    }
  }

  async addCareer(careerId: string, userId: string): Promise<Career> {
    const career = await this.careerModel.findById(careerId).exec();

    if (!career) {
      throw new BadRequestException(CAREERS_EXCEPTION.NOT_FOUND);
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(USER_EXCEPTIONS.NOT_FOUND);
    }

    try {
      await this.userModel.updateOne(
        { _id: userId },
        { $push: { careers: careerId } },
      );

      return { name: career.name };
    } catch (error) {
      throw new InternalServerErrorException(USER_EXCEPTIONS.INTERNAL_ERROR);
    }
  }

  async findAllCareers(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new BadRequestException(USER_EXCEPTIONS.NOT_FOUND);
    }

    const { careers: userCareers } = user;

    const careers = userCareers.map(
      async (career) => await this.careerModel.findById(career),
    );

    try {
      const data = await Promise.all(careers);

      return data.map((career) => {
        return {
          name: career.name,
          _id: career._id.toString(),
        };
      });
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
      token: this.getJwt({ id }),
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

      if (!user) {
        throw new BadRequestException(USER_EXCEPTIONS.NOT_FOUND);
      }
      const { password: userPass } = user;
      const { password: loginPass } = loginUserDto;

      if (!(await this.encoder.comparePassword(loginPass, userPass))) {
        throw new UnauthorizedException();
      }

      const { identification, id, fullname, email } = user;

      return {
        token: this.getJwt({ id }),
        user: {
          identification,
          id,
          fullname,
          email,
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
    return await this.userModel.findOne({ identification });
  }

  async findOneByUniqueId(id: string) {
    return await this.userModel.findById(id);
  }

  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
