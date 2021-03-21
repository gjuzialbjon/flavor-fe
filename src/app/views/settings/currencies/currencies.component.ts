import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NbDialogService } from '@nebular/theme'
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs'
import { ConfigsService } from 'src/app/core/helper-services/configs.service'
import { MessageService } from 'src/app/core/helper-services/message.service'
import { Currency } from 'src/app/core/models/currency'
import { CurrencyService } from 'src/app/core/services/currency.service'

@Component({
	selector: 'app-currencies',
	templateUrl: './currencies.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesComponent implements OnInit {
	@ViewChild(DataTableDirective) dtElement!: DataTableDirective

	dtOptions: DataTables.Settings
	dtTrigger = new Subject<any>()
	currencies: Currency[] = []
	currencyForm!: FormGroup
	currency!: Currency
	loading = false

	loadingCurrencies = true

	types = [
		{
			_id: 'crypto',
			name: 'Crypto',
		},
		{
			_id: 'valut',
			name: 'Valut',
		},
	]

	constructor(
		private currencyService: CurrencyService,
		private configsService: ConfigsService,
		private chRef: ChangeDetectorRef,
		private fb: FormBuilder,
		private msg: MessageService,
		private dialogService: NbDialogService
	) {
		this.dtOptions = this.configsService.getDTOptions()
		this.dtOptions.columnDefs = [
			// @ts-ignore
			{ responsivePriority: 100, targets: [0, 4] },
		]
	}

	ngOnInit(): void {
		this.getCurrencies()
	}

	saveCurrency(modal: any) {
		if (this.currencyForm.invalid) {
			this.currencyForm.markAllAsTouched()
			this.msg.error('Please complete the form to proceed')
			return
		}

		this.loading = true
		this.currencyService.updateCurrency(this.currency._id, this.currencyForm.value).subscribe(
			(res: any) => {
				var updatedCurrency = res.data.currencyUpdateById.record

				this.currency.symbol = updatedCurrency.symbol
				this.currency.currency = updatedCurrency.currency
				this.currency.name = updatedCurrency.name
				this.currency.type = updatedCurrency.type

				this.rerender()
				modal.close()
			},
			(e) => {
				console.error(e)
				this.msg.error('Sorry, could not update user at the moment. Please try again later.', 'Error')
			},
			() => {
				this.loading = false
				this.chRef.detectChanges()
			}
		)
	}

	getCurrencies() {
		this.currencyService.getCurrencies().subscribe(
			(res: any) => {
				this.currencies = JSON.parse(JSON.stringify(res.data.currencyMany)) as Currency[]
				this.loadingCurrencies = false
			},
			(e) => {
				console.error(e)
				this.msg.defaultError()
				this.loadingCurrencies = false
			},
			() => {
				this.dtTrigger.next()
				this.chRef.detectChanges()
			}
		)
	}

	openUpdate(content: TemplateRef<any>, currency: Currency) {
		this.currency = currency
		this.initCurrencyForm()
		this.dialogService.open(content)
	}

	initCurrencyForm() {
		this.currencyForm = this.fb.group({
			currency: [this.currency.currency, [Validators.required]],
			symbol: [this.currency.symbol, [Validators.required]],
			name: [this.currency.name, [Validators.required]],
			type: [this.currency.type, [Validators.required]],
		})
	}

	rerender(): void {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			// Destroy the table first
			dtInstance.destroy()

			// Call the dtTrigger to rerender again
			this.dtTrigger.next()
		})
		this.chRef.detectChanges()
	}

	get f() {
		return this.currencyForm.controls
	}

	ngOnDestroy() {
		this.dtTrigger.unsubscribe()
		this.chRef.detach()
	}
}
