import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanComponent implements OnInit {
  @Output() onTransactionCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onTransactionLock: EventEmitter<any> = new EventEmitter<any>();
  @Output() onTransactionCreate: EventEmitter<any> = new EventEmitter<any>();

  storeId: string
  clientId: string

  stores: any[] = []
  clients: any[] = []
  currencies: any[] = []

  transactionForm!: FormGroup;

  constructor(
    private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private transactionsService: TransactionsService,
    private fb: FormBuilder,
    private msg: MessageService,
  ) { 
    this.storeId = this.route.snapshot.params.storeId
    this.clientId = this.route.snapshot.params.clientId
  }

  async ngOnInit() {
    this.initForm()

    this.stores = await this.transactionsService.getStores()
    this.clients = await this.transactionsService.getClients()
    this.currencies = await this.transactionsService.getCurrencies()
    this.chRef.detectChanges()
  }

  ngAfterViewInit(){
    this.chRef.detectChanges()
  }

  makeTransaction(){
    if(this.transactionForm.invalid){
      this.msg.error('Invalid inputs, cannot make this deposit', 'Error!')
      this.transactionForm.markAllAsTouched()
      return
    }

    this.onTransactionLock.emit(true)
    this.transactionsService.makeLoan(this.transactionForm.value).subscribe(
      (res: any) => {
        console.log(res)
        this.onTransactionCreate.emit(JSON.parse(JSON.stringify(res.data.makeLoan)))
        this.initForm()
        this.chRef.detectChanges()
      },
      (e: any) => {
        console.error(e)
        this.msg.error('Sorry, its not your fault, its ours. Please contact page developers :)', 'Error!')
      }
    )

  }

  initForm(){
    this.transactionForm = this.fb.group({
      storeId: [this.storeId, [Validators.required]],
      clientId: [this.clientId, [Validators.required]],
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
      fee: ['', [Validators.pattern(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/)]],
      date: [new Date().toISOString().split('T')[0]],
      currency: [null]
    })
  }

  cancelTransaction(){
    this.onTransactionCancel.emit(true)
  }

  get t(){return this.transactionForm.controls}

  ngOnDestroy(){
    this.chRef.detach()
  }

}
