import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Store } from 'src/app/core/models/store';
import { Transaction } from 'src/app/core/models/transaction';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-dashboard',
  templateUrl: './store-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDashboardComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective) transactionsTable!: DataTableDirective;
  dtOptions: DataTables.Settings;
  dtTrigger = new Subject<any>();

  transactions: Transaction[] = [];
  tableTransactions: Transaction[] = [];

  balances = [
    {
      name: 'EURO',
      amount: 32433,
      symbol: 'EUR'
    },
    {
      name: 'DOLLAR',
      amount: 5433,
      symbol: 'USD'
    }
  ];

  private subscriptions = new Subscription();
  storeId: string;
  store!: Store;
  loading = false;

  loadingTransactions = true;


  makingTransaction = false;
  transactionType = '';
  transactionTypes;

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storeService: StoreService,
    private msg: MessageService,
    private dialogService: NbDialogService,
    private router: Router
  ) {
    this.storeId = this.route.snapshot.params.storeId;
    this.transactionTypes = this.configsService.getTransactionTypes();
    this.dtOptions = this.configsService.getDTOptions();
    this.dtOptions.columnDefs = [
      // @ts-ignore
      // { responsivePriority: 100, targets: [1,9] },
    ];
  }

  ngOnInit(): void {
    this.getStoreInfo();
    this.getStoreTransactions();
  }

  getStoreTransactions() {
    this.storeService.getStoreTransactions(this.storeId).subscribe(
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

  getStoreInfo() {
    this.storeService.getStoreById(this.storeId).subscribe(
      (res: any) => {
        this.store = res.data.storeById as Store;
        console.log(this.store);
        this.chRef.detectChanges();
      },
      (e) => {
        console.error(e);
        this.msg.defaultError();
      }
    );
  }

  make(transactionType: string) {
    this.makingTransaction = true;
    this.transactionType = transactionType;
    console.log(this.storeId);
    this.chRef.detectChanges();
  }

  rerenderTransactions(transaction?: Transaction): void {
    this.transactionsTable.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();

      if(transaction){
        this.transactions.push(transaction)
        this.loadingTransactions = false
      }

      this.tableTransactions = JSON.parse(JSON.stringify(this.transactions))
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

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.chRef.detach();
  }
}
