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
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { truncate } from 'fs';
import { Subject, Subscription } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Store } from 'src/app/core/models/store';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-dashboard',
  templateUrl: './store-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDashboardComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  @Input() name: string = '';
  @Input() balance: number = 0;
  @Input() profit: number = 0;
  @Input() percentage: number = 0;
  @Input() id: string = '';

  transactions = [
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      currency: 'USD',
      status: 'completed',
      description: 'Short description',
      issued: true,
      comment: 'This is the error comment',
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      currency: 'USD',
      credit: 2000,
      debit: 4444,
      status: 'pending',
      description: 'Short description',
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      currency: 'USD',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description',
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      currency: 'EUR',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description',
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      currency: 'EUR',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description',
      issued: true,
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      currency: 'EUR',
      credit: 2000,
      debit: 4444,
      status: 'pending',
      description: 'Short description',
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      currency: 'EUR',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description',
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      currency: 'EUR',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description',
    },
  ];

  balances = [
    {
      name: 'Euro',
      currency: 'EUR',
      amount: 2134324,
    },
    {
      name: 'Dollar',
      currency: 'USD',
      amount: 2134,
    },
    {
      name: 'All',
      currency: 'L',
      amount: 434,
    },
    {
      name: 'Bitcoin',
      currency: '₿',
      amount: 5434,
    },
  ];

  dtOptions: DataTables.Settings 
  dtTrigger = new Subject<any>();

  private subscriptions = new Subscription();
  storeId: string;
  store!: Store;
  modalConfig;

  makingTransaction = false;
  transactionType = 'transfer';
  transactionTypes = [
    'transfer',
    'purchase',
    'trade',
    'loan',
    'withdraw',
    'deposit',
    'sell',
    'fee',
  ];

  constructor(
    private configsService: ConfigsService,
    private modalService: NgbModal,
    private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storeService: StoreService,
    private msg: MessageService,
    private router: Router
  ) {
    this.storeId = this.route.snapshot.params.id;
    this.dtOptions = this.configsService.getDTOptions()
    this.dtOptions.columnDefs = [
      // @ts-ignore
      { responsivePriority: 100, targets: [1,9] },
    ]
    this.modalConfig = this.configsService.getCleanModalOptions();
  }

  ngOnInit(): void {
    this.getStoreInfo();
    this.dtTrigger.next(true)
    // this.initNewClientForm()
  }

  getStoreInfo() {
      this.storeService.getStoreById(this.storeId).subscribe(
        (res: any) => {
          this.store = res.data.storeById as Store;
          console.log(this.store);
          // if(!this.store){
          //   this.msg.error('Something went wrong loading the store.')
          //   setTimeout(() => {
          //     this.router.navigate(['/stores'])
          //   },2000)
          // }
          this.chRef.detectChanges();
        },
        (e) => {
          console.error(e);
          this.msg.defaultError();
        }
      )
  }

  toggleTransaction() {
    this.makingTransaction = !this.makingTransaction;
    this.chRef.detectChanges();
  }

  cancelTransaction() {
    this.makingTransaction = false;
    this.transactionType = 'transfer';
    this.chRef.detectChanges();
  }

  select(type: string) {
    this.transactionType = type;
    console.log('Selecting ', this.transactionType);
    this.removeActiveClassFromActiveTransferType();

    document.getElementById(type)?.classList.add('active');
  }

  removeActiveClassFromActiveTransferType() {
    for (const type of this.transactionTypes) {
      document.getElementById(type)?.classList.remove('active');
    }
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe()
    this.chRef.detach();
  }
}
