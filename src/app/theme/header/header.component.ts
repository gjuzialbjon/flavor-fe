import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  userMenu: NbMenuItem[] = [
    {
      title: 'Profile',
      icon: 'user',
      link: '/profile',
      pathMatch: 'full',
    },
    {
      title: 'Log out',
      icon: 'sign-out-alt',
      link: '/auth',
      pathMatch: 'prefix',
    },
  ];

  searchFormControl: FormControl = new FormControl('');
  routesLength = 1;
  fullName = '';
  lastRoute = ''

  constructor(
    private authService: AuthenticationService,
    private chRef: ChangeDetectorRef,
    private sidebarService: NbSidebarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fullName = this.authService.username;
    this.chRef.detectChanges();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.routesLength = e.url.split('/').length;
        this.lastRoute = '/'
        const routes = e.urlAfterRedirects.split('/')
        for (let i = 1; i < routes.length - 1; i++) {
          this.lastRoute += routes[i]
        }
        this.chRef.detectChanges();
      });
  }

  toggle() {
    this.sidebarService.toggle(true);
  }

  waitForEnter(event: any) {
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      this.search();
    }
  }

  search() {
    this.router.navigate(['/search'], {
      queryParams: { key: this.searchFormControl.value },
    });
    this.searchFormControl.setValue('')
    this.chRef.detectChanges()
  }

  goBack() {
    this.router.navigateByUrl(this.lastRoute)
  }
}
