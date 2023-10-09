import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { tap } from 'rxjs';
import { ToastifyNotificationsService } from 'src/app/services/toastify-notifications/toastify-notifications.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private toast: ToastifyNotificationsService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        next: (event: any) => {
          return event;
        },
        error: (error: any) => {
          if (error.status === 401) {
            this.toast.error('פג תוקף ההתחברות אנא התחבר מחדש');
            this.auth.logout();
          }
        }
      })
    );
  }
}
