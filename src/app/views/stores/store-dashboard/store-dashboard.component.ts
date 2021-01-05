import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Store } from 'src/app/core/models/store';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-dashboard',
  templateUrl: './store-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDashboardComponent implements OnInit, OnDestroy {
  @Input() name: string = '';
  @Input() balance: number = 0;
  @Input() profit: number = 0;
  @Input() percentage: number = 0;
  @Input() id: string = '';

  transactions = [
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description',
      issued: true,
      comment: 'This is the error comment'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'pending',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description',
      issued: true
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'pending',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description'
    },
    {
      date: '2020-23-11',
      storeName: 'Store 1',
      clientName: 'John Doe',
      paymentType: 'Invoice',
      credit: 2000,
      debit: 4444,
      status: 'completed',
      description: 'Short description'
    }
  ]

  private subscriptions = new Subscription();
  storeId: string;
  store!: Store;
  modalConfig;
  loading = false; // Prevent duplicate client creation
  newClientForm!: FormGroup;


  constructor(
    private configsService: ConfigsService,
    private modalService: NgbModal,
    private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storeService: StoreService,
    private msg: MessageService,
    private router: Router
  ) {
    this.storeId = this.route.snapshot.params.id;
    this.modalConfig = this.configsService.getCleanModalOptions();
  }

  ngOnInit(): void {
    this.getStoreInfo()
    // this.initNewClientForm()
  }

  createClient(modal: NgbActiveModal) {}

  getStoreInfo() {
    this.subscriptions.add(
      this.storeService.getStoreById(this.storeId).subscribe(
        (res: any) => {
          this.store = res.data.storeById as Store;
          console.log(this.store);
          // if(!this.store){
          //   this.msg.error('Something went wrong loading the store.')
          //   setTimeout(() => {
          //     this.router.navigate(['/stores'])
          //   },2000)
          // }
          this.chRef.detectChanges();
        },
        (e) => {
          console.error(e);
          this.msg.defaultError();
        }
      )
    );
  }

  openNewClientModal(content: TemplateRef<any>) {
    this.initNewClientForm();
    this.modalService.open(content, this.modalConfig);
  }

  initNewClientForm() {
    this.newClientForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      description: ['', []],
      location: ['', [Validators.required]],
    });
  }

  get n() {
    return this.newClientForm.controls;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.chRef.detach();
  }
}
