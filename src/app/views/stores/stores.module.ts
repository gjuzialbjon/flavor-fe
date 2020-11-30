import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresComponent } from './stores/stores.component';
import { RouterModule } from '@angular/router';
import { CountUpModule } from 'ngx-countup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [StoresComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: StoresComponent,
        pathMatch: 'full'
      }
    ]),
    CountUpModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StoresModule { }
