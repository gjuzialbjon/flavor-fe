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
  private subscriptions = new Subscription();

  constructor(
    private userService: UserService,
    ) {

    }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.subscriptions.add(this.userService.Users.subscribe(
      (res: any) => {
        console.log(res);
        // this.user = 'next user'
        
      },
      e => { console.error(e)}))
  }

  
  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
