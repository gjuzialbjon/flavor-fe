import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReportsComponent,
        pathMatch: 'full'
      },
    ])
  ]
})
export class ReportsModule { }
