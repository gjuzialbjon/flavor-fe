import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-store',
  templateUrl: './dashboard-store.component.html',
  styleUrls: ['./dashboard-store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardStoreComponent implements OnInit {
  @Input() storeId = ''

  constructor() { }

  ngOnInit(): void {
    console.log(this.storeId, ' store id')
  }

}
