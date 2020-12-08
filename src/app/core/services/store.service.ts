import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const storeMany = gql `
{
  storeMany{
    _id
    name
    description
    default_currency{
      currency
      symbol
      name
    }
    location
    users{
      name
    }
    clients{
      name
    }
    accounts{
      name
    }
  }
},
`

const storeOne = gql `
query($_id: MongoID!){
  storeById(
    _id: $_id
  ){
    _id
    name
    location
    description
    default_currency{
      currency
      symbol
      name
      type
    }
    users{
      email
      name
      image
    }
    clients{
      name
      surname
      location
      description
    }
    accounts{
      type
      name
      description
      
    }
    createdAt
  }
}
`

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private apollo: Apollo) { }

  getStores(fetchPolicy: 'cache-first' | 'network-only' = 'cache-first') {
    return this.apollo.query(
      {
        query: storeMany,
        fetchPolicy: fetchPolicy
      },
    )
  }

  getStoreById(storeId: string){
    return this.apollo.query(
      {
        query: storeOne,
        variables: {
          "_id": storeId
        },
        fetchPolicy: 'network-only'
      },
    )
  }

  createStore(store:any){
    var currency = store.default_currency !== 0 ? `currencyID:"${store.default_currency}"` : '' // ADD CURRENCY OR NOT

    var mut = ` mutation{
      createStore(
        name:"${store.name}",
        location:"${store.location}", 
        description:"${store.description}" 
        ${currency}){
          name
          location
          description
          accounts{
            type
            name
          }
      }
    }`

    // console.log(mut)
    return this.apollo.mutate({
      mutation: gql `
        ${mut}
      `
    })
  }


}
