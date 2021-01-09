import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/core/helper-services/message.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotComponent implements OnInit {
  loading = false
  emailFormControl = new FormControl('', [Validators.required, Validators.email])

  constructor(
    private msg: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  sendResetLink(){
    if(this.emailFormControl.invalid){
      this.emailFormControl.markAsTouched()
      return
    }

    console.log('Sending reset link')
  }
}
