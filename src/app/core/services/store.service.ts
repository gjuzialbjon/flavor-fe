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

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private apollo: Apollo) { }

  get Stores() {
    return this.apollo.query(
      {
        query: storeMany
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

    console.log(mut);
    

    return this.apollo.mutate({
      mutation: gql `
        ${mut}
      `
    })
  }


}
