import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Transaction } from 'src/app/core/models/transaction';
import { TransactionsService } from 'src/app/core/services/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsComponent implements OnInit {
  @ViewChild(DataTableDirective) transactionsTable!: DataTableDirective;

  transactions: Transaction[] = []
  transaction!: Transaction

  loadingTransactions = true

  makingTransaction = false;
  transactionType = '';
  transactionTypes

  dtOptions 
  dtTrigger = new Subject<any>(); 

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private dialogService: NbDialogService,
    private transactionsService: TransactionsService,
    private msg: MessageService
  ) {
    this.transactionTypes = this.configsService.getTransactionTypes()
    this.dtOptions = this.configsService.getDTOptions()
  }

  ngOnInit(): void {
    this.getTransactions()
  }

  getTransactions(){
    this.transactionsService.getTransactions().subscribe(
      (res: any) => {
        console.log(res)
        this.transactions = JSON.parse(JSON.stringify(res.data.transactionMany)) as Transaction[]
        this.loadingTransactions = false
        this.dtTrigger.next()
        this.chRef.detectChanges()
      },
      e => {
        console.error(e)
        this.msg.defaultError()
      }
    )
  }

  openEditTransaction(content: TemplateRef<any>, transaction: Transaction){
    this.transaction = transaction
    this.dialogService.open(content)
  }

  make(transactionType: string){
    this.makingTransaction = true
    this.transactionType = transactionType
    this.chRef.detectChanges()
  }

  rerenderTransactions(): void {
    this.transactionsTable.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first 
        dtInstance.destroy();

        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
    });
    this.chRef.detectChanges()
  }

  cancelTransaction(){
    this.makingTransaction = false
    this.transactionType = ''
    this.chRef.detectChanges()
  }
}
