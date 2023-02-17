import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Career } from '../../careers/entities/career.entity';
import mongoose from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  courseDescription: string;

  @Prop({
    required: true,
  })
  credits: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
  })
  career: Career;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
