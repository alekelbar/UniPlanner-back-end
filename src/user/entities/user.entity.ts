import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Career } from '../../career/entities/career.entity';
import * as bcrypt from 'bcrypt';

export type userDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    unique: true,
    index: true,
  })
  identification: string;

  @Prop()
  fullname: string;

  @Prop({
    unique: true,
    index: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Career' })
  career: Career;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = await bcrypt.hash(this.password, salt);

  this.password = hashedPassword;
  next();
});
