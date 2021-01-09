import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

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

  newPassFormControl = new FormControl('', [Validators.required, Validators.minLength(6)])
  newPassRFormControl = new FormControl('', [Validators.required, Validators.minLength(6)])
  
  allChecked = true
  newChecked = true
  flaggedChecked = true

  constructor(
    private chRef: ChangeDetectorRef,
    private msg: MessageService,
    private authService: AuthenticationService,
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

  updatePassword(){
    if(this.newPassFormControl.invalid){
      this.msg.error('Please insert a valid password with a minimum length of 6.', 'Error')
      return
    }
    if(this.newPassRFormControl.invalid || this.newPassFormControl.value !== this.newPassRFormControl.value){
      this.msg.error('Passwords should match.', 'Error')
      return
    }

    this.authService.resetPassword(this.newPassFormControl.value).subscribe(
      (res: any) => {
        console.log(res)
        if(res.data.resetPassword.message === 'Done'){
          this.msg.success('Password updated successfully', 'Success!')
          this.resetPasswordFormControls()
        } else {
          console.error('Something might have gone wrong in changing password')
        }
      },
      e => {
        console.error(e)
        this.msg.defaultError()
      }
    )
  }

  resetPasswordFormControls(){
    this.newPassFormControl.setValue('')
    this.newPassRFormControl.setValue('')
    this.newPassFormControl.markAsUntouched()
    this.newPassRFormControl.markAsUntouched()
    this.chRef.detectChanges()
  }
}
