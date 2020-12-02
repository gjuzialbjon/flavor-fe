import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const currencyMany = gql `
{
  currencyMany{
    currency
    symbol
    name
    type
    _id
  }
}`

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private apollo: Apollo) { }

  get Currencies() {
    return this.apollo.query(
      {
        query: currencyMany
      },
    )
  }
}
