import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';
import { TransactionComponent } from './helpers/transaction/transaction.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TransactionsComponent, TransactionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TransactionsComponent,
      }
    ]),
    FontAwesomeModule,
    NgbTooltipModule
  ]
})
export class TransactionsModule { }
