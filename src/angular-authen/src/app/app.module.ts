import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    RouterModule.forRoot(routes, { useHash: true, initialNavigation: false }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
