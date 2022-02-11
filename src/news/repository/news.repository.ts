import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from '../schemas/news.model';
import { Model } from 'mongoose';
import { CreatedNewsDto } from '../dto/news.dto';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NewsRepository {
  BASE_URL = ' https://hn.algolia.com/api/v1/search_by_date?query=nodejs';

  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<News>,
    private readonly httpService: HttpService,
  ) {}

  findAll(): Observable<AxiosResponse<any>> {
    return this.httpService.get(this.BASE_URL);
  }

  saveNews(News: CreatedNewsDto) {
    const createdNews = new this.newsModel({ ...News });
    return createdNews.save();
  }

  deleteNews(id: string) {
    return this.newsModel.findOneAndUpdate(
      { _id: id },
      {
        activo: false,
        deleted_at: new Date(),
      },
    );
  }

  findOne(id: string) {
    return this.newsModel.findOne({ _id: id }).exec();
  }

  findOneBytitle(title: string) {
    return this.newsModel.findOne({ title: title }).exec();
  }

  findAllNews() {
    return this.newsModel.find({ activo: true }).exec();
  }

  findNewsByTitle(title: string): Promise<News[]> {
    return this.newsModel.find({ title: title, activo: true }).exec();
  }

  findNewsByAuthor(author: string) {
    return this.newsModel.find({ author: author, activo: true }).exec();
  }

  findNewsByTags(tags: string) {
    return this.newsModel
      .find({
        _tags: { $in: tags },
        activo: true,
      })
      .exec();
  }
}
