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
import { ConfigsService } from 'src/app/core/helper-services/configs.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  items: NbMenuItem[]

  constructor(
    private router: Router,
    private menuService: NbMenuService,
    private breakpointService: NbMediaBreakpointsService,
    private sidebarService: NbSidebarService,
    private chRef: ChangeDetectorRef,
    private configsService: ConfigsService
  ) {
    this.items = this.configsService.getMenuByRole()
  }

  ngOnInit(): void {
    const { sm } = this.breakpointService.getBreakpointsMap();

    if(document.documentElement.clientWidth > 1190 ){
      this.sidebarService.compact()
    }

    this.menuService
      .onItemSelect()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: { tag: string; item: any }) => {
        if (document.documentElement.clientWidth < sm) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
