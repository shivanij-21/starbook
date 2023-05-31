import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let req = request.clone();
    if (!(req.url.includes('/login') || req.url.includes('/img.png') || req.url.includes('dssss=') || req.url.includes('rssss='))) {
      let token = this.tokenService.getToken();
      if (token) {
        req = request.clone({
          setHeaders: { Authorization: this.tokenService.getToken() },
        });
      }
    }
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (
            event?.body?.errorDescription
              ?.toLowerCase()
              .includes('no session') ||
            event?.body?.errorDescription
              ?.toLowerCase()
              .includes('session expired')
          ) {
            if (this.authService.currentAuthState !== false) {
              this.tokenService.setToken(null);
              this.authService.setLoggedIn(false);
              this.toastr.error(event?.body?.errorDescription);
              window.location.href = window.location.origin + '/#/login';
              // window.location.reload();
            }
          }
        }
        return event;
      })
    );
  }
}
