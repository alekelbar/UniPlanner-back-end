import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';
import {
  Deliverable,
  DeliverableDocument,
} from './entities/deliverable.entity';
import { Model } from 'mongoose';

enum DELIVERABLES_EXCEPTIONS {
  NOT_EXIST = 'deliverable does not exits',
  INVALID_SCHEMA = 'data structure has been incorrect(probably, status)',
  VALIDATION_FAILED = 'Validation failed',
}

@Injectable()
export class DeliverablesService {
  constructor(
    @InjectModel(Deliverable.name)
    private deliverableModel: Model<DeliverableDocument>,
  ) {}

  async create(createDeliverableDto: CreateDeliverableDto) {
    const deliverable = await this.deliverableModel.create(
      createDeliverableDto,
    );
    if (!deliverable) throw new InternalServerErrorException();
  }

  async findAll() {
    const deliverables = await this.deliverableModel.find();
    if (!deliverables) throw new InternalServerErrorException();
    return deliverables;
  }

  async findOne(id: string) {
    const deliverable = await this.deliverableModel.findById(id);

    if (!deliverable)
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.NOT_EXIST);

    return deliverable;
  }

  async update(id: string, updateDeliverableDto: UpdateDeliverableDto) {
    // check if deliverable already exist
    if (!this.existInDb(id))
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.NOT_EXIST);

    let deliverableUpdated: DeliverableDocument;

    try {
      deliverableUpdated = await this.deliverableModel.findOneAndUpdate(
        { _id: id },
        updateDeliverableDto,
        { new: true, runValidators: true },
      );
    } catch (error) {
      if (error._message == DELIVERABLES_EXCEPTIONS.VALIDATION_FAILED) {
        throw new BadRequestException(DELIVERABLES_EXCEPTIONS.INVALID_SCHEMA);
      }
      throw new InternalServerErrorException();
    }
    return deliverableUpdated;
  }

  async remove(id: string) {
    // check if deliverable already exist

    if (!this.existInDb(id))
      throw new BadRequestException(DELIVERABLES_EXCEPTIONS.NOT_EXIST);

    const deliverableDeleted = await this.deliverableModel.findOneAndRemove({
      _id: id,
    });

    if (!deliverableDeleted) throw new InternalServerErrorException();

    return deliverableDeleted;
  }

  async existInDb(id: string) {
    return await this.deliverableModel.findById(id);
  }
}
