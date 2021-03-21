import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StoresComponent } from './stores/stores.component'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { StoreDashboardComponent } from './store-dashboard/store-dashboard.component'
import { NgSelectModule } from '@ng-select/ng-select'
import {
	NbButtonModule,
	NbCardModule,
	NbDatepickerModule,
	NbDialogModule,
	NbFormFieldModule,
	NbIconModule,
	NbInputModule,
	NbSelectModule,
	NbSpinnerModule,
} from '@nebular/theme'
import { StoreCardComponent } from './store-card/store-card.component'
import { DataTablesModule } from 'angular-datatables'
import { SharedTransactionsModule } from '../shared-transactions/shared-transactions.module'
import { ClientCardComponent } from './client-card/client-card.component'
import { TransactionsModule } from '../transactions/transactions.module'

@NgModule({
	declarations: [StoresComponent, StoreDashboardComponent, StoreCardComponent, ClientCardComponent],
	imports: [
		CommonModule,
		SharedTransactionsModule,
		RouterModule.forChild([
			{
				path: '',
				component: StoresComponent,
				pathMatch: 'full',
				data: {
					roles: ['admin', 'agent'],
				},
			},
			{
				path: ':storeId',
				component: StoreDashboardComponent,
				data: {
					roles: ['admin', 'agent'],
				},
			},
		]),
		DataTablesModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		NbCardModule,
		NbIconModule,
		NbDatepickerModule,
		NbButtonModule,
		NbFormFieldModule,
		NbInputModule,
		NbSelectModule,
		NbSpinnerModule,
		NgbDropdownModule,
		NbDialogModule.forChild({
			dialogClass: 'dialog-width',
		}),
	],
})
export class StoresModule {}
