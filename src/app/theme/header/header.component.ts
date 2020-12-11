import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private chRef: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.fullName = this.authService.username
    this.sidebar = document.getElementById('sidebar') as HTMLElement
  }

  toggleSidebar(){
    console.log('Toggle sidebar')
    if(this.sidebar.classList.contains('hidden') && !this.sidebar.classList.contains('show')){
      this.sidebar.classList.remove('hidden')
      this.sidebar.classList.add('show')
    } else if(this.sidebar.classList.contains('show') && !this.sidebar.classList.contains('hidden')){
      this.sidebar.classList.add('hidden')
      this.sidebar.classList.remove('show')
    } else if(!this.sidebar.classList.contains('show') && !this.sidebar.classList.contains('hidden')){
      this.sidebar.classList.add('show')
    }
  }
}
