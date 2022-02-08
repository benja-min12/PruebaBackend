import { Schema } from 'mongoose';

export const NewsSchema = new Schema({
  title: String,
  url: String,
  author: String,
  created_at: Date,
  _tags: [String],
  activo: Boolean,
});
