import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class HttpSuccessInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private readonly logger = new Logger(HttpSuccessInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'];

    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        const response = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          success: true,
          data,
        };
        this.logger.log(`${method} ${url} ${statusCode} - ${userAgent} ${ip}`);
        return response;
      }),
    );
  }
}
