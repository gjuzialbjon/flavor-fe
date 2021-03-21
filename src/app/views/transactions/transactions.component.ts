import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-transactions',
	templateUrl: './transactions.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit {
	ngOnInit() {}
}
