import { Module } from '@nestjs/common';
import { NewsController } from './controller/news.controller';
import { NewsService } from './service/news.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSchema } from './schemas/news.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: 'News', schema: NewsSchema }]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
