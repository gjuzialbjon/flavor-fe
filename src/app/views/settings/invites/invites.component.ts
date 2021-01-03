import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitesComponent implements OnInit {

  // INVITATION VARIABLES //
  emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email])
  roleFormControl: FormControl = new FormControl('', [Validators.required])
  invitationLoading = false

  constructor(
    private userService: UserService,
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private msg: MessageService,
    private authService: AuthenticationService
    ) {
      // this.dtOptions = this.configsService.getUserDTOptions()
  }

  ngOnInit(): void {
  }

  inviteUser(){
    if(this.emailFormControl.invalid && this.roleFormControl.invalid ){
      this.msg.error('Email and role are both required', 'Error')
      return
    } else if(this.emailFormControl.invalid){
      this.msg.error('Email format is invalid', 'Error')
      return
    } else if(this.roleFormControl.invalid){
      this.msg.error('Role is invalid', 'Error')
      return
    }

    this.invitationLoading = true
    console.log('Invite user ', this.emailFormControl.value, this.roleFormControl.value)

    this.userService.inviteUser(this.emailFormControl.value, this.roleFormControl.value).subscribe(
      (res: any) => {
        console.log(res)

      },
      e => {
        console.error(e)
        this.msg.error('Something went wrong. Invitation not sent.', 'Error!')
      },
      () => {
        this.invitationLoading = false
        this.chRef.detectChanges()
      }
    )
  }

}
