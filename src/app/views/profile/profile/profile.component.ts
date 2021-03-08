import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  user!: any;

  editingName = false;
  editingEmail = false;

  nameFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  newPassFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  newPassRFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  constructor(
    private chRef: ChangeDetectorRef,
    private msg: MessageService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authService.getMyData().subscribe(
      (res: any) => {
        this.user = JSON.parse(JSON.stringify(res.data.Me));
        this.emailFormControl.setValue(this.user.email);
        this.nameFormControl.setValue(this.user.name);
        this.chRef.detectChanges();
      },
      (e) => {
        console.error(e);
        this.msg.error('Couldnt get your data', 'Error!');
      }
    );
  }

  startEmailEdit() {
    this.editingEmail = true;
    this.chRef.detectChanges();
  }

  startNameEdit() {
    this.editingName = true;
    this.chRef.detectChanges();
  }

  saveNewMail() {
    if (this.emailFormControl.invalid) {
      this.msg.error('Please insert a valid email address', 'Error');
      return;
    }

    this.authService.updateMyEmail(this.emailFormControl.value).subscribe(
      (res: any) => {
        this.user.email = this.emailFormControl.value;
        this.editingEmail = false;
        this.chRef.detectChanges();
      },
      (e) => {
        console.error(e);
        this.msg.defaultError();
      }
    );
  }

  saveNewName() {
    if (this.nameFormControl.invalid) {
      this.msg.error('Please insert a name', 'Error');
      return;
    }

    this.authService.updateMyName(this.nameFormControl.value).subscribe(
      (res: any) => {
        this.user.name = this.nameFormControl.value;
        this.editingName = false;
        this.chRef.detectChanges();
      },
      (e) => {
        console.error(e);
        this.msg.defaultError();
      }
    );
  }

  updatePassword() {
    if (this.newPassFormControl.invalid) {
      this.msg.error(
        'Please insert a valid password with a minimum length of 6.',
        'Error'
      );
      return;
    }
    if (
      this.newPassRFormControl.invalid ||
      this.newPassFormControl.value !== this.newPassRFormControl.value
    ) {
      this.msg.error('Passwords should match.', 'Error');
      return;
    }

    this.authService.resetPassword(this.newPassFormControl.value).subscribe(
      (res: any) => {
        if (res.data.resetPassword.message === 'Done') {
          this.msg.success('Password updated successfully', 'Success!');
          this.resetPasswordFormControls();
        } else {
          console.error('Something might have gone wrong in changing password');
        }
      },
      (e) => {
        console.error(e);
        this.msg.defaultError();
      }
    );
  }

  resetPasswordFormControls() {
    this.newPassFormControl.setValue('');
    this.newPassRFormControl.setValue('');
    this.newPassFormControl.markAsUntouched();
    this.newPassRFormControl.markAsUntouched();
    this.chRef.detectChanges();
  }
}
