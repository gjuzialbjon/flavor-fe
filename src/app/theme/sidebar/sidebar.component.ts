import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NbLayoutComponent, NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';
import { ReplaySubject } from 'rxjs';

import { map, tap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  items: NbMenuItem[] = [
    {
      title: 'Dashboard',
      link: '/dashboard',
      icon: {
        icon: 'dashboard',
        pack: 'menu',
      },
      pathMatch: "prefix",
      
    },
    {
      title: 'Stores',
      link: '/stores',
      icon: {
        icon: 'stores',
        pack: 'menu',
      },
      pathMatch: "prefix"
    },
    {
      title: 'Transactions',
      link: '/transactions',
      icon: {
        icon: 'transactions',
        pack: 'menu',
      },
      pathMatch: "prefix"
    },
    {
      title: 'Reports',
      link: '/reports',
      icon: {
        icon: 'reports',
        pack: 'menu',
      },
      pathMatch: "prefix"
    },
    {
      title: 'Settings',
      link: '/settings',
      icon: {
        icon: 'settings',
        pack: 'menu',
      },
      pathMatch: "prefix"
    },
  ];

  constructor(private router: Router, private menuService: NbMenuService, private layout: NbLayoutComponent, private breakpointService: NbMediaBreakpointsService, private sidebarService: NbSidebarService) { 
  }

  ngOnInit(): void { 
    const { sm } = this.breakpointService.getBreakpointsMap(); 

    this.menuService.onItemSelect() 
        .pipe(takeUntil(this.destroyed$))
        .subscribe((event: { tag: string, item: any }) => {
          if (document.documentElement.clientWidth < sm){
            this.sidebarService.collapse('menu-sidebar');
          }
      });
    }

    ngOnDestroy() {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    }
}
