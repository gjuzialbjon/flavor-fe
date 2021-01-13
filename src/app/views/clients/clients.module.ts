import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients/clients.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbButtonModule, NbFormFieldModule, NbInputModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';

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
        path: ':id',
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
    NbFormFieldModule,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
  ]
})
export class ClientsModule { }
