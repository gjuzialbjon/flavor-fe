import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  subs: Subscription = new Subscription()

  hmm = [1,2,3]
  user = 'albjon'

  constructor(  private chRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    
  } 

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

}
