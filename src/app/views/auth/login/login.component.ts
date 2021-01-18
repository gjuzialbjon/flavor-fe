import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { SocialTokenResponse } from 'src/app/core/models/socialTokenResponse';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  showPassword = false
  loading = false

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private authService: AuthenticationService, 
    private msg: MessageService,
    private dialogService: NbDialogService,
    private apollo: Apollo) {
      this.loginForm = this.fb.group({
        email: ['albjon.gjuzi@gmail.com', [Validators.required, Validators.email]],
        password: ['123123', [Validators.required, Validators.minLength(6)]]
      })
  }

  ngOnInit(): void {
    localStorage.clear()
    this.apollo.client.resetStore()
  }

  login(){
    console.log('Login')
    if(this.loginForm.invalid){
      this.msg.error('Please enter your email and password', 'Error!')
      return
    }

    this.loading = true
    const {email, password} = this.loginForm.value
    this.authService.login(email, password).subscribe(
      (res: SocialTokenResponse) => {
        localStorage.setItem('flavorToken', res.token + '')
        this.authService.initUserFromToken()
        console.log('User ', this.authService.user)
        if(this.authService.user.confirmed){
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/auth/not-authorized']);
          console.error('User unconfirmed')
        }
      },
      (e) => {
        console.error(e);
        this.msg.error(
          'Something went wrong. Please try again.',
          'Error!'
        );
      }
    );
  }

  openForgotDialog(content: any){
    this.dialogService.open(content)
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  get l() { return this.loginForm.controls }
}
