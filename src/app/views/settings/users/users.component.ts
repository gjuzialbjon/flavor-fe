import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy {

  subs: Subscription = new Subscription()
  user: string | undefined

  constructor(private userService: UserService,) { }

  ngOnInit(): void {
    console.log('Init users')
    this.subs.add(this.userService.Users.subscribe(
      (res: any) => {
        console.log(res);
        // this.user = 'next user'
        
      },
      e => { console.error(e)}))
  }

  
  ngOnDestroy() {
    this.subs.unsubscribe()
  }
}
