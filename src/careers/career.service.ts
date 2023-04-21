import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Career, CareerDocument } from './entities/career.entity';

@Injectable()
export class CareerService {
  constructor(
    @InjectModel(Career.name) private careerModel: Model<CareerDocument>,
    private configService: ConfigService,
  ) {}

  findPaginate(page: number) {
    return this.careerModel
      .find()
      .limit(this.configService.get('limitPerPage'))
      .skip(this.configService.get('skipPerPage') * page);
  }

  async findAll(): Promise<Career[]> {
    return this.careerModel.find().exec();
  }

  async findOne(id: string): Promise<Career> {
    const career = await this.careerModel.findById(id);

    if (!career) {
      throw new NotFoundException('career not found');
    }
    return career;
  }
}
