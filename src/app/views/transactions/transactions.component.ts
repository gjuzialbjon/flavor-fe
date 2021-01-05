import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsComponent implements OnInit {
  transactions = [
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description',
      issued: true
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'pending',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description',
      issued: true
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'pending',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }
  
}
