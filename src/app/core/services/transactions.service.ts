import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const transactionMany = gql`
  {
    transactionMany {
      type
      createdAt
      status
      direction
      description
      user {
        name
      }
      store {
        name
      }
      comments {
        _id
        comment
        issue
        user {
          name
        }
      }
      posts {
        date
        type
        details
        ammount
        fee
        currency {
          symbol
        }
        user {
          name
        }
      }
      currency {
        symbol
      }
      client {
        name
        surname
      }
      _id
    }
  }
`;

const storeMany = gql`
  {
    storeMany {
      _id
      name
    }
  }
`;

const clientMany = gql`
  {
    clientMany {
      _id
      name
      surname
    }
  }
`;

const currencyMany = gql`
  {
    currencyMany {
      _id
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  stores: any[] = [];
  clients: any[] = [];
  currencies: any[] = [];

  constructor(private apollo: Apollo) {
  }

  // QUERIES
  getTransactions() {
    return this.apollo.query({
      query: transactionMany,
    });
  }

  async getStores() {
    if (this.stores.length > 0) {
      return this.stores;
    }

    await this.apollo
      .query({
        query: storeMany,
      })
      .toPromise()
      .then((res:any) => {
        this.stores = res.data.storeMany
      })
      .catch((e) => {
        console.error(e);
      });

    return this.stores
  }

  async getClients() {
    if (this.clients.length > 0) {
      return this.clients;
    }

    await this.apollo
      .query({
        query: clientMany,
      })
      .toPromise()
      .then((res:any) => {
        this.clients = res.data.clientMany
      })
      .catch((e) => {
        console.error(e);
      });

    return this.clients
  }

  async getCurrencies() {
    if (this.currencies.length > 0) {
      return this.currencies;
    }

    await this.apollo
      .query({
        query: currencyMany,
      })
      .toPromise()
      .then((res:any) => {
        this.stores = res.data.currencyMany
      })
      .catch((e) => {
        console.error(e);
      });

    return this.stores
  }

  // MUTATIONS //
  addComment(transactionId: string, comment: string, issue: string) {
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        commentCreateOne(record:{
          transaction:"${transactionId}"
          comment:"${comment}"
          issue:${issue}
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
      `,
    });
  }

  makeDeposit(deposit: any) {
    let hasCurrency = !!deposit.currency ? `currency: ${deposit.currency}` : ''
    let hasFee = !!deposit.fee ? `fee: ${deposit.fee}` : ''


    return this.apollo.mutate({
      mutation: gql`
        mutation {
          makeDeposit(
            storeId: "${deposit.storeId}"
            date: "${deposit.date}"
            description: "${deposit.description}"
            clientId: "${deposit.clientId}"
            ammount: ${deposit.amount}
            ${hasFee}
            ${hasCurrency}
          ) {
            type
            createdAt
            status
            direction
            description
            user {
              name
            }
            store {
              name
            }
            comments {
              _id
              comment
              user {
                name
              }
            }
            posts {
              date
              type
              details
              ammount
              fee
              currency {
                symbol
              }
              user {
                name
              }
            }
            currency {
              symbol
            }
            client {
              name
              surname
            }
            _id
          }
        }
      `,
    });
  }
}
