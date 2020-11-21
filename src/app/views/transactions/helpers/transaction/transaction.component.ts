import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionComponent implements OnInit {
  @Input() paid = false

  constructor() { }

  ngOnInit(): void {
  }


}
