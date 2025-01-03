import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import UrlController from './url.controller';
import UrlService from '../services/url.service';
import { UrlDto } from '../dto/url.dto';

const mockUrlService = {
  createShortUrl: jest.fn(),
  getLongUrl: jest.fn(),
};

describe('UrlController', () => {
  let controller: UrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to the original URL', async () => {
    const shortUrl = 'abc123';
    const longUrl = 'https://example.com';
    mockUrlService.getLongUrl.mockResolvedValue({ longUrl });

    const res = {
      redirect: jest.fn(),
    };

    await controller.resolveUrl(shortUrl, res as any);
    expect(mockUrlService.getLongUrl).toHaveBeenCalledWith(shortUrl);
    expect(res.redirect).toHaveBeenCalledWith(longUrl);
  });

  it('should throw NotFoundException if short URL does not exist', async () => {
    mockUrlService.getLongUrl.mockResolvedValue(null);

    await expect(controller.resolveUrl('invalid', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if short URL is expired', async () => {
    const shortUrl = 'expired123';
    const longUrl = 'https://example.com';
    const expirationDate = new Date(Date.now() - 1000); // Expired

    mockUrlService.getLongUrl.mockResolvedValue({ longUrl, expirationDate });

    await expect(controller.resolveUrl(shortUrl, {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});
