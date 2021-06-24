import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
} from "@nebular/theme";
import { ReplaySubject } from "rxjs";

import { map, tap, takeUntil } from "rxjs/operators";
import { ConfigsService } from "src/app/core/helper-services/configs.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  items: NbMenuItem[];

  constructor(
    private router: Router,
    private menuService: NbMenuService,
    private breakpointService: NbMediaBreakpointsService,
    private sidebarService: NbSidebarService,
    private chRef: ChangeDetectorRef,
    private configsService: ConfigsService,
    private authService: AuthenticationService
  ) {
    let menuItems = this.configsService.getMenuByRole();

    if (this.authService.hasCryptoStore()) {
      this.items = [
        ...menuItems.slice(0, 3),
        {
          title: "BTC",
          link: "/btc",
          icon: {
            icon: "btc",
            pack: "brand",
          },
          pathMatch: "prefix",
        },
				...menuItems.slice(3, menuItems.length)
      ];
    } else {
			this.items = menuItems
    }
  }

  ngOnInit(): void {
    const { sm } = this.breakpointService.getBreakpointsMap();

    if (document.documentElement.clientWidth > 1190) {
      this.sidebarService.compact();
    }

    this.menuService
      .onItemSelect()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: { tag: string; item: any }) => {
        if (document.documentElement.clientWidth < sm) {
          this.sidebarService.collapse("menu-sidebar");
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

const insert = (arr: any[], index: number, newItem: any) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index),
];
