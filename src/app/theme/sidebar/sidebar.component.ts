import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NbLayoutComponent, NbMenuItem, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

  items: NbMenuItem[] = [
    {
      title: 'Dashboard',
      link: '/dashboard',
      icon: 'home',
      pathMatch: "prefix",
      
    },
    {
      title: 'Stores',
      link: '/stores',
      icon: 'shopping-bag',
      pathMatch: "prefix"
    },
    {
      title: 'Transactions',
      link: '/transactions',
      icon: 'money-bill',
      pathMatch: "prefix"
    },
    {
      title: 'Reports',
      link: '/reports',
      icon: 'file-alt',
      pathMatch: "prefix"
    },
    {
      title: 'Settings',
      link: '/settings',
      icon: 'cog',
      pathMatch: "prefix"
    },
  ];

  constructor(private router: Router, private layout: NbLayoutComponent, private sidebar: NbSidebarService) { 
    this.router.events.subscribe(
      event => {
        if(event instanceof NavigationStart) {          
          if(this.layout.getDimensions().clientWidth <= 570){
            this.sidebar.collapse()
          }
        }
      }
    )
   }

  ngOnInit(): void {  }

  closeSidebar(){ 

   }
}
