import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Transaction } from 'src/app/core/models/transaction';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { ClientsService } from 'src/app/core/services/clients.service';
import { Client } from 'src/app/core/models/client';
import { TransactionsService } from 'src/app/core/services/transactions.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDashboardComponent implements OnInit {
  @ViewChild(DataTableDirective) postsTable!: DataTableDirective;
  dtOptions: DataTables.Settings;
  dtTrigger = new Subject<any>();

  posts: any[] = []
  clientId: string;
  client!: Client;
  loading = false;

  loadingTransactions = true;

  transactionType = '';
  transactionTypes;

  vendorTypeFormControl = new FormControl('', [Validators.required]);

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private msg: MessageService,
    private dialogService: NbDialogService,
    private router: Router,
    private transactionsService: TransactionsService
  ) {
    this.clientId = this.route.snapshot.params.clientId;
    this.transactionTypes = this.configsService.getTransactionTypes();
    this.dtOptions = this.configsService.getDTOptions();
    this.dtOptions.columnDefs = [
      // @ts-ignore
      // { responsivePriority: 100, targets: [1,9] },
    ];
  }

  ngOnInit(): void {
    this.getClientInfo();
    this.getClientCryptoPosts();
  }

  getClientInfo() {
    this.clientsService.getClientById(this.clientId).subscribe(
      (res: any) => {
        this.client = res.data.clientById as Client;
        // console.log(this.client);
        this.chRef.detectChanges();
      },
      (e: any) => {
        console.error(e);
        this.msg.defaultError();
      }
    );
  }

  getClientCryptoPosts(){
    this.transactionsService.getClientCryptoPosts(this.clientId).subscribe(
      (res: any) => {
        this.posts = res.data.clientMany[0].crypto_posts
        console.log(this.posts);
        this.dtTrigger.next()
        this.chRef.detectChanges();
      },
      (e: any) => {
        console.error(e);
        this.msg.defaultError();
      }
    );
  }

  openMakeVendor(vendorContent: any) {
    this.vendorTypeFormControl.setValue('');
    this.dialogService.open(vendorContent);
  }

  makeVendor(dialog: any) {
    if (this.vendorTypeFormControl.invalid) {
      this.msg.error('Please set a vendor type', 'Error!');
      return;
    }

    this.clientsService
      .makeVendor(this.clientId, this.vendorTypeFormControl.value)
      .subscribe(
        (res: any) => {
          console.log(res);
          let nClient = res.data.clientUpdateById.record;
          this.client.isVendor = nClient.isVendor;
          this.client.vendorType = nClient.vendorType;
          this.chRef.detectChanges();
          dialog.close();
        },
        (e) => {
          this.msg.error('Sorry, something went wrong', 'Error!');
        }
      );
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.chRef.detach();
  }
}
