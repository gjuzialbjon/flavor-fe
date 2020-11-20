import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isNavbarCollapsed = true;
  fullName = 'albjon gjuzi'

  constructor() { }

  ngOnInit(): void {
  }

}
