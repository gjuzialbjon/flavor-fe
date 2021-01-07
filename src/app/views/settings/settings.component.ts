import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  tabs: any[] = [
    {
      title: 'Users',
      icon: 'users-cog',
      responsive: true,
      route: './users',
    },
    {
      title: 'Currencies',
      icon: 'euro-sign',
      responsive: true,
      route: './currencies',
    },
  ];

  constructor(
    public route: ActivatedRoute,
    ) {

    }

  ngOnInit(): void {
  }

}
