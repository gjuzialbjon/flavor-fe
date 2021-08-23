import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MessageService } from 'src/app/core/helper-services/message.service'
import { TransactionsService } from 'src/app/core/services/transactions.service'

@Component({
	selector: 'app-transfer',
	templateUrl: './transfer.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferComponent implements OnInit {
	@Output() onTransactionLock: EventEmitter<any> = new EventEmitter<any>()
	@Output() onTransactionCreate: EventEmitter<any> = new EventEmitter<any>()

	storeId: string
	clientId: string

	stores: any[] = []
	clients: any[] = []
	entities: any[] = []

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
		this.stores = JSON.parse(JSON.stringify(this.stores))
		for (const store of this.stores) {
			store.role = 'Stores'
		}
		this.clients = await this.transactionsService.getClients()
		this.clients = JSON.parse(JSON.stringify(this.clients))
		for (const client of this.clients) {
			client.role = 'Clients'
		}
		this.entities = [...this.stores, ...this.clients]
		this.chRef.detectChanges()
	}

	ngAfterViewInit() {
		this.chRef.detectChanges()
	}

	makeTransaction() {
		if (this.transactionForm.invalid) {
			this.msg.error('Invalid inputs, cannot make this transfer', 'Error!')
			this.transactionForm.markAllAsTouched()
			return
		}

		if (this.transactionForm.get('fromStore')?.value === this.transactionForm.get('toEntity')?.value) {
			this.msg.error('Please choose another destination', 'Error!')
			return
		}

		this.onTransactionLock.emit(true)
		let isGoingToStore = false

    for (const store of this.stores) {
      if(this.transactionForm.value.toEntity === store._id){
        isGoingToStore = true
        break
      }
    }
		this.transactionsService.makeTransfer(this.transactionForm.value, isGoingToStore).subscribe(
			(res: any) => {
				console.log(res)
				let result = isGoingToStore ? res.data.makeTransferToStore : res.data.makeTransfer
				this.onTransactionCreate.emit(JSON.parse(JSON.stringify(result)))
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
			fromStore: [this.storeId, [Validators.required]],
			toEntity: [this.clientId, [Validators.required]],
			description: ['', [Validators.required]],
			amount: ['', [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			fee: ['', [Validators.pattern(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
			date: [new Date().toISOString()],
		})
	}

	get t() {
		return this.transactionForm.controls
	}

	ngOnDestroy() {
		this.chRef.detach()
	}
}
