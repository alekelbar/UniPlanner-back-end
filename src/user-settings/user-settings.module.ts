import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSetting, settingsSchema } from './entities/user-setting.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserSchema } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSetting.name, schema: settingsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
})
export class UserSettingsModule {}
