import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import UrlService from '../services/url.service';
import { UrlDto } from '../dto/url.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiShortUrl, ApiUrlShorten } from '../decorators/api.decorator';

@ApiTags('URL')
@Controller()
export default class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('url/shorten')
  @ApiUrlShorten()
  async shortenUrl(
    @Body(ValidationPipe) { longUrl, customKey, expirationDate }: UrlDto,
  ) {
    return await this.urlService.createShortUrl(
      longUrl,
      customKey,
      expirationDate ? new Date(expirationDate) : undefined,
    );
  }

  @Get(':shortUrl')
  @ApiShortUrl()
  async resolveUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const url = await this.urlService.getLongUrl(shortUrl);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    // Check expiration
    if (url.expirationDate && url.expirationDate < new Date()) {
      throw new NotFoundException('Short URL has expired');
    }

    return res.redirect(url.longUrl);
  }
}
