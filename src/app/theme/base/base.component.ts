import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if(this.router.url.length < 3){
      if(this.authService.user.role === 'admin' || this.authService.user.role === 'agent'){
        this.router.navigateByUrl('/stores')
      } else if(this.authService.user.role === 'finance'){
        this.router.navigateByUrl('/reports')
      } else{
        console.error('Unknown role in base component')
      }
    }
  }
}
