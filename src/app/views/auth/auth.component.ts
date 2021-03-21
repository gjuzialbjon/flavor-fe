import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
