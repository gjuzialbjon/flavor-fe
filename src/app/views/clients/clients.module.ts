import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients/clients.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbButtonModule, NbFormFieldModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbDialogModule, NbDatepickerModule } from '@nebular/theme';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { SharedTransactionsModule } from '../shared-transactions/shared-transactions.module';

@NgModule({
  declarations: [ClientsComponent, ClientDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ClientsComponent,
        pathMatch: 'full',
        data:{
          roles: ['admin', 'agent']
        }
      },
      {
        path: ':clientId',
        component: ClientDashboardComponent,
        data:{
          roles: ['admin', 'agent']
        }
      }
    ]),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgSelectModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbDialogModule.forChild({
      dialogClass: 'dialog-width'
    }),
    NbFormFieldModule,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
    NbDatepickerModule,
    NgbDropdownModule,
    SharedTransactionsModule
  ]
})
export class ClientsModule { }
