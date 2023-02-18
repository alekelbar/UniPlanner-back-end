import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserSchema } from '../auth/entities/user.entity';
import { Career, CareerSchema } from '../careers/entities/career.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
      { name: Career.name, schema: CareerSchema },
    ]),
    ConfigModule
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
