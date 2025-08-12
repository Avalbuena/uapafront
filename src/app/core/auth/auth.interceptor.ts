import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const type  = localStorage.getItem('token_type') || 'Bearer';

    if (token) {
      req = req.clone({ setHeaders: { Authorization: `${type} ${token}` } });
      // console.debug('[HTTP] Authorization ->', req.url);
    }
    return next.handle(req);
  }
}
