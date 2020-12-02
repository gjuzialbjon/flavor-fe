import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  links = [
    { route: 'users', title: 'Users' },
    { route: 'currencies', title: 'Currencies' },
  ];

  constructor(
    public route: ActivatedRoute,
    ) {

    }

  ngOnInit(): void {
  }

}
