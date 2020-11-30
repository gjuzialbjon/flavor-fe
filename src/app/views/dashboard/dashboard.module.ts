import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreditCardComponent } from './helpers/credit-card/credit-card.component';

@NgModule({
  declarations: [DashboardComponent, CreditCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
      }
    ]),
    FontAwesomeModule
  ]
})
export class DashboardModule { }
