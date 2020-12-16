import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  fullName = ''
  sidebar!: HTMLElement

  constructor(
    private authService: AuthenticationService,
    private chRef: ChangeDetectorRef,
    private sidebarService: NbSidebarService
    ) { }

  ngOnInit(): void {
    this.fullName = this.authService.username
    this.sidebar = document.getElementById('sidebar') as HTMLElement
  }

  toggleSidebar(){
    this.sidebarService.toggle();
  }
}
