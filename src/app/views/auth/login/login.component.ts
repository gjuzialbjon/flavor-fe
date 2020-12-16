import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'src/app/core/helper-services/message.service';
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

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private authService: AuthenticationService, 
    private msg: MessageService,
    private apollo: Apollo) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      })
  }

  ngOnInit(): void {
    this.authService.signOut()
    this.apollo.client.resetStore()
  }

  login(){
    console.log('Login')
    // this.router.navigate(['dashboard'])
  }

  loginWithGoogle(){
    this.authService.signInWithGoogle()
  }

  get l() { return this.loginForm.controls }
}
