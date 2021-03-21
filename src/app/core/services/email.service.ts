import { Injectable } from '@angular/core'
import { gql, Apollo } from 'apollo-angular'

const emailMany = gql`
	{
		emailMany {
			_id
			email
			host
			username
			password
			port
			ssl
			updatedAt
		}
	}
`

@Injectable({
	providedIn: 'root',
})
export class EmailService {
	constructor(private apollo: Apollo) {}

	getEmailConfig() {
		return this.apollo.query({
			query: emailMany,
		})
	}
}
