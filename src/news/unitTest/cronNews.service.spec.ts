import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { NewsModule } from '../news.module';
import { NewsRepository } from '../repository/news.repository';
import { News, NewsSchema } from '../schemas/news.model';
import { CronNewsService } from '../service/cronNews.service';

describe('CronNewsService', () => {
  let service: CronNewsService;
  let newsRepository: NewsRepository;
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
        NewsModule,
        MongooseModule.forRoot('mongodb://localhost:27017/NewsDB'),
      ],
      providers: [CronNewsService, NewsRepository],
    }).compile();

    service = module.get<CronNewsService>(CronNewsService);
    newsRepository = module.get<NewsRepository>(NewsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get data', () => {
    it('test get data', async () => {
      newsRepository.findOneBytitle = jest.fn().mockResolvedValue(null);
      newsRepository.saveNews = jest.fn().mockResolvedValue(mockNews);
      const result = await service.GetData();
      expect(result).toBeDefined();
      expect(newsRepository.findOneBytitle).toBeCalled();
      expect(newsRepository.saveNews).toBeCalled();
    });
  });
});
