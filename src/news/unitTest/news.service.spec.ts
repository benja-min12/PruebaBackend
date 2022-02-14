import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from '../service/news.service';
import { NewsModule } from '../news.module';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { News, NewsSchema } from '../schemas/news.model';
import { NewsRepository } from '../repository/news.repository';

const mockNews = {
  _id: '6205ef326a565d996d10a0b8',
  title: 'title',
  author: 'author',
  _tags: ['tag1', 'tag2'],
  activo: true,
  createdAt: '2020-05-06T17:00:00.000Z',
};

const mockId = '6205ef326a565d996d10a0b8';

describe('NewsService', () => {
  let service: NewsService;
  let newsRepository: NewsRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule,
        WinstonModule.forRoot({
          silent: true,
        }),
        MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
        NewsModule,
        MongooseModule.forRoot('mongodb://localhost:27017/NewsDB'),
      ],
      providers: [NewsService, NewsRepository],
    }).compile();

    service = module.get<NewsService>(NewsService);
    newsRepository = module.get<NewsRepository>(NewsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get news', () => {
    it('should return an array of news', async () => {
      newsRepository.findAllNews = jest.fn().mockResolvedValue([mockNews]);
      const result = await service.getNews();
      expect(result).toBeDefined();
      expect(result).toMatchObject([mockNews]);
      expect(newsRepository.findAllNews).toHaveBeenCalled();
    });

    it('should return an empty array', async () => {
      newsRepository.findAllNews = jest.fn().mockResolvedValue([]);
      const result = await service.getNews();
      expect(result).toBeDefined();
      expect(result).toMatchObject([]);
      expect(newsRepository.findAllNews).toHaveBeenCalled();
    });
  });

  describe('delete test', () => {
    it('delete news', async () => {
      newsRepository.deleteNews = jest.fn().mockResolvedValue(mockNews);
      newsRepository.findOne = jest.fn().mockResolvedValue(mockNews);
      const result = await service.deleteNews(mockId);
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
      expect(result).toMatchObject(mockNews);
      expect(newsRepository.deleteNews).toBeCalled();
      expect(newsRepository.findOne).toHaveBeenCalled();
    });
    it('delete news error', async () => {
      newsRepository.deleteNews = jest.fn().mockResolvedValue(mockNews);
      newsRepository.findOne = jest.fn().mockResolvedValue(null);
      try {
        await service.deleteNews(mockId);
      } catch (error) {
        expect(newsRepository.findOne).toBeCalled();
        expect(error).toBeDefined();
        expect(error.message).toBe('not found news');
      }
    });
  });
});
