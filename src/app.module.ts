import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CareerModule } from './careers/career.module';
import { CommonModule } from './common/common.module';
import { appConfig } from './common/config/app.config';
import { joiValidation } from './common/config/joi.validation';
import { UserModule } from './users/user.module';
import { CoursesModule } from './courses/courses.module';
import { DeliverablesModule } from './deliverables/deliverables.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: joiValidation,
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    CareerModule,
    CommonModule,
    UserModule,
    CoursesModule,
    DeliverablesModule,
  ],
  controllers: [],
  exports: [],
  providers: [],
})
export class AppModule {}
