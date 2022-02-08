import { Test, TestingModule } from '@nestjs/testing';
import { Mongoose } from 'mongoose';
import { NewsController } from '../controller/news.controller';
import { NewsModule } from '../news.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { HttpModule, HttpService } from '@nestjs/axios';
import { NewsService } from '../service/news.service';
import { CreatedNewsDto } from '../dto/news.dto';

describe('NewsController', () => {
  let controller: NewsController;
  let newsService: NewsService;
  const prueba: CreatedNewsDto = {
    _id: 1,
    title: 'title',
    url: 'url',
    author: 'author',
    created_at: new Date(),
    _tags: ['tag1', 'tag2'],
    activo: true,
  };
  const mockmodel = {
    find: jest.fn().mockResolvedValue([prueba]),
    findOneAndUpdate: jest.fn().mockResolvedValue(CreatedNewsDto),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [NewsController],
      providers: [
        NewsService,
        {
          provide: getModelToken('News'),
          useValue: mockmodel,
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
    newsService = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //test para viewNews
  describe('viewNews', () => {
    it('should return an array of news', async () => {
      const result = await controller.viewNews();
      expect(result).toEqual([CreatedNewsDto]);
    });
  });

  describe('deleteNews', () => {
    it('should return false', async () => {
      const result = await controller.deleteNews('1');
      console.log(result);
      expect(result).toEqual(false);
    });
  });
});
