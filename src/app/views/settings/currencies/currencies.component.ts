import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Currency } from 'src/app/core/models/currency';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrenciesComponent implements OnInit {
  private subscriptions = new Subscription()
  dtOptions: DataTables.Settings 
  modalConfig
  currencies: Currency[] = []
  userForm!: FormGroup
  currency!: Currency
  loading = false
  invitationLoading = false

  constructor(
    private currencyService: CurrencyService,
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private msg: MessageService,
    private modalService: NgbModal,
    private authService: AuthenticationService
    ) {
      this.dtOptions = this.configsService.getDTOptions()
      this.modalConfig = this.configsService.getCleanModalOptions()
  }

  ngOnInit(): void {
    this.getCurrencies()
  }

  getCurrencies(){
    this.subscriptions.add(
      this.currencyService.Currencies.subscribe(
        (res: any) => {
          this.currencies = res.data.currencyMany as Currency[]
          console.log(this.currencies)
          this.chRef.detectChanges()
        },
        e => { 
          console.error(e)
          this.chRef.detectChanges()
        })
    )
  }

  openUpdate(){

  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe()
    this.chRef.detach()
  }
}
