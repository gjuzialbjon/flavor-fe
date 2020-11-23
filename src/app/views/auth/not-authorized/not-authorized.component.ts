import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotAuthorizedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
