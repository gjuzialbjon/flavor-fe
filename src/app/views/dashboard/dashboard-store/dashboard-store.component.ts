import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dashboard-store',
  templateUrl: './dashboard-store.component.html',
  styleUrls: ['./dashboard-store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardStoreComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
