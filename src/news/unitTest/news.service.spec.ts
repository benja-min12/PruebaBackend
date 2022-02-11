import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from '../service/news.service';
import { CreatedNewsDto } from '../dto/news.dto';
import { NewsModule } from '../news.module';

describe('NewsService', () => {
  let service: NewsService;
  class EventModel {
    constructor(private data) {}
    save = jest.fn().mockResolvedValue(this.data);
    static find = jest.fn().mockResolvedValue([CreatedNewsDto]);
    static findOne = jest.fn().mockResolvedValue(CreatedNewsDto);
    static findOneAndUpdate = jest.fn().mockResolvedValue(CreatedNewsDto);
    static deletenews = jest.fn().mockResolvedValue(true);
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getModelToken('News'),
          useValue: EventModel,
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        NewsModule,
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNews', () => {
    it('should return an array of news', async () => {
      const result = await service.getNews();
      expect(result).toEqual([CreatedNewsDto]);
    });
  });

  describe('delete', () => {
    it('should find and update one news', async () => {
      expect(service.deleteNews('53d53d2s')).toBeTruthy();
    });
  });
});
