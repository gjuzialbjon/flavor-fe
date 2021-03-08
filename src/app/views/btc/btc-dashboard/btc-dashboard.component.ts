import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env';
import { Subject } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Client } from 'src/app/core/models/client';
import { Store } from 'src/app/core/models/store';
import { Transaction } from 'src/app/core/models/transaction';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { isNumber } from 'util';

@Component({
  selector: 'app-btc-dashboard',
  templateUrl: './btc-dashboard.component.html',
  styleUrls: ['./btc-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtcDashboardComponent implements OnInit {
  transactionId: any;
  transaction!: Transaction;
  loadingTransactions = false;
  dtOptions: DataTables.Settings;
  dtOptions2: DataTables.Settings;
  dtTrigger = new Subject<any>();

  transactions: any[] = [];
  posts: any[] = [];
  transfers: any[] = [];
  clients: Client[] = [];
  stores: Store[] = [];
  entities: any[] = [];

  transferForm!: FormGroup;
  tradeForm!: FormGroup;

  makingTrade = false;
  makingTransfer = false;

  totalMinusFee = 0;
  totalProfit = 0;
  remainingTotalMinusFee = 0;
  grandTotalMinusFee = 0;

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private transactionsService: TransactionsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private msg: MessageService
  ) {
    this.transactionId = this.route.snapshot.params.id;
    this.dtOptions = this.configsService.getBTCDTOptions();
    this.dtOptions2 = this.configsService.getBTCDTOptions();

    this.dtOptions.columnDefs = [
      // @ts-ignore
      { responsivePriority: 100, targets: [0, 8] },
    ];
    this.dtOptions2.columnDefs = [
      // @ts-ignore
      { responsivePriority: 100, targets: [0, 3] },
    ];
  }

  async ngOnInit() {
    this.initTradeForm();
    this.initTransferForm();
    this.getTransactionDetails();
    this.clients = await this.transactionsService.getClients();
    this.stores = await this.transactionsService.getStores();
  }

  getTransactionDetails() {
    this.transactionsService
      .getCryptoTransactionById(this.transactionId)
      .subscribe(
        (res: any) => {
          this.transaction = res.data.transactionById;
          console.log(this.transaction);

          this.posts = this.transaction.posts.filter((p) => p.type !== 'fee');
          for (const post of this.posts) {
            this.totalMinusFee += post.ammount;
            this.totalProfit += post.total_bought - post.ammount;
          }

          this.transactionsService.getCryptoTransfers(this.transactionId).subscribe(
            (res: any) => {
              console.log(res);
              this.transfers = JSON.parse(
                JSON.stringify(res.data.Me.stores[0].transactions)
              );
              this.transfers = this.transfers.reverse();

              for (let i = 0; i < this.transfers.length; i++) {
                if (i === 0) {
                  this.transfers[i].total = this.totalMinusFee;
                } else {
                  this.transfers[i].total =
                    this.transfers[i - 1].total -
                    this.transfers[i - 1].amount_in;
                }
              }
              this.chRef.detectChanges();
            },
            (e) => {
              console.error(e);
            }
          );

          this.dtTrigger.next();
          this.chRef.detectChanges();
        },
        (e) => {
          console.error(e);
        }
      );
  }

  makeTrade() {
    if (this.tradeForm.invalid) {
      this.msg.error('Invalid inputs, cannot perform sale', 'Error!');
      this.tradeForm.markAllAsTouched();
      return;
    }

    this.makingTrade = true;
    this.transactionsService.makeCryptoSale(this.tradeForm.value).subscribe(
      (res: any) => {
        // console.log(res);
        this.makingTrade = false;
        if (res.data.makeCryptoSale) {
          window.location.reload();
        } else {
          console.error(res);
          this.msg.error('Could not make sale', 'Error!');
          this.makingTrade = false;
        }
      },
      (e) => {
        console.error(e);
        this.msg.error('Could not make sale', 'Error!');
        this.makingTrade = false;
      }
    );
  }

  makeTransfer() {
    if (this.transferForm.invalid) {
      this.msg.error('Invalid inputs, cannot perform transfer', 'Error!');
      this.transferForm.markAllAsTouched();
      return;
    }

    this.makingTransfer = true;
    this.transactionsService.makeTransfer(this.transferForm.value).subscribe(
      (res: any) => {
        console.log(res);
        this.makingTransfer = false;
        window.location.reload();
      },
      (e) => {
        console.error(e);
        this.makingTransfer = false;
        this.msg.error('Could not perform transfer', 'Error');
      }
    );
  }

  initTransferForm() {
    this.transferForm = this.fb.group({
      transfer_origin: [this.transactionId, []],
      fromStore: [environment.btc_store_id, [Validators.required]],
      toEntity: [null, [Validators.required]],
      description: ['', [Validators.required]],
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/),
        ],
      ],
      fee: ['', [Validators.pattern(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
      date: [new Date().toISOString()],
    });
  }

  initTradeForm() {
    this.tradeForm = this.fb.group({
      transaction: [this.transactionId, [Validators.required]],
      crypto_ammount: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/),
        ],
      ],
      price_current: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/),
        ],
      ],
      total_bought: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/),
        ],
      ],
      ammount_sold: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/),
        ],
      ],
      fee: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/),
        ],
      ],
      description: [null, [Validators.required]],
      client: [null, []],
      from_account: [null, [Validators.required]],
      date: [null, [Validators.required]],
    });

    this.tradeForm.get('crypto_ammount')?.valueChanges.subscribe((res) => {
      if (
        typeof +res === 'number' &&
        typeof +this.tradeForm.get('price_current')?.value === 'number'
      ) {
        this.tradeForm
          .get('total_bought')
          ?.setValue(+res * +this.tradeForm.get('price_current')?.value);
      }
    });

    this.tradeForm.get('price_current')?.valueChanges.subscribe((res) => {
      if (
        typeof +res === 'number' &&
        typeof +this.tradeForm.get('crypto_ammount')?.value === 'number'
      ) {
        this.tradeForm
          .get('total_bought')
          ?.setValue(+res * +this.tradeForm.get('crypto_ammount')?.value);
      }
    });

    this.tradeForm.get('fee')?.valueChanges.subscribe((res) => {
      if (
        typeof +res === 'number' &&
        typeof +this.tradeForm.get('total_bought')?.value === 'number'
      ) {
        this.tradeForm
          .get('ammount_sold')
          ?.setValue(
            +this.tradeForm.get('total_bought')?.value -
              (+res / 100) * +this.tradeForm.get('total_bought')?.value
          );
      }
    });
  }

  get trade() {
    return this.tradeForm.controls;
  }
  get t() {
    return this.transferForm.controls;
  }

  ngOnDestroy() {
    this.chRef.detach();
  }
}
