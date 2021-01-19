import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Transaction } from 'src/app/core/models/transaction';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { ClientsService } from 'src/app/core/services/clients.service';
import { Client } from 'src/app/core/models/client';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDashboardComponent implements OnInit {
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

  clientId: string;
  client!: Client;
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
    private clientsService: ClientsService,
    private msg: MessageService,
    private dialogService: NbDialogService,
    private router: Router
  ) {
    this.clientId = this.route.snapshot.params.clientId;
    console.log(this.clientId)
    this.transactionTypes = this.configsService.getTransactionTypes();
    this.dtOptions = this.configsService.getDTOptions();
    this.dtOptions.columnDefs = [
      // @ts-ignore
      // { responsivePriority: 100, targets: [1,9] },
    ];
  }

  ngOnInit(): void {
    this.getClientInfo();
    this.getClientTransactions();
  }

  getClientTransactions() {
    this.clientsService.getClientTransactions(this.clientId).subscribe(
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

  getClientInfo() {
    this.clientsService.getClientById(this.clientId).subscribe(
      (res: any) => {
        this.client = res.data.clientById as Client;
        console.log(this.client);
        this.chRef.detectChanges();
      },
      (e: any) => {
        console.error(e);
        this.msg.defaultError();
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
