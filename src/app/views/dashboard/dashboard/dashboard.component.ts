import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  hmm = [1,2,3]
  subs: Subscription = new Subscription()

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.subs.add(this.userService.Users.subscribe(
      res => {
        console.log(res);
      },
      e => { console.error(e)}))
  } 

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

}
