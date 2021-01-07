import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrenciesComponent } from './currencies/currencies.component';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { UsersComponent } from './users/users.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbFormFieldModule, NbIconModule, NbInputModule, NbOptionModule, NbRouteTabsetModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';

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
