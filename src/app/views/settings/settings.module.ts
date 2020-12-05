import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrenciesComponent } from './currencies/currencies.component';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersComponent } from './users/users.component';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [CurrenciesComponent, SettingsComponent, UsersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent,
        children:[
          {
            path: 'currencies',
            component: CurrenciesComponent
          },
          {
            path: 'users',
            component: UsersComponent
          },
          {
            path: '',
            redirectTo:'users',
            pathMatch: 'full'
          }
        ]
      },
    ]),
    NgbNavModule,
    DataTablesModule,
    FontAwesomeModule
  ]
})
export class SettingsModule { }
