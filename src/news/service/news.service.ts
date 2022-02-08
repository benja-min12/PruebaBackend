import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { News } from '../interfaces/news.interface';
import { CreatedNewsDto } from '../dto/news.dto';

@Injectable()
export class NewsService {
  BASE_URL = ' https://hn.algolia.com/api/v1/search_by_date?query=nodejs';
  constructor(
    @InjectModel('News') private readonly newsModel: Model<News>,
    private readonly httpService: HttpService,
  ) {}

  findAll(): Observable<AxiosResponse<any>> {
    return this.httpService.get(this.BASE_URL);
  }

  async findOne(id: string): Promise<News> {
    return await this.newsModel.findOne({ title: id });
  }

  async getNews(): Promise<News[]> {
    const News = await this.newsModel.find({ activo: true });
    return News;
  }

  async create(news: CreatedNewsDto): Promise<News> {
    const createdNews = new this.newsModel(news);
    return await createdNews.save();
  }

  async deleteNews(id: any): Promise<News> {
    const news = await this.newsModel.findOneAndUpdate(
      { _id: id },
      { activo: false },
    );
    return news;
  }
  //filter news by title
  async filterNews(title: string): Promise<News> {
    const news = await this.newsModel.findOne({ title: title, activo: true });
    return news;
  }

  //filter news by author
  async filterNewsByAuthor(author: string): Promise<News[]> {
    const news = await this.newsModel.find({ author: author, activo: true });
    return news;
  }

  //filter news by tags
  async filterNewsByTags(tags: string[]): Promise<News[]> {
    const news = await this.newsModel.find({
      _tags: { $in: tags },
      activo: true,
    });
    return news;
  }
  //limpiar la base de datos de news que no esten activos
  async delete() {
    const news = await this.newsModel.remove({ activo: false });
    return news;
  }
}
