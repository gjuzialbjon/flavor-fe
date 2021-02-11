import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Currency } from '../models/currency';

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

  getCurrencies() {
    return this.apollo.query(
      {
        query: currencyMany
      },
    )
  }

  updateCurrency(currencyId: string, currency: Currency){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        currencyUpdateById(record:{
          _id:"${currencyId}"
          currency:"${currency.currency}"
          symbol:"${currency.symbol}"
          name:"${currency.name}"
          type:${currency.type}
        }){
          record{
            currency
            symbol
            name
            type
          }
        }
      }`
    })
  }
}
