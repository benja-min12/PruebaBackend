import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from '../controller/news.controller';
import { NewsService } from '../service/news.service';
import { News, NewsSchema } from '../schemas/news.model';
import { NewsRepository } from '../repository/news.repository';
import { WinstonModule } from 'nest-winston';
import { NewsModule } from '../news.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('NewsController', () => {
  let controller: NewsController;
  let newsService: NewsService;
  const mockNews = {
    _id: '6205ef326a565d996d10a0b8',
    title: 'title',
    author: 'author',
    _tags: ['tag1', 'tag2'],
    activo: true,
    createdAt: '2020-05-06T17:00:00.000Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule,
        WinstonModule.forRoot({
          silent: true,
        }),
        MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
        MongooseModule.forRoot('mongodb://localhost:27017/NewsDB'),
        NewsModule,
      ],
      controllers: [NewsController],
      providers: [NewsService, NewsRepository],
    }).compile();

    controller = module.get<NewsController>(NewsController);
    newsService = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNews test', () => {
    it('test get news', async () => {
      newsService.getNews = jest.fn().mockResolvedValue([mockNews]);
      const result = await controller.viewNews();
      expect(result).toBeDefined();
      expect(result).toMatchObject([mockNews]);
      expect(newsService.getNews).toBeCalled();
    });
  });

  describe('test filter', () => {
    it('test filter for title', async () => {
      newsService.filterNewsByTitle = jest.fn().mockResolvedValue([mockNews]);
      const result = await controller.filtrarNews('title', 'title');
      expect(result).toBeDefined();
      expect(result).toMatchObject([mockNews]);
      expect(newsService.filterNewsByTitle).toBeCalled();
    });
    it('test filter for author', async () => {
      newsService.filterNewsByAuthor = jest.fn().mockResolvedValue([mockNews]);
      const result = await controller.filtrarNews('author', 'author');
      expect(result).toBeDefined();
      expect(result).toMatchObject([mockNews]);
      expect(newsService.filterNewsByAuthor).toBeCalled();
    });
    it('test filter for tags', async () => {
      newsService.filterNewsByTags = jest.fn().mockResolvedValue([mockNews]);
      const result = await controller.filtrarNews('tag1', 'tags');
      expect(result).toBeDefined();
      expect(result).toMatchObject([mockNews]);
      expect(newsService.filterNewsByTags).toBeCalled();
    });
    it('test error filter for title', async () => {
      newsService.filterNewsByTitle = jest.fn().mockResolvedValue(null);
      try {
        await controller.filtrarNews('title2', 'title');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('not found news');
        expect(newsService.filterNewsByTitle).toBeCalled();
      }
    });
    it('test error filter for author', async () => {
      newsService.filterNewsByAuthor = jest.fn().mockResolvedValue(null);
      try {
        await controller.filtrarNews('author2', 'author');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('not found news');
        expect(newsService.filterNewsByAuthor).toBeCalled();
      }
    });
    it('test error filter for tags', async () => {
      newsService.filterNewsByTags = jest.fn().mockResolvedValue(null);
      try {
        await controller.filtrarNews('tag3', 'tags');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('not found news');
        expect(newsService.filterNewsByTags).toBeCalled();
      }
    });
  });
});
