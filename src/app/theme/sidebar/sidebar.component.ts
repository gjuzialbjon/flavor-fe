import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
} from '@nebular/theme';
import { ReplaySubject } from 'rxjs';

import { map, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  items: NbMenuItem[] = [
    // {
    //   title: 'Dashboard',
    //   link: '/dashboard',
    //   icon: {
    //     icon: 'dashboard',
    //     pack: 'menu',
    //   },
    //   pathMatch: 'prefix',
    // },
    {
      title: 'Stores',
      link: '/stores',
      icon: {
        icon: 'stores',
        pack: 'menu',
      },
      pathMatch: 'prefix',
    },
    {
      title: 'Clients',
      link: '/clients',
      icon: 'user-tie',
      pathMatch: 'prefix',
    },
    {
      title: 'Transactions',
      link: '/transactions',
      icon: {
        icon: 'transactions',
        pack: 'menu',
      },
      pathMatch: 'prefix',
    },
    {
      title: 'Reports',
      link: '/reports',
      icon: {
        icon: 'reports',
        pack: 'menu',
      },
      pathMatch: 'prefix',
    },
    {
      title: 'Settings',
      link: '/settings',
      icon: {
        icon: 'settings',
        pack: 'menu',
      },
      pathMatch: 'prefix',
    },
  ];

  constructor(
    private router: Router,
    private menuService: NbMenuService,
    private breakpointService: NbMediaBreakpointsService,
    private sidebarService: NbSidebarService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const { sm } = this.breakpointService.getBreakpointsMap();

    this.menuService
      .onItemSelect()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: { tag: string; item: any }) => {
        if (document.documentElement.clientWidth < sm) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });
  }

  ngAfterViewInit(){
    this.chRef.detectChanges()
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.chRef.detach();
  }
}
