import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit {
  @ViewChild(DataTableDirective) transactionsTable!: DataTableDirective;

  storeFormControl = new FormControl('all')
  typeFormControl = new FormControl('all')
  periodFormControl = new FormControl('all')


  transactions: Transaction[] = [];
  transaction!: Transaction;
  
  stores: any[] = []

  loadingTransactions = true;

  makingTransaction = true;
  transactionType = 'deposit';
  transactionTypes: any[] = [];

  dtOptions;
  dialogDtOptions
  dtTrigger = new Subject<any>();

  commentFormControl = new FormControl('', [Validators.required]);

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private dialogService: NbDialogService,
    private transactionsService: TransactionsService,
    private msg: MessageService
  ) {
    this.transactionTypes = this.configsService.getTransactionTypes();
    this.dtOptions = this.configsService.getDTOptions();
    this.dialogDtOptions = this.configsService.getDTOptions()
  }

  async ngOnInit() {
    this.getTransactions();

    this.stores = await this.transactionsService.getStores()
  }

  getTransactions() {
    this.transactionsService.getTransactions().subscribe(
      (res: any) => {
        console.log(res);
        this.transactions = JSON.parse(
          JSON.stringify(res.data.transactionMany)
        ) as Transaction[];
        this.loadingTransactions = false;
        this.dtTrigger.next();
        this.chRef.detectChanges();
      },
      (e) => {
        console.error(e);
        this.msg.defaultError();
      }
    );
  }

  openEditTransaction(content: TemplateRef<any>, transaction: Transaction) {
    this.transaction = transaction;
    this.commentFormControl.setValue('');
    this.dialogService.open(content);
  }

  changedFilters(){
    console.log(this.storeFormControl.value)
  }

  changedPeriod(){
    console.log(this.periodFormControl.value)
  }

  addComment(issue: string) {
    if (this.commentFormControl.invalid) {
      this.msg.warning('Enter a comment before', 'Error');
      return;
    }

    this.transactionsService
      .addComment(this.transaction._id, this.commentFormControl.value, issue)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.transaction.comments.push(res.data.commentCreateOne.record);
          this.commentFormControl.setValue('');
          this.chRef.detectChanges();
        },
        (e) => {
          console.error(e);
          this.msg.error('Sorry, we could not add your comment', 'Error');
        }
      );
  }

  make(transactionType: string) {
    this.makingTransaction = true;
    this.transactionType = transactionType;
    this.chRef.detectChanges();
  }

  rerenderTransactions(): void {
    this.transactionsTable.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
    this.chRef.detectChanges();
  }

  cancelTransaction() {
    this.makingTransaction = false;
    this.transactionType = '';
    this.chRef.detectChanges();
  }

  checkForFlag(comments: any[]){
    for (const comment of comments) {
      if(comment.issue === 'Open'){
        return true
      }
    }

    return false
  }
}
