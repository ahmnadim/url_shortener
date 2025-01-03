import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UrlDto {
  @ApiProperty({
    description: 'The URL to shorten',
    example: 'https://www.google.com',
  })
  @IsDefined({ message: 'Please provide a URL' })
  @IsNotEmpty({ message: 'Please provide a URL' })
  @IsUrl({
    allow_underscores: true,
  })
  longUrl: string;

  @ApiProperty({
    description: 'A custom key for the short URL',
    example: 'my-custom-key',
  })
  customKey?: string;

  @ApiProperty({
    description: 'The expiration date of the short URL',
    example: '2025-12-31',
  })
  expirationDate?: Date;
}
