import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './theme/header/header.component';
import { BaseComponent } from './theme/base/base.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { faArrowDown, faArrowLeft, faArrowRight, faBalanceScale, faBell, faCheck, faChevronUp, faCog, faCopy, faHome, faInfoCircle, faPen, faPlus, faSignOutAlt, faTimes, faUserFriends, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { NotificationsComponent } from './theme/notifications/notifications.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ScrollTopComponent } from './theme/scroll-top/scroll-top.component';
import { ToastrModule } from 'ngx-toastr';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BaseComponent,
    NotificationsComponent,
    ScrollTopComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    GraphQLModule,
    SocialLoginModule,
    ToastrModule.forRoot({
      autoDismiss: false,
      // preventDuplicates: true,
      timeOut: 4000,
      positionClass: 'toast-top-center'
    }),
    LoadingBarRouterModule
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
  constructor(library: FaIconLibrary) {
    // Add multiple icons to the library
    library.addIcons(faHome, faBalanceScale, faUserFriends, faUserTie, faBell, faCog, faInfoCircle, faSignOutAlt, faArrowRight, faArrowDown, faArrowLeft, faCheck, faChevronUp, faCopy, faPlus, faPen, faTimes);
  }
}
