import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, TemplateRef } from '@angular/core'
import { Router } from '@angular/router'


@Component({
	selector: 'app-store-card',
	templateUrl: './store-card.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreCardComponent implements OnInit {
	@Input() name: string = ''
	@Input() balance: number = 0
	@Input() profit: number = 0
	@Input() id: string = ''

	constructor(private router: Router) {}

	ngOnInit(): void {}
}
