import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientCardComponent implements OnInit {
  @Input() name: string = '';
  @Input() balance: number = 344444434;
  @Input() id: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
