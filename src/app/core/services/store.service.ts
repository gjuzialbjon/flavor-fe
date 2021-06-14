import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const storeOne = gql`
	query ($_id: MongoID!) {
		storeById(_id: $_id) {
			_id
			name
			location
			description
			revenue_sum
			balance
			createdAt
		}
	}
`;

const myStores = gql`
	{
		Me {
			rstores {
				_id
				name
				balance
				revenue_sum
			}
		}
	}
`;

@Injectable({
	providedIn: 'root',
})
export class StoreService {
	constructor(private apollo: Apollo) {}

	getMyStores() {
		return this.apollo.query({
			query: myStores,
		});
	}

	getStoreById(storeId: string) {
		return this.apollo.query({
			query: storeOne,
			variables: {
				_id: storeId,
			},
		});
	}

	createStore(store: any) {
		var mut = ` mutation{
			createStore(
				name:"${store.name}",
				location:"${store.location}",
				description:""
				){
				name
				location
				description
			}
		}`;

		// console.log(mut)
		return this.apollo.mutate({
			mutation: gql`
				${mut}
			`,
		});
	}
}
