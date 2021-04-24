import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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

	tradeTypes = ['BTC', 'USDT'];
	transactions: any[] = [];
	posts: any[] = [];
	transfers: any[] = [];
	clients: Client[] = [];
	stores: Store[] = [];
	entities: any[] = [];

	transferForm!: FormGroup;
	btcForm!: FormGroup;
	otherForm!: FormGroup;

	makingBtc = false;
	makingUsdt = false;
	makingTransfer = false;

	totalMinusFee = 0;
	totalProfit = 0;
	remainingTotalMinusFee = 0;
	grandTotalMinusFee = 0;

	remaining: number = 0;

	tradeType = 'BTC';
	defaultConversionFee = 0;

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
		this.initBtcForm();
		this.initOtherForm();
		this.initTransferForm();
		this.getTransactionDetails();
		this.clients = await this.transactionsService.getClients();
		this.stores = await this.transactionsService.getStores();
		this.entities = [...this.stores, ...this.clients];
		this.chRef.detectChanges();
	}

	getTransactionDetails() {
		this.transactionsService.getCryptoTransactionById(this.transactionId).subscribe(
			(res: any) => {
				this.transaction = res.data.transactionById;
				// console.log(this.transaction);
				this.defaultConversionFee = this.transaction.default_fee || 0;
				this.btcForm.get('conversion_fee')?.setValue(this.defaultConversionFee);
				this.otherForm.get('conversion_fee')?.setValue(this.defaultConversionFee);

				this.posts = this.transaction.posts.filter((p) => p.type !== 'fee');
				for (const post of this.posts) {
					this.totalMinusFee += post.ammount;
					this.totalProfit += post.service_fee - post.conversion_fee;
				}

				this.getTransfers();

				this.dtTrigger.next();
				this.chRef.detectChanges();
			},
			(e) => {
				console.error(e);
			}
		);
	}

	make(tradeType: string) {
		if (tradeType === 'BTC') {
			this.initBtcForm();
		} else {
			this.initOtherForm();
		}
		this.tradeType = tradeType;
		this.chRef.detectChanges();
	}

	makeBtc() {
		if (this.btcForm.invalid) {
			this.msg.error('Invalid inputs, cannot perform sale', 'Error!');
			this.btcForm.markAllAsTouched();
			return;
		}

		let req = JSON.parse(JSON.stringify(this.btcForm.value));
		req.conversion_fee = (req.conversion_fee / 100) * req.total_bought;
		req.service_fee = (req.service_fee / 100) * req.total_bought;

		this.makingBtc = true;
		console.log(req);
		this.transactionsService.makeCryptoSale(req).subscribe(
			(res: any) => {
				console.log(res);
				this.makingBtc = false;
				if (res.data.makeCryptoSale) {
					window.location.reload();
				} else {
					console.error(res);
					this.msg.error('Could not make sale', 'Error!');
					this.makingBtc = false;
				}
			},
			(e) => {
				console.error(e);
				this.msg.error('Could not make sale', 'Error!');
				this.makingBtc = false;
			}
		);
	}

	makeUsdt() {
		if (this.otherForm.invalid) {
			this.msg.error('Invalid inputs, cannot perform sale', 'Error!');
			this.otherForm.markAllAsTouched();
			return;
		}

		let req = JSON.parse(JSON.stringify(this.otherForm.value));
		req.conversion_fee = (req.conversion_fee / 100) * req.total_bought;
		req.service_fee = (req.service_fee / 100) * req.total_bought;

		this.makingBtc = true;
		this.transactionsService.makeCryptoSale(req).subscribe(
			(res: any) => {
				console.log(res);
				this.makingBtc = false;
				if (res.data.makeCryptoSale) {
					window.location.reload();
				} else {
					console.error(res);
					this.msg.error('Could not make sale', 'Error!');
					this.makingBtc = false;
				}
			},
			(e) => {
				console.error(e);
				this.msg.error('Could not make sale', 'Error!');
				this.makingBtc = false;
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
				this.makingTransfer = false;
				this.getTransfers()
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
			amount: ['', [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			fee: ['', [Validators.pattern(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			date: [new Date().toISOString()],
		});
	}

	initBtcForm() {
		this.btcForm = this.fb.group({
			from_account: ['BTC'],
			transaction: [this.transactionId, [Validators.required]],
			crypto_ammount: [null, [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			price_current: [null, [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			total_bought: [0, [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			ammount_sold: [0, [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			conversion_fee: [
				this.defaultConversionFee,
				[Validators.required, Validators.pattern(/[+-]?\d+\.?\d*/), Validators.max(100)],
			],
			service_fee: [
				0,
				[Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/), Validators.max(100)],
			],
			client: [null, []],
			date: [new Date(), [Validators.required]],
			description: ['BTC'],
		});

		this.btcForm.get('crypto_ammount')?.valueChanges.subscribe((res) => {
			if (typeof +res === 'number' && typeof +this.btcForm.get('price_current')?.value === 'number') {
				this.btcForm.get('total_bought')?.setValue(+res * +this.btcForm.get('price_current')?.value);
			}
		});

		this.btcForm.get('price_current')?.valueChanges.subscribe((res) => {
			if (typeof +res === 'number' && typeof +this.btcForm.get('crypto_ammount')?.value === 'number') {
				this.btcForm.get('total_bought')?.setValue(+res * +this.btcForm.get('crypto_ammount')?.value);
			}
		});

		this.btcForm.get('service_fee')?.valueChanges.subscribe((res) => {
			if (typeof res === 'number' && typeof this.btcForm.get('total_bought')?.value === 'number') {
				this.btcForm
					.get('ammount_sold')
					?.setValue(
						+this.btcForm.get('total_bought')?.value - (+res / 100) * +this.btcForm.get('total_bought')?.value
					);
			}
		});
	}

	initOtherForm() {
		this.otherForm = this.fb.group({
			from_account: [''],
			transaction: [this.transactionId, [Validators.required]],
			crypto_ammount: [null, [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			price_current: [1, [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			total_bought: [0, [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			ammount_sold: [0, [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			conversion_fee: [
				this.defaultConversionFee,
				[Validators.required, Validators.pattern(/[+-]?\d+\.?\d*/), Validators.max(100)],
			],
			service_fee: [
				0,
				[Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/), Validators.max(100)],
			],
			client: [null, []],
			date: [new Date(), [Validators.required]],
			description: ['Other', [Validators.required]],
		});

		this.otherForm.get('crypto_ammount')?.valueChanges.subscribe((res) => {
			if (typeof +res === 'number' && typeof +this.otherForm.get('price_current')?.value === 'number') {
				this.otherForm.get('total_bought')?.setValue(+res);
			}
		});

		this.otherForm.get('service_fee')?.valueChanges.subscribe((res) => {
			if (typeof res === 'number' && typeof this.otherForm.get('total_bought')?.value === 'number') {
				this.otherForm
					.get('ammount_sold')
					?.setValue(
						+this.otherForm.get('total_bought')?.value - (+res / 100) * +this.otherForm.get('total_bought')?.value
					);
			}
		});
	}

	getTransfers() {
		this.transactionsService.getCryptoTransfers(this.transactionId).subscribe(
			(res: any) => {
				console.log(res);
				this.transfers = JSON.parse(JSON.stringify(res.data.Me.stores[0].transactions));
				this.transfers = this.transfers.reverse();

				this.remaining = this.totalMinusFee;

				for (let i = 0; i < this.transfers.length; i++) {
					this.remaining -= this.transfers[i].amount_in;
				}

				this.initTransferForm()
				this.chRef.detectChanges();
			},
			(e) => {
				console.error(e);
			}
		);
	}

	trackByFunction(index: number, item: any) {
		return item._id
	}
	get btrade() {
		return this.btcForm.controls;
	}
	get otrade() {
		return this.otherForm.controls;
	}
	get t() {
		return this.transferForm.controls;
	}
	ngOnDestroy() {
		this.chRef.detach();
	}
}