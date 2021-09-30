import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from '@env'
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs'
import { ConfigsService } from 'src/app/core/helper-services/configs.service'
import { MessageService } from 'src/app/core/helper-services/message.service'
import { TransactionsService } from 'src/app/core/services/transactions.service'

@Component({
	selector: 'app-btc',
	templateUrl: './btc.component.html',
	styleUrls: ['./btc.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtcComponent implements OnInit {
	@ViewChild(DataTableDirective) dtElement!: DataTableDirective
	dtOptions: DataTables.Settings
	dtTrigger = new Subject<any>()

	transactions: any[] = []
	loadingTransactions = false

	makingTrade = false
	cryptoForm!: FormGroup

	constructor(
		private configsService: ConfigsService,
		private chRef: ChangeDetectorRef,
		private transactionsService: TransactionsService,
		private fb: FormBuilder,
		private msg: MessageService,
		private router: Router
	) {
		this.dtOptions = this.configsService.getDTOptions()
		this.dtOptions.columnDefs = [
			// @ts-ignore
			{ responsivePriority: 100, targets: [0, 3] },
		]
		this.dtOptions.order = [0,'desc']
	}

	ngOnInit() {
		this.initForm()
		this.getCryptoTransactions()
	}

	getCryptoTransactions() {
		this.transactionsService.getCryptoTransactions().subscribe((res: any) => {
			this.transactions = res.data.myTransactions

			this.dtTrigger.next()
			this.chRef.detectChanges()
		})
	}

	makeTransaction() {
		if (this.cryptoForm.invalid) {
			this.msg.error('Invalid inputs, cannot make this crypto transaction', 'Error!')
			this.cryptoForm.markAllAsTouched()
			return
		}

		for (const transaction of this.transactions) {
			console.log(transaction)
		}

		this.makingTrade = true
		this.transactionsService.createCryptoTransaction(this.cryptoForm.value).subscribe(
			(res: any) => {
				// console.log(res)

				if(res.data.createCryptoTransaction) {
					this.initForm()	
					// NEEDS TO ENTER TRANSACTION	
					this.router.navigateByUrl('btc/' + res.data.createCryptoTransaction._id)
				} else {
					this.msg.error('Could not create transaction. Maybe there exists a transaction for this date!!!', 'Error!')
				}

				this.makingTrade = false
				this.chRef.detectChanges()
			},
			(e: any) => {
				console.error(e)
				this.makingTrade = false
				this.chRef.detectChanges()
				this.msg.error('Could not create transaction. Maybe there exists a transaction for this date!!!', 'Error!')
			}
		)
	}

	initForm() {
		this.cryptoForm = this.fb.group({
			date: [new Date(), [Validators.required]],
			Store: [environment.btc_store_id],
			default_fee: [0, [Validators.required, Validators.pattern(/[+-]?\d+\.?\d*/)]],
		})
	}

	get t() {
		return this.cryptoForm.controls
	}

	ngOnDestroy() {
		this.chRef.detach()
	}
}
