import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrenciesComponent } from './currencies/currencies.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CurrenciesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CurrenciesComponent
      }
    ])
  ]
})
export class SettingsModule { }
