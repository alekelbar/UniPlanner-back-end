import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CareerDocument = HydratedDocument<Career>;

@Schema()
export class Career {
  @Prop({
    unique: true,
    required: true,
  })
  name: string;
}

export const CareerSchema = SchemaFactory.createForClass(Career);
