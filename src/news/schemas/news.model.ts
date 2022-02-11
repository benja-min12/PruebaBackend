import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

@Schema()
export class News {
  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  author: string;

  @Prop()
  created_at: Date;

  @Prop()
  _tags: string[];

  @Prop()
  activo: boolean;

  @Prop()
  deleted_at: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
