import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiUrlShorten() {
  return applyDecorators(
    ApiOperation({
      summary: 'Shorten a URL',
      description: 'Shorten a long URL to a short URL',
    }),
    ApiResponse({
      status: 201,
      description: 'Return the short URL',
      schema: {
        example: 'BASE_URL/short-url',
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
    }),
  );
}

export function ApiShortUrl() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resolve a short URL',
      description: 'Redirect to the long URL',
    }),
    ApiResponse({
      status: 302,
      description: 'Redirect to the long URL',
    }),
    ApiResponse({
      status: 404,
      description: 'Short URL not found',
    }),
    ApiResponse({
      status: 410,
      description: 'Short URL has expired',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
    }),
  );
}
