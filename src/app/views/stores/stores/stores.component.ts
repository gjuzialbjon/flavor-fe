import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Store } from 'src/app/core/models/store';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoresComponent implements OnInit {
  private subscriptions = new Subscription();
  stores: Store[] = []
  loading = false // Prevent duplicate store adding
  countUpOptions
  modalConfig
  newStoreForm!: FormGroup;

  constructor(
    private configsService: ConfigsService, 
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private msg: MessageService,
    private storeService: StoreService,
    private chRef: ChangeDetectorRef
    ) {
      this.countUpOptions = this.configsService.getCountUpOptions()
      this.modalConfig = this.configsService.getCleanModalOptions()
      this.initNewStoreForm()
  }

  ngOnInit(): void {
    this.getStores()
  }

  getStores(){
    this.subscriptions.add(
      this.storeService.Stores.subscribe(
        (res:any) => { 
          this.stores = res.data.storeMany as Store[]
          this.chRef.detectChanges()
        },
        e => { 
          console.error(e);
          this.msg.defaultError()
        }
    ))
  }

  openNewStoreModal(newModalContent: TemplateRef<any>){
    this.initNewStoreForm()
    this.modalService.open(newModalContent, this.modalConfig)
  }

  createStore(modal: NgbActiveModal) {
    if(this.newStoreForm.invalid){
      this.newStoreForm.markAllAsTouched()
      this.msg.error('Make sure to complete the form before proceeding.', 'Form Invalid!')
      return
    }

    this.loading = true
    // PROCEED TO CREATE NEW STORE AFTER LOCKING BUTTON
    this.storeService.createStore(this.newStoreForm.value).subscribe(
      (res: any) => {
        this.getStores()
        this.loading = false
        modal.close('Completed')
      },
      e => { 
        console.error(e)
        this.msg.defaultError()
        this.loading = false
      }
    )
  }

  initNewStoreForm(){
    this.newStoreForm = this.fb.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', []],
      default_currency: ['', []],
    })
  }

  openStore(store: any){
    console.log(store);  
  }

  get s() { return this.newStoreForm.controls }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
    this.chRef.detach()
  }
}
