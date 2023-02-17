import { Injectable } from '@nestjs/common';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

@Injectable()
export class DeliverablesService {
  create(createDeliverableDto: CreateDeliverableDto) {
    return 'This action adds a new deliverable';
  }

  findAll() {
    return `This action returns all deliverables`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliverable`;
  }

  update(id: number, updateDeliverableDto: UpdateDeliverableDto) {
    return `This action updates a #${id} deliverable`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliverable`;
  }
}
