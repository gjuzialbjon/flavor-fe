import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';
import { TransactionComponent } from './helpers/transaction/transaction.component';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TransactionsComponent, TransactionComponent, NewTransactionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TransactionsComponent,
      }
    ]),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbButtonModule,
    NbDatepickerModule,
    NbInputModule,
    NbSelectModule,
    NgbDropdownModule
  ]
})
export class TransactionsModule { }
