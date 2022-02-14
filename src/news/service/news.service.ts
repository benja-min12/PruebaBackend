import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { News } from '../schemas/news.model';
import { NewsRepository } from '../repository/news.repository';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<News>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly NewsRepository: NewsRepository,
  ) {}

  getNews(): Promise<News[]> {
    this.logger.debug('Getting all news');
    return this.NewsRepository.findAllNews();
  }

  async deleteNews(id: string): Promise<News> {
    this.logger.debug('Deleting news');
    const result = this.NewsRepository.findOne(id);
    if (!result) throw new NotFoundException('not found news');
    return this.NewsRepository.deleteNews(id);
  }

  findOne(id: string): Promise<News> {
    this.logger.debug('Finding one news');
    const result = this.NewsRepository.findOne(id);
    if (!result) throw new NotFoundException('not found news');
    return result;
  }

  filterNewsByTitle(title: string): Promise<News[]> {
    this.logger.debug('Finding news by title');
    return this.NewsRepository.findNewsByTitle(title);
  }

  filterNewsByAuthor(author: string): Promise<News[]> {
    this.logger.debug('Finding news by author');
    return this.NewsRepository.findNewsByAuthor(author);
  }

  filterNewsByTags(tags: string): Promise<News[]> {
    this.logger.debug('Finding news by tags');
    return this.NewsRepository.findNewsByTags(tags);
  }
}
