import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Career, CareerDocument } from './entities/career.entity';

@Injectable()
export class CareerService {
  constructor(
    @InjectModel(Career.name) private careerModel: Model<CareerDocument>,
  ) {}

  findAll() {
    return this.careerModel.find();
  }

  async findOne(id: string) {
    const career = await this.careerModel.findById(id);

    if (!career) {
      throw new NotFoundException('career not found');
    }

    return career;
  }
}
