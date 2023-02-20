import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isHeaderRequired(request)) {
      request = this.setRequestHeader(request);
    }
    return next.handle(request);
  }

  private isHeaderRequired(request: HttpRequest<any>): boolean {
    return !request.url.includes('graphql');
  }

  private setRequestHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.localStorageService.get('auth-token');
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': `Bearer ${token}`,
      }),
    };
    request = request.clone(httpOptions);

    return request;
  }
}
