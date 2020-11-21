import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthenticationService, private msg: MessageService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit(): void {
  }

  login(){
    console.log('Login')
    

    // this.router.navigate(['dashboard'])
  }

  loginWithGoogle(){
    console.log('Login with Google');
    this.msg.success('Message', 'Title')
    this.msg.info('Message', 'Title')
    this.msg.warning('Message', 'Title')
    this.msg.error('Message', 'Title')

    // this.authService.signInWithGoogle().then(
    //   res => {
    //     console.log('Logged in with google ', res)
    //     this.router.navigate(['dashboard'])
    //   }
    // ).catch( e => { console.error(e)})

  }

  get l() { return this.loginForm.controls }
}
