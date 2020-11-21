import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

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

  constructor( private userService: UserService, private chRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subs.add(this.userService.Users.subscribe(
      (res ) => {
        console.log(res);
        this.user = 'next user'
      },
      e => { console.error(e)}))
  } 

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

}
