import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private apollo: Apollo) { }

  get Stores() {
    return this.apollo.query(
      {
        query: gql `
        {
          storeMany{
            _id
            name
            description
            default_currency{
              currency
              symbol
              name
              type
            }
            location
            users{
              email
              name
            }
            clients{
              name
              surname
            }
            accounts{
              name
              type
            }
          }
        }
        `,
        fetchPolicy:"network-only"
      },
    )
  }

  createStore(store:any){
    var currency = !!store.default_currency ? `currencyID:"${store.default_currency}"` : '' // ADD CURRENCY OR NOT

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

    return this.apollo.mutate({
      mutation: gql `
        ${mut}
      `
    })
  }


}
