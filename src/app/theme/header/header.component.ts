import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isNavbarCollapsed = true;
  fullName = 'albjon gjuzi'

  constructor(
    private authService: AuthenticationService,
    ) { }

  ngOnInit(): void {
  }
}
