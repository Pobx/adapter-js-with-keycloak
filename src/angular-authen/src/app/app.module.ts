import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OAuthModule, OAuthModuleConfig } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];
const oAuthModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: ['https://localhost:5001/api/'],
    sendAccessToken: true,
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot(oAuthModuleConfig),
    RouterModule.forRoot(routes, { useHash: true, initialNavigation: false }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
