import { Module } from '@nestjs/common';
import UrlService from './services/url.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from 'src/entities/url.entity';
import UrlController from './controllers/url.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  exports: [],
  controllers: [UrlController],
  providers: [UrlService],
})
export default class UrlModule {}
