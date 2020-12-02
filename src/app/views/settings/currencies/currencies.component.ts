import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrenciesComponent implements OnInit {
  private subscriptions = new Subscription()

  constructor(
    private currencyService: CurrencyService,
    private chRef: ChangeDetectorRef,
    private msg: MessageService
  ) { }

  ngOnInit(): void {
    this.getCurrencies()
  }

  getCurrencies(){
    this.subscriptions.add(
      this.currencyService.Currencies.subscribe(
        (res:any) => {
          console.log(res)
        },
        e => {
          console.error(e)
          this.msg.defaultError()
        }
      )
    )
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe()
    this.chRef.detach()
  }
}
