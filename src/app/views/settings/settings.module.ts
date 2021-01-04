import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrenciesComponent } from './currencies/currencies.component';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersComponent } from './users/users.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InvitesComponent } from './invites/invites.component';
import { EmailConfigComponent } from './email-config/email-config.component';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbFormFieldModule, NbIconModule, NbInputModule, NbOptionModule, NbRouteTabsetModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';

@NgModule({
  declarations: [CurrenciesComponent, SettingsComponent, UsersComponent, InvitesComponent, EmailConfigComponent],
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
            path: 'invites',
            component: InvitesComponent
          },
          {
            path: 'email-config',
            component: EmailConfigComponent
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
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NbCardModule,
    NbRouteTabsetModule,
    NbFormFieldModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbOptionModule,
    NbIconModule,
    NbCheckboxModule,
    NbSpinnerModule
  ]
})
export class SettingsModule { }
