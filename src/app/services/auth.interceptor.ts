import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { global } from './global';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const normalizedBaseUrl = global.url.toLowerCase();
    const normalizedRequestUrl = req.url.toLowerCase();
    const isApiRequest = normalizedRequestUrl.startsWith(normalizedBaseUrl);
    const isPublicEndpoint = normalizedRequestUrl === `${normalizedBaseUrl}login`;

    let requestToSend = req;

    if (isApiRequest && !isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        requestToSend = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(requestToSend).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && isApiRequest && !isPublicEndpoint) {
          localStorage.removeItem('identityControlPagos');
          localStorage.removeItem('token');
          localStorage.removeItem('tpago');
          localStorage.removeItem('token1');
          localStorage.removeItem('tpa');
          localStorage.removeItem('identity2');
          localStorage.removeItem('identity1');
          localStorage.removeItem('permisos');
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
