import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './theme/header/header.component';
import { BaseComponent } from './theme/base/base.component';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { NotificationsComponent } from './theme/notifications/notifications.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { NgModule } from '@angular/core';
import { ScrollTopComponent } from './theme/scroll-top/scroll-top.component';
import { SidebarComponent } from './theme/sidebar/sidebar.component';
import { NbActionsModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbGlobalPhysicalPosition, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbSearchModule, NbSidebarModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BaseComponent,
    SidebarComponent,
    NotificationsComponent,
    ScrollTopComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule,
    SocialLoginModule,
    LoadingBarRouterModule,
    NbThemeModule.forRoot(
      { name: 'corporate' }
    ),
    NbLayoutModule,
    NbSidebarModule.forRoot(), // NbSidebarModule.forRoot(), //if this is your app.module
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot({
      limit: 3,
      preventDuplicates: true,
      position: NbGlobalPhysicalPosition.TOP_LEFT
    }),
    NbDatepickerModule.forRoot(),
    NbIconModule,
    NbButtonModule,
    NbSearchModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '259218453631-r8rschc1e0bic5tv78ue3kpn53jcjto0.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
