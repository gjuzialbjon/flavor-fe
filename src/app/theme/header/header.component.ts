import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isNavbarCollapsed = true;
  fullName = ''

  constructor(
    private authService: AuthenticationService,
    private chRef: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.fullName = this.authService.username
  }
}
