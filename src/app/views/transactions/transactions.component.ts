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
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit {
  @ViewChild(DataTableDirective) transactionsTable!: DataTableDirective;
  dtOptions;
  dialogDtOptions;
  dtTrigger = new Subject<any>();

  storeFormControl = new FormControl('all');
  typeFormControl = new FormControl('all');
  periodFormControl = new FormControl(null);

  transactions: Transaction[] = [];
  tableTransactions: Transaction[] = [];
  transaction!: Transaction;

  stores: any[] = [];

  isAdminOrAgent = false

  loadingTransactions = true;

  makingTransaction = false;
  transactionType = '';
  transactionTypes: any[] = [];
  commentFormControl = new FormControl('', [Validators.required]);

  hasFilters = false
  typeFilter = 'all'
  storeFilter = 'all'
  periodFilter = null

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private dialogService: NbDialogService,
    private transactionsService: TransactionsService,
    private msg: MessageService,
    private authService: AuthenticationService
  ) {
    this.transactionTypes = this.configsService.getTransactionTypes();
    this.dtOptions = this.configsService.getDTOptions();
    this.dialogDtOptions = this.configsService.getDTOptions();
  }

  async ngOnInit() {
    this.isAdminOrAgent = this.authService.user.role === 'admin' || this.authService.user.role === 'agent'
    this.getTransactions();

    this.stores = await this.transactionsService.getStores();
  }

  getTransactions() {
    this.transactionsService.getTransactions().subscribe(
      (res: any) => {
        console.log(res);
        this.transactions = JSON.parse(
          JSON.stringify(res.data.transactionMany)
        ) as Transaction[];
        this.tableTransactions = JSON.parse(
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

  isIncluded(t: Transaction){
    let typePass = false
    let storePass = false
    let periodPass = false

    if(this.storeFilter === 'all'){
      storePass = true
    } else {
      storePass = t.store && t.store._id === this.storeFilter
    }
    if(this.typeFilter === 'all'){
      typePass = true
    } else {
      typePass = t.type === this.typeFilter
    }
    if(!this.periodFilter){
      periodPass = true
    } else {
      //@ts-ignore
      const startDate = this.periodFilter.start || new Date('1900-01-01')
      //@ts-ignore
      const endDate = this.periodFilter.end || new Date()

      // console.log(startDate, endDate);

      console.log(new Date(startDate).getTime())
      console.log(new Date(t.createdAt).getTime())
      console.log(new Date(endDate).getTime())

      if(new Date(startDate).getTime() <= new Date(t.createdAt).getTime() && new Date(endDate).getTime() >= new Date(t.createdAt).getTime()){
        periodPass = true
      } else {
        periodPass = false
      }
    }

    if(typePass && storePass && periodPass){
      return true
    } else {
      return false
    }
  }

  changedFilters() {
    this.typeFilter = this.typeFormControl.value
    this.storeFilter = this.storeFormControl.value
    this.periodFilter = this.periodFormControl.value
    this.hasFilters = true
    let filtered = []
    for (const transaction of this.transactions) {
      if(this.isIncluded(transaction)){
        filtered.push(transaction)
      }
    }
    this.rerenderFilteredTransactions(filtered)
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

  rerenderTransactions(transaction?: Transaction): void {
    this.transactionsTable.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();

      if(transaction){
        this.transactions.push(transaction)
        this.resetFilters()
        this.loadingTransactions = false
      }

      this.tableTransactions = JSON.parse(JSON.stringify(this.transactions))
      this.chRef.detectChanges();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
    this.chRef.detectChanges();
  }

  rerenderFilteredTransactions(transactions: Transaction[]): void {
    this.transactionsTable.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();

      this.tableTransactions = JSON.parse(JSON.stringify(transactions))
      this.chRef.detectChanges();

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

  checkForFlag(comments: any[]) {
    for (const comment of comments) {
      if (comment.issue === 'Open') {
        return true;
      }
    }

    return false;
  }

  resetFilters(){
    this.storeFormControl.setValue('all')
    this.typeFormControl.setValue('all')
    this.periodFormControl.setValue(null)
    this.hasFilters = false
    this.chRef.detectChanges()
  }

  ngOnDestroy(){
    this.chRef.detach()
  }
}
