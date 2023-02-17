import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { Career } from '../../career/entities/career.entity';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({
    index: true,
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
  })
  career: Career;
  
  @Prop({
    required: true,
  })
  user: User;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
