import { Injectable } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

@Injectable()
export class CareerService {
  findAll() {
    return `This action returns all career`;
  }

  findOne(id: number) {
    return `This action returns a #${id} career`;
  }
}
