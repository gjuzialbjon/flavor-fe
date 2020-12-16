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
      title: 'Invites',
      icon: 'user-plus',
      responsive: true,
      route: './invites',
    },
    {
      title: 'Currencies',
      icon: 'euro-sign',
      responsive: true,
      route: './currencies',
    },
    {
      title: 'Email',
      icon: 'envelope',
      responsive: true,
      route: './email-config',
    },
  ];

  constructor(
    public route: ActivatedRoute,
    ) {

    }

  ngOnInit(): void {
  }

}
