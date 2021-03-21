import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { Apollo } from 'apollo-angular'

@Component({
	selector: 'app-not-authorized',
	templateUrl: './not-authorized.component.html',
	styleUrls: ['./not-authorized.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotAuthorizedComponent implements OnInit {
	constructor(private apollo: Apollo) {}

	ngOnInit(): void {
		this.apollo.client.resetStore()
	}
}
