import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';
import { Course } from '../../courses/entities/course.entity';
import mongoose from 'mongoose';

export type DeliverableDocument = HydratedDocument<Deliverable>;

export enum DELIVERABLE_STATUS {
  SEND = 'Enviado',
  PENDING = 'Pendiente',
}

@Schema()
export class Deliverable {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
    type: Date,
  })
  deadline: Date;

  @Prop({
    required: true,
    enum: [DELIVERABLE_STATUS.PENDING, DELIVERABLE_STATUS.SEND],
  })
  status: string;

  @Prop({
    required: true,
  })
  note: number;

  @Prop({
    required: true,
    type: Date,
  })
  createdAt: Date;

  @Prop({
    required: true,
  })
  percent: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
  })
  course: Course;
}

export const DeliverableSchema = SchemaFactory.createForClass(Deliverable);
