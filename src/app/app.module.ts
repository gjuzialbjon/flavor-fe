import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderComponent } from './theme/header/header.component'
import { BaseComponent } from './theme/base/base.component'
import { HttpClientModule } from '@angular/common/http'
import { GraphQLModule } from './graphql.module'
import { NgModule } from '@angular/core'
import { SidebarComponent } from './theme/sidebar/sidebar.component'
import {
	NbButtonModule,
	NbContextMenuModule,
	NbDatepickerModule,
	NbDialogModule,
	NbFormFieldModule,
	NbGlobalPhysicalPosition,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbMenuModule,
	NbSearchModule,
	NbSelectModule,
	NbSidebarModule,
	NbThemeModule,
	NbToastrModule,
} from '@nebular/theme'
import { LoadingBarRouterModule } from '@ngx-loading-bar/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { environment } from '@env'

@NgModule({
	declarations: [AppComponent, HeaderComponent, BaseComponent, SidebarComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		GraphQLModule,
		LoadingBarRouterModule,
		NbThemeModule.forRoot({ name: environment.theme }),
		NbLayoutModule,
		NbSidebarModule.forRoot(), // NbSidebarModule.forRoot(), //if this is your app.module
		NbMenuModule.forRoot(),
		NbDialogModule.forRoot(),
		NbContextMenuModule,
		NbToastrModule.forRoot({
			limit: 3,
			preventDuplicates: true,
			position: NbGlobalPhysicalPosition.TOP_LEFT,
			toastClass: 'toastr-class',
		}),
		NbDatepickerModule.forRoot(),
		NbIconModule,
		NbSelectModule,
		NbButtonModule,
		NbSearchModule,
		NbInputModule,
		NbFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor() {}
}
