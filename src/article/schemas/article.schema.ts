import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({ required: true, unique: true })
  article_id: string;

  @Prop({ required: true, type: Types.ObjectId })
  author_id: Types.ObjectId;

  @Prop({ required: true, type: String })
  report_name: string;

  @Prop({ required: true, type: String })
  scientificDoc_name: string;

  @Prop({ type: String })
  article_name: string;
  @Prop({ type: String, default: 'processing' })
  state: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
