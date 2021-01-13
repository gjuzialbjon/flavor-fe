import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbIconModule, NbSelectModule } from '@nebular/theme';



@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReportsComponent,
        pathMatch: 'full',
        data:{
          roles: ['finance']
        }
      },
    ]),
    NbSelectModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule
  ]
})
export class ReportsModule { }
