import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  userName = "Albjon"
  userEmail = 'test@sad.sad'

  editingName = false
  editingEmail = false

  nameFormControl = new FormControl(this.userName)
  emailFormControl = new FormControl(this.userEmail)
  
  allChecked = true
  newChecked = true
  flaggedChecked = true

  constructor(
    private chRef: ChangeDetectorRef,
    private msg: MessageService,
    private authService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  startEmailEdit(){
    this.editingEmail = true
    this.chRef.detectChanges()
  }

  startNameEdit(){
    this.editingName = true
    this.chRef.detectChanges()
  }

  saveNewMail(){
    this.userEmail = this.emailFormControl.value
    this.editingEmail = false
  }

  saveNewName(){
    this.userName = this.nameFormControl.value
    this.editingName = false
  }

  toggleNew(checked:boolean){
    this.newChecked = checked
    this.chRef.detectChanges()
  }

  toggleFlagged(checked:boolean){
    this.flaggedChecked = true
    this.chRef.detectChanges()
  }
}
