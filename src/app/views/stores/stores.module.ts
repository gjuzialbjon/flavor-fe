import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresComponent } from './stores/stores.component';
import { RouterModule } from '@angular/router';
import { CountUpModule } from 'ngx-countup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreDashboardComponent } from './store-dashboard/store-dashboard.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [StoresComponent, StoreDashboardComponent],
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
    NgSelectModule
  ]
})
export class StoresModule { }
