import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanComponent implements OnInit {
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
