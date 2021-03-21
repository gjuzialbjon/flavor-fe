import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtcComponent } from './btc/btc.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import {
	NbCardModule,
	NbFormFieldModule,
	NbInputModule,
	NbCheckboxModule,
	NbButtonModule,
	NbIconModule,
	NbSpinnerModule,
	NbDatepickerModule,
	NbDialogModule,
	NbSelectModule,
	NB_TIME_PICKER_CONFIG,
} from '@nebular/theme'
import { DataTablesModule } from 'angular-datatables'
import { BtcDashboardComponent } from './btc-dashboard/btc-dashboard.component'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { NgSelectModule } from '@ng-select/ng-select'

@NgModule({
	declarations: [BtcComponent, BtcDashboardComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: BtcComponent,
				pathMatch: 'full',
				data: {
					roles: ['admin', 'agent'],
				},
			},
			{
				path: ':id',
				component: BtcDashboardComponent,
				data: {
					roles: ['admin', 'agent'],
				},
			},
		]),
		DataTablesModule,
		NbCardModule,
		NbFormFieldModule,
		NbInputModule,
		NbCheckboxModule,
		NbIconModule,
		NbButtonModule,
		NbDatepickerModule,
		NbSelectModule,
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		NbSpinnerModule,
		NgbDropdownModule,
		NbDialogModule.forChild({
			dialogClass: 'dialog-width',
		}),
	],
})
export class BtcModule {}
