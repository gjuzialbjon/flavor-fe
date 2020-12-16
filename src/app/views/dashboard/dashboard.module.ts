import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { NbTabsetModule, NbButtonModule, NbIconModule, NbCardModule } from '@nebular/theme';
import { DashboardStoreComponent } from './dashboard-store/dashboard-store.component';



@NgModule({
  declarations: [DashboardComponent, DashboardStoreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
      },
    ]),
    NbTabsetModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
  ]
})
export class DashboardModule { }
