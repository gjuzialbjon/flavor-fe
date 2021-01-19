import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientCardComponent implements OnInit {
  @Input() name: string = '';
  @Input() balance: number = 3444434;
  @Input() id: string = '234234';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToClient(){
    this.router.navigate(['clients', this.id])
  }

}
