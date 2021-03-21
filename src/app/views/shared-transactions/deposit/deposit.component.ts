import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	EventEmitter,
	Output,
	Input,
	ChangeDetectorRef,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MessageService } from 'src/app/core/helper-services/message.service'
import { TransactionsService } from 'src/app/core/services/transactions.service'

@Component({
	selector: 'app-deposit',
	templateUrl: './deposit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositComponent implements OnInit {
	@Output() onTransactionLock: EventEmitter<any> = new EventEmitter<any>()
	@Output() onTransactionCreate: EventEmitter<any> = new EventEmitter<any>()

	storeId: string
	clientId: string

	stores: any[] = []
	clients: any[] = []
	currencies: any[] = []

	transactionForm!: FormGroup

	constructor(
		private chRef: ChangeDetectorRef,
		private route: ActivatedRoute,
		private transactionsService: TransactionsService,
		private fb: FormBuilder,
		private msg: MessageService
	) {
		this.storeId = this.route.snapshot.params.storeId
		this.clientId = this.route.snapshot.params.clientId
	}

	async ngOnInit() {
		this.initForm()

		this.stores = await this.transactionsService.getStores()
		this.clients = await this.transactionsService.getClients()
		this.currencies = await this.transactionsService.getCurrencies()
		this.chRef.detectChanges()
	}

	ngAfterViewInit() {
		this.chRef.detectChanges()
	}

	makeTransaction() {
		if (this.transactionForm.invalid) {
			this.msg.error('Invalid inputs, cannot make this deposit', 'Error!')
			this.transactionForm.markAllAsTouched()
			return
		}

		this.onTransactionLock.emit(true)
		this.transactionsService.makeDeposit(this.transactionForm.value).subscribe(
			(res: any) => {
				this.onTransactionCreate.emit(JSON.parse(JSON.stringify(res.data.makeDeposit)))
				this.initForm()
				this.chRef.detectChanges()
			},
			(e) => {
				console.error(e)
				this.msg.error('Sorry, its not your fault, its ours. Please contact page developers :)', 'Error!')
			}
		)
	}

	initForm() {
		this.transactionForm = this.fb.group({
			storeId: [this.storeId, [Validators.required]],
			clientId: [this.clientId, []],
			description: ['', [Validators.required]],
			amount: ['', [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			fee: ['', [Validators.pattern(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			date: [new Date().toISOString()],
			currency: [null],
		})
	}

	get t() {
		return this.transactionForm.controls
	}

	ngOnDestroy() {
		this.chRef.detach()
	}
}
