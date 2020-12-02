import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresComponent } from './stores/stores.component';
import { RouterModule } from '@angular/router';
import { CountUpModule } from 'ngx-countup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreditCardComponent } from './dashboard/credit-card/credit-card.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [StoresComponent, DashboardComponent, CreditCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: StoresComponent,
        pathMatch: 'full'
      },
      {
        path: ':id',
        component: DashboardComponent,
      }
    ]),
    CountUpModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgSelectModule
  ]
})
export class StoresModule { }
