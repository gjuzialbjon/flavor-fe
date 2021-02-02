import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Store } from 'src/app/core/models/store';
import { Transaction } from 'src/app/core/models/transaction';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-dashboard',
  templateUrl: './store-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDashboardComponent implements OnInit, OnDestroy {
  // balances = [
  //   {
  //     name: 'DOLLAR',
  //     amount: 5433,
  //     symbol: 'USD'
  //   }
  // ];

  storeId: string;
  store!: Store;
  loading = false;

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storeService: StoreService,
    private msg: MessageService,
    private dialogService: NbDialogService,
    private router: Router
  ) {
    this.storeId = this.route.snapshot.params.storeId;
  }

  ngOnInit(): void {
    this.getStoreInfo();
  }

  getStoreInfo() {
    this.storeService.getStoreById(this.storeId).subscribe(
      (res: any) => {
        this.store = res.data.storeById as Store;
        console.log(this.store);
        this.chRef.detectChanges();
      },
      (e) => {
        console.error(e);
        this.msg.defaultError();
      }
    );
  }

  ngOnDestroy() {
    this.chRef.detach();
  }
}
