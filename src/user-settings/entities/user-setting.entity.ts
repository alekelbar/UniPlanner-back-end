import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

export type userSettingsDocuments = HydratedDocument<UserSetting>;

@Schema()
export class UserSetting {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    required: true,
  })
  importance: number;

  @Prop({
    required: true,
  })
  urgency: number;

  @Prop({
    required: true,
  })
  do: string;

  @Prop({
    required: true,
  })
  prepare: string;

  @Prop({
    required: true,
  })
  delegate: string;

  @Prop({
    required: true,
  })
  ignore: string;
}

export const settingsSchema = SchemaFactory.createForClass(UserSetting);
