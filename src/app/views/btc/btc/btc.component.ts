import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';

@Component({
  selector: 'app-btc',
  templateUrl: './btc.component.html',
  styleUrls: ['./btc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtcComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings;

  btcDates: any[] = [
    {
      createdAt: '2020-20-01',
      status: 'open',
      amount: 3223,
      _id: 3123,
    },
    {
      createdAt: '2020-20-01',
      status: 'open',
      amount: 3223,
      _id: 3123,
    },
    {
      createdAt: '2020-20-01',
      status: 'open',
      amount: 3223,
      _id: 3123,
    },
    {
      createdAt: '2020-20-01',
      status: 'open',
      amount: 3223,
      _id: 3123,
    },
  ];

  loadingDates = false;

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef
  ) {
    this.dtOptions = this.configsService.getDTOptions();
    this.dtOptions.columnDefs = [
      // @ts-ignore
      { responsivePriority: 100, targets: [0, 3] },
    ];
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.chRef.detach();
  }
}
