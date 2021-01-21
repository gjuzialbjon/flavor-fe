import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferComponent } from './transfer/transfer.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { LoanComponent } from './loan/loan.component';
import { TradeComponent } from './trade/trade.component';
import {
  NbFormFieldModule,
  NbIconModule,
  NbButtonModule,
  NbDatepickerModule,
  NbInputModule,
  NbSelectModule,
  NbDialogModule,
  NbSpinnerModule,
  NbCardModule,
} from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    TransferComponent,
    DepositComponent,
    WithdrawComponent,
    LoanComponent,
    TradeComponent,
    TransactionsTableComponent,
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbButtonModule,
    NbDatepickerModule,
    NbInputModule,
    NbSelectModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbDropdownModule,
    NbSpinnerModule,
    NbDialogModule.forChild({
      dialogClass: 'dialog-width'
    }),
  ],
  exports: [
    TransferComponent,
    DepositComponent,
    WithdrawComponent,
    LoanComponent,
    TradeComponent,
    TransactionsTableComponent
  ],
})
export class SharedTransactionsModule {}
