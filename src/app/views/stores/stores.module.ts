import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresComponent } from './stores/stores.component';
import { RouterModule } from '@angular/router';
import { CountUpModule } from 'ngx-countup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreDashboardComponent } from './store-dashboard/store-dashboard.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { StoreCardComponent } from './store-card/store-card.component';

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
    CountUpModule,
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
    NbSpinnerModule
  ]
})
export class StoresModule { }
