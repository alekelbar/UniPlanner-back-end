import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CareerModule } from './careers/career.module';
import { CommonModule } from './common/common.module';
import { appConfig } from './common/config/app.config';
import { joiValidation } from './common/config/joi.validation';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { DeliverablesModule } from './deliverables/deliverables.module';
import { TasksModule } from './task/tasks.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: joiValidation,
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    CareerModule,
    CommonModule,
    AuthModule,
    CoursesModule,
    DeliverablesModule,
    TasksModule,
    SessionsModule,
  ],
})
export class AppModule {}
