import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './theme/header/header.component';
import { BaseComponent } from './theme/base/base.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { faArrowRight, faBell, faCog, faCopy, faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { NotificationsComponent } from './theme/notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BaseComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add multiple icons to the library
    library.addIcons(faHome, faBell, faCog, faSignOutAlt, faArrowRight, faCopy);
  }
}
