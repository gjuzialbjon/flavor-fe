import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTransactionsModule } from '../shared-transactions/shared-transactions.module';

@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TransactionsComponent,
        data:{
          roles: ['admin', 'agent']
        }
      }
    ]),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbButtonModule,
    NbDatepickerModule,
    NbInputModule,
    NbSelectModule,
    NgbDropdownModule,
    NbSpinnerModule,
    NbDialogModule.forChild({
      dialogClass: 'dialog-width'
    }),
    SharedTransactionsModule
  ]
})
export class TransactionsModule { }
