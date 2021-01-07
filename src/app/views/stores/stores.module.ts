import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresComponent } from './stores/stores.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreDashboardComponent } from './store-dashboard/store-dashboard.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { StoreCardComponent } from './store-card/store-card.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [StoresComponent, StoreDashboardComponent, StoreCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: StoresComponent,
        pathMatch: 'full'
      },
      {
        path: ':id',
        component: StoreDashboardComponent,
      }
    ]),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgSelectModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbFormFieldModule,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
    NgbDropdownModule
  ]
})
export class StoresModule { }
