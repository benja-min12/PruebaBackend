import { Module } from '@nestjs/common';
import { NewsController } from './controller/news.controller';
import { NewsService } from './service/news.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './schemas/news.model';
import { NewsRepository } from './repository/news.repository';
import { CronNewsService } from './service/cronNews.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository, CronNewsService],
})
export class NewsModule {}
