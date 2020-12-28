import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
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
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  private subscriptions = new Subscription()
  dtOptions: DataTables.Settings 
  dtTrigger = new Subject<any>();
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
      this.dtOptions = this.configsService.getDTOptions()
      this.modalConfig = this.configsService.getCleanModalOptions()
  }

  ngOnInit(): void {
    this.getCurrencies()
  }

  saveCurrency(modal: NgbActiveModal){
    if(this.currencyForm.invalid){
      this.currencyForm.markAllAsTouched()
      this.msg.error('Please complete the form to proceed')
      return
    }

    this.loading = true
    this.currencyService.updateCurrency(this.currency._id, this.currencyForm.value).subscribe(
      (res: any) => {
        var updatedCurrency = res.data.currencyUpdateById.record
       
        this.currency.symbol = updatedCurrency.symbol
        this.currency.currency = updatedCurrency.currency
        this.currency.name = updatedCurrency.name
        this.currency.type = updatedCurrency.type
               
        this.rerender()
        modal.close()
      },
      e => {
        console.error(e)
        this.msg.error('Sorry, could not update user at the moment. Please try again later.', 'Error')
      },
      () => {
        this.loading = false
        this.chRef.detectChanges()
      }
    )
  }

  getCurrencies(){
    this.subscriptions.add(
      this.currencyService.getCurrencies().subscribe(
        (res: any) => {
          this.currencies = JSON.parse(JSON.stringify(res.data.currencyMany)) as Currency[]
        },
        e => { 
          console.error(e)
          this.msg.defaultError()
        },
        () => {
          this.dtTrigger.next()
          this.chRef.detectChanges()
        })
    )
  }

  openUpdate(content: TemplateRef<any>, currency: Currency){
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first 
        dtInstance.destroy();

        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
    });
    this.chRef.detectChanges()
  }

  get f() { return this.currencyForm.controls}

  ngOnDestroy(){
    this.subscriptions.unsubscribe()
    this.dtTrigger.unsubscribe()
    this.chRef.detach()
  }
}
