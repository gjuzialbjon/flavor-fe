import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Client } from 'src/app/core/models/client'
import { Post } from 'src/app/core/models/post'
import { Store } from 'src/app/core/models/store'
import { Transaction } from 'src/app/core/models/transaction'
import { SearchService } from 'src/app/core/services/search.service'

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
	keyword!: string

	clients: Client[] = []
	posts: Post[] = []
	transactions: Transaction[] = []
	stores: Store[] = []

	constructor(private route: ActivatedRoute, private searchService: SearchService, private chRef: ChangeDetectorRef) {
		this.route.queryParams.subscribe(
			(res) => {
				this.keyword = res.key
				this.performSearch()
			},
			(e) => {
				console.error(e)
			}
		)
	}

	ngOnInit(): void {}

	performSearch() {
		this.searchService.search(this.keyword).subscribe(
			(res: any) => {
				console.log(res)
				this.clients = res.data.search.clients
				this.posts = res.data.search.posts
				this.transactions = res.data.search.transactions
				this.stores = res.data.search.stores
				this.chRef.detectChanges()
			},
			(e) => {
				console.error(e)
			}
		)
	}

	ngOnDestroy() {
		// console.log('On destroy');
	}
}
