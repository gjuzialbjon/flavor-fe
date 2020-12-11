import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  sidebar!: HTMLElement

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
          // Hide sidebar if on small devices
          // console.log(event, window.screen.width);
          
          if(window.screen.width < 768){
            this.closeSidebar()
          }
      }
    })
  }

  ngOnInit(): void {
    this.sidebar = document.getElementById('sidebar') as HTMLElement
  }

  closeSidebar(){
    // console.log('Close sidebar');
    
    this.sidebar.classList.add('hidden')
    this.sidebar.classList.remove('show')
  }



}
