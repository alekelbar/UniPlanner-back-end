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

enum USER_EXCEPTIONS {
  NOT_FOUND = 'USER Not Found',
  ALREADY_EXISTS = 'USER Already Exists',
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<userDocument>,
    private encoder: EnconderService,
    private jwtService: JwtService,
  ) {}

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
    const user = await this.findOneByIdentification(
      loginUserDto.identification,
    );

    if (!user) throw new UnauthorizedException();

    if (
      await this.encoder.comparePassword(loginUserDto.password, user.password)
    ) {
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

    throw new UnauthorizedException();
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
