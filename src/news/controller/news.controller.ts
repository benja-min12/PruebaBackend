import {
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { NewsService } from '../service/news.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('news')
export class NewsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly newsService: NewsService,
  ) {}
  @Get()
  async viewNews() {
    const news = this.newsService.getNews();
    return news;
  }

  @Delete('/deleteNews')
  async deleteNews(@Query('Id') Id: string) {
    const result = this.newsService.deleteNews(Id);
    if (!result) throw new NotFoundException('not found news');
    return result;
  }

  @Get('/filtrarNews')
  async filtrarNews(
    @Query('filter') filter: unknown,
    @Query('type') type: string,
  ) {
    const filterNews = filter.toString();
    if (type === 'title') {
      const newsFlieter = this.newsService.filterNewsByTitle(filterNews);
      if (!newsFlieter) throw new NotFoundException('not found news');
      return newsFlieter;
    } else if (type === 'author') {
      const newsFlieter = this.newsService.filterNewsByAuthor(filterNews);
      if (!newsFlieter) throw new NotFoundException('not found news');
      return newsFlieter;
    } else if (type === 'tags') {
      const newsFlieter = this.newsService.filterNewsByTags(filterNews);
      if (!newsFlieter) throw new NotFoundException('not found news');
      return newsFlieter;
    } else {
      this.viewNews();
    }
  }
}
