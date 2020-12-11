import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
