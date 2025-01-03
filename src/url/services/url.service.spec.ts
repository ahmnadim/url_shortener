import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import UrlService from './url.service';
import { Url } from '../../entities/url.entity';

const mockUrlRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('UrlService', () => {
  let service: UrlService;
  let repository: Repository<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepository,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    repository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a unique 6-character short Url', () => {
    const longUrl = 'https://example.com/some/long/url';
    const shortUrl = service['generateShortUrl'](longUrl);
    expect(shortUrl).toHaveLength(6);
  });

  it('should return an existing short Url if long Url already exists', async () => {
    const longUrl = 'https://example.com';
    const existingUrl = { shortUrl: 'abc123', longUrl };
    mockUrlRepository.findOne.mockResolvedValue(existingUrl);

    const result = await service.createShortUrl(longUrl);
    expect(mockUrlRepository.findOne).toHaveBeenCalledWith({
      where: { longUrl },
    });
    expect(result).toEqual(`${process.env.BASE_URL}/abc123`);
  });

  it('should create a new short Url for a new long Url', async () => {
    const longUrl = 'https://example.com/new-url';
    const newUrl = { shortUrl: 'xyz456', longUrl };
    mockUrlRepository.findOne.mockResolvedValue(null); // No existing Url
    mockUrlRepository.create.mockReturnValue(newUrl);
    mockUrlRepository.save.mockResolvedValue(newUrl);

    const result = await service.createShortUrl(longUrl);
    expect(mockUrlRepository.create).toHaveBeenCalledWith({
      longUrl,
      shortUrl: expect.any(String),
      customKey: undefined,
      expirationDate: undefined,
    });
    expect(result).toEqual(`${process.env.BASE_URL}/xyz456`);
  });

  it('should find long Url by short Url', async () => {
    const shortUrl = 'abc123';
    const longUrl = 'https://example.com';
    mockUrlRepository.findOne.mockResolvedValue({ shortUrl, longUrl });

    const result = await service.getLongUrl(shortUrl);
    expect(mockUrlRepository.findOne).toHaveBeenCalledWith({
      where: { shortUrl },
    });
    expect(result).toEqual({ shortUrl, longUrl });
  });

  it('should return null for an invalid short Url', async () => {
    mockUrlRepository.findOne.mockResolvedValue(null);

    const result = await service.getLongUrl('invalid');
    expect(result).toBeNull();
  });
});
