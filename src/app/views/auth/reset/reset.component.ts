import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetComponent implements OnInit {
  passwordForm: FormGroup
  loading = false

  constructor(
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
   }

  ngOnInit(): void {
  }

  resetPassword(){
    if(this.passwordForm.invalid || this.passwordForm.value.password !== this.passwordForm.value.repeatPassword){
      return
    }

    this.loading = true
    console.log('Resetting password');
  }

  get p() {return this.passwordForm.controls}
}
