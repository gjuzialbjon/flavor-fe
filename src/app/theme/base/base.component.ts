import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
