import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { Transaction } from 'src/app/core/models/transaction';

@Component({
  selector: 'app-dashboard-store',
  templateUrl: './dashboard-store.component.html',
  styleUrls: ['./dashboard-store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardStoreComponent implements OnInit {
  @Input() storeId = ''

  dtOptions: DataTables.Settings 
  transactions = [
    {
      date : "223432423",
      name: "Njashtu",
      type: "kHUS ASHtu",
      amount: 2213123,
      status: "pergjys",
      flagged: true
    },
    {
      date : "223432423",
      name: "Njashtu",
      type: "kHUS ASHtu",
      amount: 2213123,
      status: "pergjys"
    },
    {
      date : "223432423",
      name: "Njashtu",
      type: "kHUS ASHtu",
      amount: 2213123,
      status: "pergjys"
    },
    {
      date : "223432423",
      name: "Njashtu",
      type: "kHUS ASHtu",
      amount: 2213123,
      status: "pergjys"
    },
    {
      date : "223432423",
      name: "Njashtu",
      type: "kHUS ASHtu",
      amount: 2213123,
      status: "pergjys"
    }
  ]

  transaction: any

  constructor(
    private configsService: ConfigsService,

  ) { 
    this.dtOptions = this.configsService.getDTOptions()
  }

  ngOnInit(): void {
    console.log(this.storeId, ' store id')
    
  }

  markForWarning(transaction: any){
    console.log(transaction)
    this.transaction = transaction
    this.transaction.flagged = true
  }

  markForFixed(transaction: any){
    console.log(transaction)
    this.transaction = transaction
    this.transaction.flagged = false
  }

}
