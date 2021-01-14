import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferComponent implements OnInit {
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
