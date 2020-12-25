import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';

interface StoreBase{
  id: string,
  name: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  stores: StoreBase[] = [
    {
      id: '12231123',
      name: "dsadsads"
    },
    {
      id: '4444444',
      name: "dsadsads"
    }
  ]

  constructor(private chRef: ChangeDetectorRef, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    // this.dashboardService.getStoreBase().subscribe(
    //   (res: any) => {
    //     console.log(res)
    //   },
    //   e => { console.error(e) }
    // )
  }

}
