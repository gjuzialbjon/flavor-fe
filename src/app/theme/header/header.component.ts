import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  userMenu: NbMenuItem[] = [
    { 
      title: 'Profile',
      icon: 'user',
      link: '/profile',
      pathMatch: 'full'
    }, 
    { 
      title: 'Log out',
      icon: 'sign-out-alt',
      link: '/auth',
      pathMatch: 'prefix'
    }
  ];
  
  fullName = ''

  constructor(
    private authService: AuthenticationService,
    private chRef: ChangeDetectorRef,
    private sidebarService: NbSidebarService
    ) { }

  ngOnInit(): void {
    this.fullName = this.authService.username
    this.chRef.detectChanges()
  }

  toggleSidebar(){
    this.sidebarService.toggle();
  }
}
