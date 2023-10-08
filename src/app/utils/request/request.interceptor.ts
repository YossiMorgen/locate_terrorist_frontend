import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
<<<<<<< HEAD
          cookie: this.auth.getToken()
=======
        authorization: 'Bearer ' + this.auth.getToken()
>>>>>>> f771355a97365898f0bd4263cdc22976126fc85a
      }
    });

    return next.handle(request);
  }
}
