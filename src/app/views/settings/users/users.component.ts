import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  dtOptions: DataTables.Settings 
  users: User[] = []

  constructor(
    private userService: UserService,
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef
    ) {
      this.dtOptions = this.configsService.getDTOptions()
    }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.subscriptions.add(this.userService.Users.subscribe(
      (res: any) => {
        this.users = res.data.userMany as User[]
        console.log(this.users)
        this.chRef.detectChanges()
      },
      e => { console.error(e)}))
  }

  
  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
