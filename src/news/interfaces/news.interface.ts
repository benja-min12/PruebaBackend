import { Document } from 'mongoose';

export interface News extends Document {
  title: string;
  url: string;
  author: string;
  created_at: Date;
  _tags: string[];
  activo: boolean;
}
