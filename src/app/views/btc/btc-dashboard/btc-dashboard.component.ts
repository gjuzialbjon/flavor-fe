import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';

@Component({
  selector: 'app-btc-dashboard',
  templateUrl: './btc-dashboard.component.html',
  styleUrls: ['./btc-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtcDashboardComponent implements OnInit {
  loadingTransactions = false;
  dtOptions: DataTables.Settings;
  dtOptions2: DataTables.Settings;

  transactions: any[] = [1, 2, 3, 4, 5, 21, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

  constructor(
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef
  ) {
    this.dtOptions = this.configsService.getBTCDTOptions();
    this.dtOptions2 = this.configsService.getBTCDTOptions();

    this.dtOptions.columnDefs = [
      // @ts-ignore
      { responsivePriority: 100, targets: [0, 8] },
    ];
    this.dtOptions2.columnDefs = [
      // @ts-ignore
      { responsivePriority: 100, targets: [0, 3] },
    ];
  }

  ngOnInit(): void {}

  ngOnDestroy() {}
}
