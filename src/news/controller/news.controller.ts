import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NewsService } from '../service/news.service';
import { CreatedNewsDto } from '../dto/news.dto';
import { Cron } from '@nestjs/schedule';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Cron('0 * * * * *')
  async getData() {
    const { data } = await this.newsService.findAll().toPromise();
    const { hits } = data;
    //mostrar solo los hits que tienen story_url y story_title
    const hitsFiltrados = hits.filter(
      (item) => item.story_url && item.story_title,
    );
    //recorrer los hits filtrados
    for (const item of hitsFiltrados) {
      const createdNewsDto: CreatedNewsDto = {
        title: item.story_title,
        url: item.story_url,
        author: item.author,
        created_at: item.created_at,
        _tags: item._tags,
        activo: true,
      };
      //verificar si existe el registro
      const existe = await this.newsService.findOne(item.story_title);
      if (!existe) {
        //crear el registro
        await this.newsService.create(createdNewsDto);
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
      const existe = await this.newsService.findOne(item.title);
      if (!existe) {
        await this.newsService.create(createdNews);
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
      const existe = await this.newsService.findOne(item.title);
      if (!existe) {
        const hackerNews = await this.newsService.create(createdNews);
      }
      return data;
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
      const existe = await this.newsService.findOne(item.title);
      if (!existe) {
        const hackerNews = await this.newsService.create(createdNews);
      }
    }
  }

  //limpia la base de datos de news (borra todos los registros que no esten activos)
  @Cron('0 0 * * * *')
  async deletePermanet() {
    const newsFlieter = await this.newsService.delete();
  }

  @Get()
  async viewNews() {
    const news = await this.newsService.getNews();
    return news;
  }

  @Put('/deleteNews')
  async deleteNews(@Query('Id') Id) {
    const result = this.newsService.deleteNews(Id);
    if (!result) throw new NotFoundException('No existe la noticia');
    return result;
  }

  @Post('/filtrarNews')
  async filtrarNews(@Query('filter') filter: any, @Query('type') type: string) {
    if (type === 'title') {
      const newsFlieter = await this.newsService.filterNews(filter);
      if (!newsFlieter) throw new NotFoundException('No existe la noticia');
      return newsFlieter;
    } else if (type === 'author') {
      const newsFlieter = await this.newsService.filterNewsByAuthor(filter);
      if (!newsFlieter) throw new NotFoundException('Author no existe');
      return newsFlieter;
    } else if (type === 'tags') {
      const newsFlieter = await this.newsService.filterNewsByTags(filter);
      if (!newsFlieter) throw new NotFoundException('Tag no existe');
      return newsFlieter;
    } else {
      this.viewNews();
    }
  }
}
