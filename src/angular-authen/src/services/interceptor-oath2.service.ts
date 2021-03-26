import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { OAuthModuleConfig, OAuthStorage } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable()
export class OAuthInterceptor implements HttpInterceptor {
  constructor(
    private authStorage: OAuthStorage,
    @Optional() private moduleConfig: OAuthModuleConfig
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = req.url.toLowerCase();
    if (this.checkUrl(url) === -1) {
      return next.handle(req);
    }

    const sendAccessToken = this.moduleConfig.resourceServer.sendAccessToken;

    if (sendAccessToken) {
      const token = this.authStorage.getItem('access_token');

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req);
  }

  // private checkUrl(url: string): boolean {
  //   const found = this.moduleConfig.resourceServer.allowedUrls.find((u) =>
  //     url.startsWith(u)
  //   );
  //   return !!found;
  // }

  private checkUrl(url: string): number {
    const allowUrl = this.moduleConfig.resourceServer.allowedUrls.join(',');
    return allowUrl.indexOf(url);
  }
}
