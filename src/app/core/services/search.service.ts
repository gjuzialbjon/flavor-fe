import { Injectable } from '@angular/core'
import { Apollo, gql } from 'apollo-angular'

@Injectable({
	providedIn: 'root',
})
export class SearchService {
	constructor(private apollo: Apollo) {}

	search(word: string) {
		return this.apollo.query({
			query: gql`{
        search(query: "${word}")
      }`,
		})
	}
}
