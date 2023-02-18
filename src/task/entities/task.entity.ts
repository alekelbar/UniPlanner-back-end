import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Deliverable } from '../../deliverables/entities/deliverable.entity';
import mongoose from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

export enum TASK_STATUS {
  COMPLETED = 'Completa',
  IMCOMPLETED = 'Incompleta',
}

@Schema()
export class Task {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  descripcion: string;

  @Prop({
    required: true,
    enum: [TASK_STATUS.COMPLETED, TASK_STATUS.IMCOMPLETED],
  })
  status: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deliverable',
  })
  delivery: Deliverable;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
