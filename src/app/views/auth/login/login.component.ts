import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

  constructor(private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  login(){
    console.log('Login')

  }

  loginWithGoogle(){
    console.log('Login with Google');
    
  }

  get l() { return this.loginForm.controls }
}
