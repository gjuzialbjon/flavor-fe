import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { EmailService } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailConfigComponent implements OnInit {
  private subscriptions = new Subscription()

  constructor(
    private emailService: EmailService,
    private msg: MessageService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getEmailConfig()
  }

  getEmailConfig() {
    this.subscriptions.add(this.emailService.getEmailConfig().subscribe(
      (res:any) => {
        console.log(res)
      },
      (e) => {
        console.error(e)

      }
    ))
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe()
    this.chRef.detach()
  }
}
