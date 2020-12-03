import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardComponent implements OnInit {
  @Input() account!: any

  constructor() { }

  ngOnInit(): void {
    console.log(this.account)
  }

}
