import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTransactionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
