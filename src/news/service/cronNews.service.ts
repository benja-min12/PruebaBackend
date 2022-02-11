import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreatedNewsDto } from '../dto/news.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NewsRepository } from '../repository/news.repository';

@Injectable()
export class CronNewsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly NewsRepository: NewsRepository,
  ) {}

  @Cron('0 0 * * * *')
  async GetData() {
    this.logger.debug('Cron job is running');
    const { data } = await this.NewsRepository.findAll().toPromise();
    const { hits } = data;
    const hitsFiltrados = hits.filter(
      (item) => item.story_url && item.story_title,
    );
    for (const item of hitsFiltrados) {
      const createdNewsDto: CreatedNewsDto = {
        title: item.story_title,
        url: item.story_url,
        author: item.author,
        created_at: item.created_at,
        _tags: item._tags,
        activo: true,
      };
      const existe = await this.NewsRepository.findOneBytitle(item.story_title);
      if (!existe) {
        await this.NewsRepository.saveNews(createdNewsDto);
      }
    }

    const hitsFiltrados2 = hits.filter((item) => item.title && item.url);

    for (const item of hitsFiltrados2) {
      const createdNews: CreatedNewsDto = {
        title: item.title,
        url: item.url,
        author: item.author,
        created_at: item.created_at,
        _tags: item._tags,
        activo: true,
      };
      const existe = await this.NewsRepository.findOneBytitle(item.title);
      if (!existe) {
        await this.NewsRepository.saveNews(createdNews);
      }
    }
    const hitsFiltrados3 = hits.filter((item) => item.title && item.story_url);
    for (const item of hitsFiltrados3) {
      const createdNews: CreatedNewsDto = {
        title: item.title,
        url: item.story_url,
        author: item.author,
        created_at: item.created_at,
        _tags: item._tags,
        activo: true,
      };
      const existe = await this.NewsRepository.findOneBytitle(item.title);
      if (!existe) {
        await this.NewsRepository.saveNews(createdNews);
      }
    }
    const hitsFiltrados4 = hits.filter((item) => item.url && item.story_title);
    for (const item of hitsFiltrados4) {
      const createdNews: CreatedNewsDto = {
        title: item.story_title,
        url: item.url,
        author: item.author,
        created_at: item.created_at,
        _tags: item._tags,
        activo: true,
      };
      const existe = await this.NewsRepository.findOneBytitle(item.title);
      if (!existe) {
        await this.NewsRepository.saveNews(createdNews);
      }
    }
    this.logger.info('Save news Finish');
  }
}
