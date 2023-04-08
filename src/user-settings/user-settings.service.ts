import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { User, userDocument } from 'src/auth/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserSetting,
  userSettingsDocuments,
} from './entities/user-setting.entity';
import { USER_EXCEPTIONS } from 'src/auth/auth.service';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(UserSetting.name)
    private settingModel: Model<userSettingsDocuments>,
  ) {}

  async create(createUserSettingDto: CreateUserSettingDto) {
    try {
      const { user } = createUserSettingDto;

      const userExist = await this.userModel.find({ _id: user });
      if (!userExist) {
        throw new NotFoundException(USER_EXCEPTIONS.NOT_FOUND);
      }

      return await this.settingModel.create(createUserSettingDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    try {
      const userExist = await this.userModel.find({ _id: id });

      if (!userExist) {
        throw new NotFoundException(USER_EXCEPTIONS.NOT_FOUND);
      }

      return await this.settingModel.findOne({ user: id });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateUserSettingDto: UpdateUserSettingDto) {
    try {
      return await this.settingModel.findOneAndUpdate(
        { _id: id },
        updateUserSettingDto,
        { new: true },
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
