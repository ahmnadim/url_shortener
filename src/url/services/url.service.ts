import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Url } from '../../entities/url.entity';

@Injectable()
export default class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  // Generate a 6-character short key using hash
  private generateShortUrl(longUrl: string): string {
    const hash = crypto.createHash('sha256').update(longUrl).digest('base64');
    return hash.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
  }

  // Create a short Url
  async createShortUrl(
    longUrl: string,
    customKey?: string,
    expirationDate?: Date,
  ) {
    const existing = await this.urlRepository.findOne({ where: { longUrl } });

    if (existing) {
      return `${process.env.BASE_URL}/${existing.shortUrl}`;
    }

    const existingCustomKey = await this.urlRepository.findOne({
      where: { customKey },
    });

    const shortUrl =
      customKey && !existingCustomKey
        ? customKey
        : this.generateShortUrl(longUrl);

    const url = this.urlRepository.create({
      longUrl,
      shortUrl,
      customKey,
      expirationDate,
    });

    const newUrl = await this.urlRepository.save(url);
    return `${process.env.BASE_URL}/${newUrl.shortUrl}`;
  }

  // Find long Url by short Url
  async getLongUrl(shortUrl: string) {
    return this.urlRepository.findOne({ where: { shortUrl } });
  }
}
