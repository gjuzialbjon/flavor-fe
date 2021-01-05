import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { NbTabsetModule, NbButtonModule, NbIconModule, NbCardModule, NbPopoverModule, NbRouteTabsetModule } from '@nebular/theme';
import { DashboardStoreComponent } from './dashboard-store/dashboard-store.component';
import { DataTablesModule } from 'angular-datatables';



@NgModule({
  declarations: [DashboardComponent, DashboardStoreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full',
        data:{
          breadcrumb: 'Dashboard'
        }
      },
    ]),
    NbTabsetModule,
    NbRouteTabsetModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
    NbPopoverModule,
    DataTablesModule,
  ]
})
export class DashboardModule { }
