import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NbDialogService } from '@nebular/theme'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ConfigsService } from 'src/app/core/helper-services/configs.service'
import { MessageService } from 'src/app/core/helper-services/message.service'
import { Client } from 'src/app/core/models/client'
import { Currency } from 'src/app/core/models/currency'
import { Store } from 'src/app/core/models/store'
import { AuthenticationService } from 'src/app/core/services/authentication.service'
import { ClientsService } from 'src/app/core/services/clients.service'
import { CurrencyService } from 'src/app/core/services/currency.service'
import { StoreService } from 'src/app/core/services/store.service'

@Component({
	selector: 'app-stores',
	templateUrl: './stores.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresComponent implements OnInit {
	stores: Store[] = []
	favoriteClients: Client[] = []
	currencies: Currency[] = []
	loading = false // Prevent duplicate store creation
	loadingStores = true
	loadingFavorites = true
	newStoreForm!: FormGroup
	isAdmin = false

	totalBalance = 0

	constructor(
		private configsService: ConfigsService,
		private dialogService: NbDialogService,
		private fb: FormBuilder,
		private msg: MessageService,
		private storeService: StoreService,
		private clientsService: ClientsService,
		private currencyService: CurrencyService,
		private chRef: ChangeDetectorRef,
		private authService: AuthenticationService
	) {}

	ngOnInit(): void {
		this.isAdmin = this.authService.user.role === 'admin'
		this.getStores()
		this.getFavoriteClients()
		this.getCurrencies()
		this.initNewStoreForm()
	}

	getStores() {
		this.storeService.getMyStores().subscribe(
			(res: any) => {
				this.stores = res.data.Me.stores as Store[]

				// IF ADMIN PRIVILEGES ARE REQUIRED FOR CRYPTO STORE MANAGEMENT
				this.stores = this.stores.filter((store) => store.name !== 'CRYPTO STORE')

				this.totalBalance = 0
				for (const store of this.stores) {
					this.totalBalance += store.balance
				}

				this.loadingStores = false
				this.chRef.detectChanges()
			},
			(e) => {
				console.error(e)
				this.loadingStores = false
				this.msg.defaultError()
				this.chRef.detectChanges()
			}
		)
	}

	getFavoriteClients() {
		this.clientsService.getFavoriteClients().subscribe(
			(res: any) => {
				this.loadingFavorites = false
				this.favoriteClients = res.data.Me.favorites as Client[]
				this.chRef.detectChanges()
			},
			(e) => {
				console.error(e)
				this.loadingFavorites = false
				this.chRef.detectChanges()
				this.msg.defaultError()
			}
		)
	}

	getCurrencies() {
		this.currencyService.getCurrencies().subscribe(
			(res: any) => {
				this.currencies = res.data.currencyMany as Currency[]
			},
			(e) => {
				console.error(e)
			}
		)
	}

	openNewStoreModal(content: TemplateRef<any>) {
		this.initNewStoreForm()
		this.dialogService.open(content, { autoFocus: false })
	}

	createStore(modal: NgbActiveModal) {
		if (this.newStoreForm.invalid) {
			this.newStoreForm.markAllAsTouched()
			this.msg.error('Make sure to complete the form before proceeding.', 'Form Invalid!')
			return
		}

		this.loading = true
		// PROCEED TO CREATE NEW STORE AFTER LOCKING BUTTON
		this.storeService.createStore(this.newStoreForm.value).subscribe(
			(res: any) => {
				this.getStores()
				this.loading = false
				modal.close()
			},
			(e) => {
				console.error(e)
				this.msg.defaultError()
				this.loading = false
			}
		)
	}

	initNewStoreForm() {
		this.newStoreForm = this.fb.group({
			name: ['', [Validators.required]],
			location: ['', []],
			description: ['', []],
			default_currency: [null, []],
		})
	}

	openStore(store: any) {
		console.log(store)
	}

	get s() {
		return this.newStoreForm.controls
	}

	ngOnDestroy() {
		this.chRef.detach()
	}
}
