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
} from '@nebular/theme';

@NgModule({
  declarations: [
    TransferComponent,
    DepositComponent,
    WithdrawComponent,
    LoanComponent,
    TradeComponent,
  ],
  imports: [
    CommonModule,
    NbFormFieldModule,
    NbIconModule,
    NbButtonModule,
    NbDatepickerModule,
    NbInputModule,
    NbSelectModule,
  ],
  exports: [
    TransferComponent,
    DepositComponent,
    WithdrawComponent,
    LoanComponent,
    TradeComponent,
  ],
})
export class SharedTransactionsModule {}
