import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotComponent implements OnInit {
  loading = false
  emailFormControl = new FormControl('', [Validators.required, Validators.email])
  success = false
  error = false

  constructor(
    private authService: AuthenticationService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  sendResetLink(){
    if(this.emailFormControl.invalid){
      this.emailFormControl.markAsTouched()
      return
    }

    this.loading = true
    this.authService.forgotPassword(this.emailFormControl.value).subscribe(
      (res:any) => {
        console.log(res);
        this.success = true
        this.error = false
        this.loading = false
        this.chRef.detectChanges()
      },
      e => {
        console.error(e);
        this.error = true
        this.success = false
        this.loading = false
        this.chRef.detectChanges()
      }
    )
  }

}
