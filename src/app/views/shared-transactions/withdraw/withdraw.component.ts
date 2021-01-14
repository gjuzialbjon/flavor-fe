import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawComponent implements OnInit {
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
