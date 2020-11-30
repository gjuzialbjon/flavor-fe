import { Component, OnInit, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoresComponent implements OnInit {
  countUpOptions
  modalConfig

  newStoreForm!: FormGroup;

  stores = [
    {
      location: 'Tiran',
      balance: 342340,
      users: 43,
      clients: 143,
      description: 'A short description',
      currency: '$'
    },
  ]

  constructor(
    private configsService: ConfigsService, 
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private msg: MessageService
    ) {
      this.countUpOptions = this.configsService.getCountUpOptions()
      this.modalConfig = this.configsService.getCleanModalOptions()
      this.initNewStoreForm()
  }

  ngOnInit(): void {
  }

  openNewStoreModal(newModalContent: TemplateRef<any>){
    this.newStoreForm.reset()
    this.modalService.open(newModalContent, this.modalConfig)
  }

  createStore() {
    if(this.newStoreForm.invalid){
      this.newStoreForm.markAllAsTouched()
      this.msg.error('Make sure to complete the form before proceeding.', 'Form Invalid!')
      return
    }

    // PROCEED TO CREATE NEW STORE
  }

  initNewStoreForm(){
    this.newStoreForm = this.fb.group({
      name: [null, [Validators.required]],
      location: [null, [Validators.required]],
      description: [null, [Validators.required]],
      default_currency: [null, [Validators.required]],
    })
  }

  openStore(store: any){
    console.log(store);  
  }

  get s() { return this.newStoreForm.controls }
}
