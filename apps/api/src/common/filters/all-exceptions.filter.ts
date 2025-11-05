import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Log the full error for debugging
    console.error('❌ Exception caught:', {
      message: exception instanceof Error ? exception.message : String(exception),
      stack: exception instanceof Error ? exception.stack : undefined,
      path: request.url,
      method: request.method,
      user: (request as any).user?.id || 'no user',
    });

    const errorResponse = {
      success: false,
      error: {
        code: exception instanceof HttpException ? exception.name : 'INTERNAL_ERROR',
        message: typeof message === 'string' ? message : (message as any).message || 'Internal server error',
        details: typeof message === 'object' ? message : undefined,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    response.status(status).json(errorResponse);
  }
}

