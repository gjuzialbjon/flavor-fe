import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const transactionMany = gql `
{
  transactionMany{
    type
    createdAt
    status
    direction
    description
    user{
      name
    }
    store{
      name
    }
    comments{
      _id
      comment
      user{
        name
      }
    }
    posts{
      date
      type
      details
      ammount
      fee
      currency{
        symbol
      }
      user{
        name
      }
    }
    currency{
      symbol
    }
    client{
      name
      surname
    }
    _id
  }
}`

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(
    private apollo: Apollo
  ) { }

  getTransactions(){
    return this.apollo.query({
      query: transactionMany
    })
  }

  addComment(transactionId: string, comment: string){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        commentCreateOne(record:{
          transaction:"${transactionId}"
          comment:"${comment}"
          
        }){
          record{
            _id
            comment
            user{
              name
            }
          }
        }
      }
      `
    })
  }
  
}
