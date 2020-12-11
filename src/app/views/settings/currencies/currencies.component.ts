import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  currencyForm!: FormGroup
  currency!: Currency
  loading = false
  invitationLoading = false

  types = [
    {
      _id: "crypto",
      name: "Crypto"
    },
    {
      _id: "valut",
      name: "Valut"
    }
  ]

  constructor(
    private currencyService: CurrencyService,
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private msg: MessageService,
    private modalService: NgbModal,
    private authService: AuthenticationService
    ) {
      this.dtOptions = this.configsService.getCurrencyDTOptions()
      this.modalConfig = this.configsService.getCleanModalOptions()
  }

  ngOnInit(): void {
    this.getCurrencies()
  }

  saveCurrency(modal: NgbActiveModal){

  }

  getCurrencies(){
    this.subscriptions.add(
      this.currencyService.getCurrencies().subscribe(
        (res: any) => {
          this.currencies = res.data.currencyMany as Currency[]
          // console.log(this.currencies)
          this.chRef.detectChanges()
        },
        e => { 
          console.error(e)
          this.chRef.detectChanges()
        })
    )
  }

  openUpdate(content: TemplateRef<any>, currency: Currency){
    console.log(currency)
    this.currency = currency
    this.initCurrencyForm()
    this.modalService.open(content, this.modalConfig)
  }

  initCurrencyForm() {
    this.currencyForm = this.fb.group({
      currency: [this.currency.currency, [Validators.required]],
      symbol: [this.currency.symbol, [Validators.required]],
      name: [ this.currency.name, [Validators.required]],
      type: [ this.currency.type, [Validators.required]],
    })
  }

  get f() { return this.currencyForm.controls}

  ngOnDestroy(){
    this.subscriptions.unsubscribe()
    this.chRef.detach()
  }
}
