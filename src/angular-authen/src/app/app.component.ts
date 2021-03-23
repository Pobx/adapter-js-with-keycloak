import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AuthConfig,
  NullValidationHandler,
  OAuthErrorEvent,
  OAuthEvent,
  OAuthService,
} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-authen';
  accessToken: string;
  expiration: number;
  expirationDate: any;
  oAuthEvent: OAuthEvent;
  oAuthEventError: OAuthErrorEvent;
  response: any;

  constructor(private oauthService: OAuthService, private http: HttpClient) {
    this.configure();
  }

  authConfig: AuthConfig = {
    issuer: 'http://localhost:8080/auth/realms/angular-web-app',
    redirectUri: window.location.origin,
    clientId: 'angular-app-demo',
    scope: 'openid profile',
    responseType: 'code',
    // at_hash is not present in JWT token
    // disableAtHashCheck: true,
    showDebugInformation: true,
    // silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
    // useSilentRefresh: true,
  };

  ngOnInit() {
    setTimeout(() => {
      this.accessToken = this.oauthService.getAccessToken();
      this.expiration = this.oauthService.getAccessTokenExpiration();
      this.expirationDate =
        this.expiration === null ? null : new Date(this.expiration);
    }, 1000);

    this.oauthService.silentRefreshRedirectUri =
      window.location.origin + '/silent-refresh.html';
    this.oauthService.setupAutomaticSilentRefresh({}, 'access_token');
    // this.oauthService
    //   .silentRefresh()
    //   .then((info) => (this.oAuthEvent = info))
    //   .catch((err) => (this.oAuthEventError = err));
  }

  private configure() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  public login() {
    this.oauthService.initLoginFlow();
  }

  public logoff() {
    this.oauthService.logOut();
  }

  public loadAccessToken() {
    this.accessToken = this.oauthService.getAccessToken();
    this.expiration = this.oauthService.getAccessTokenExpiration();
  }

  loadApi() {
    // tslint:disable-next-line: one-variable-per-declaration
    // const options = {
    //   headers: new HttpHeaders().set('Authorization',  `Bearer ${this.oauthService.getAccessToken())}`)
    // }

    this.http
      .get(`https://localhost:5001/api/WeatherForecast`, {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.oauthService.getAccessToken()}`
        ),
      })
      .subscribe((response) => (this.response = response));
  }
}
