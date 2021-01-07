import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
