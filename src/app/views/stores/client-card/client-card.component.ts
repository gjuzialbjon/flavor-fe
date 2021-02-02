import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientCardComponent implements OnInit {
  @Input() name: string = '';
  @Input() surname: string = ''
  @Input() balance: number = 0;
  @Input() id: string = '0000';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToClient(){
    this.router.navigate(['clients', this.id])
  }
}
