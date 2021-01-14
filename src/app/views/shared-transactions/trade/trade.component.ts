import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeComponent implements OnInit {
  @Output() onTransactionCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onTransactionLock: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  lockTransactions(){
    this.onTransactionLock.emit(true)
  }

  cancelTransaction(){
    this.onTransactionCancel.emit(true)
  }
}
