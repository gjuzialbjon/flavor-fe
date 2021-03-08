import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';

@Component({
  selector: 'app-btc',
  templateUrl: './btc.component.html',
  styleUrls: ['./btc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtcComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings;
  dtTrigger = new Subject<any>();

  transactions: any[] = [];
  loadingTransactions = false;

  makingTrade = false

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private transactionsService: TransactionsService,
    private fb: FormBuilder,
    private msg: MessageService
  ) {
    this.dtOptions = this.configsService.getDTOptions();
    this.dtOptions.columnDefs = [
      // @ts-ignore
      { responsivePriority: 100, targets: [0, 3] },
    ];
  }

  cryptoForm!: FormGroup;

  ngOnInit() {
    this.getCryptoTransactions();
    this.initForm();
  }

  getCryptoTransactions() {
    this.transactionsService.getCryptoTransactions().subscribe((res: any) => {
      console.log(res);
      let stores = res.data.Me.stores;
      this.transactions = [];
      for (const store of stores) {
        for (const t of store.transactions) {
          this.transactions.push(t);
        }
      }

      console.log(this.transactions);

      this.dtTrigger.next();
      this.chRef.detectChanges();
    });
  }

  makeTransaction() {
    if (this.cryptoForm.invalid) {
      this.msg.error(
        'Invalid inputs, cannot make this crypto transaction',
        'Error!'
      );
      this.cryptoForm.markAllAsTouched();
      return;
    }

    this.makingTrade = true
    this.transactionsService
      .createCryptoTransaction(this.cryptoForm.value)
      .subscribe(
        (res: any) => {
          console.log(res);

          this.initForm();
          this.makingTrade = false

          // NEEDS TO RELOAD TABLE
          window.location.reload();
          // this.chRef.detectChanges();
        },
        (e: any) => {
          console.error(e);
          this.makingTrade = false
          this.msg.error(
            'Sorry, its not your fault, its ours. Please contact page developers :)',
            'Error!'
          );
        }
      );
  }

  initForm() {
    this.cryptoForm = this.fb.group({
      description: ['', [Validators.required]],
      date: [new Date(), [Validators.required]],
      Store: [environment.btc_store_id],
    });
  }

  get t() {
    return this.cryptoForm.controls;
  }

  ngOnDestroy() {
    this.chRef.detach();
  }
}
