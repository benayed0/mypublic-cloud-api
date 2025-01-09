import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type Document = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true, type: String })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
