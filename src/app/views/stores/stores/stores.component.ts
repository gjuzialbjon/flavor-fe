import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Client } from 'src/app/core/models/client';
import { Currency } from 'src/app/core/models/currency';
import { Store } from 'src/app/core/models/store';
import { ClientsService } from 'src/app/core/services/clients.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoresComponent implements OnInit {
  stores: Store[] = []
  favoriteClients: Client[] = []
  currencies: Currency[] = []
  loading = false // Prevent duplicate store creation
  loadingStores = true
  loadingFavorites = true
  newStoreForm!: FormGroup;

  totalBalance = 32322

  constructor(
    private configsService: ConfigsService, 
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private msg: MessageService,
    private storeService: StoreService,
    private clientsService: ClientsService,
    private currencyService: CurrencyService,
    private chRef: ChangeDetectorRef
    ) {
  }

  ngOnInit(): void {
    this.getStores()
    this.getFavoriteClients()
    this.getCurrencies()
    this.initNewStoreForm()
  }

  getStores(){
    this.storeService.getStores().subscribe(
      (res:any) => { 
        this.stores = res.data.storeMany as Store[]
        console.log(this.stores)
      },
      e => { 
        console.error(e);
        this.msg.defaultError()
      },
      () => {
        this.loadingStores = false
        this.chRef.detectChanges()
      })
  }

  getFavoriteClients(){
    this.clientsService.getFavoriteClients().subscribe(
      (res: any) => {
        console.log(res)
        this.favoriteClients = res.data.Me[0].favorites as Client[];
        // console.log(this.favoriteClients)
      },
      (e) => {
        console.error(e);
        this.msg.defaultError();
      },
      () => {
        this.loadingFavorites = false;
        this.chRef.detectChanges();
      }
    );
  }

  getCurrencies(){
    this.currencyService.getCurrencies().subscribe(
      (res:any) => { 
        this.currencies = res.data.currencyMany as Currency[]
      },
      e => { 
        console.error(e);
      }
    )
  }

  openNewStoreModal(content: TemplateRef<any>){
    this.initNewStoreForm()
    this.modalService.open(content)
  }

  createStore(modal: NgbActiveModal) {
    if(this.newStoreForm.invalid){
      console.log(this.newStoreForm.value);
      
      this.newStoreForm.markAllAsTouched()
      this.msg.error('Make sure to complete the form before proceeding.', 'Form Invalid!')
      return
    }

    this.loading = true
    // PROCEED TO CREATE NEW STORE AFTER LOCKING BUTTON
    // this.storeService.createStore(this.newStoreForm.value).subscribe(
    //   (res: any) => {
    //     this.getStores()
    //     this.loading = false
    //     modal.close('Completed')
    //   },
    //   e => { 
    //     console.error(e)
    //     this.msg.defaultError()
    //     this.loading = false
    //   }
    // )
  }

  initNewStoreForm(){
    this.newStoreForm = this.fb.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', []],
      default_currency: [0, []],
    })
  }

  openStore(store: any){
    console.log(store);  
  }

  get s() { return this.newStoreForm.controls }

  ngOnDestroy() {
    this.chRef.detach()
  }
}
