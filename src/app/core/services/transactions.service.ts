import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthenticationService } from './authentication.service';

const transactionOne = `{
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
    _id
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
}`;

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
        _id
      }
      comments {
        _id
        comment
        issue
        createdAt
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

  constructor(
    private apollo: Apollo,
    private authService: AuthenticationService
  ) {}

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
      .then((res: any) => {
        this.stores = res.data.storeMany;
      })
      .catch((e) => {
        console.error(e);
      });

    return this.stores;
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
      .then((res: any) => {
        this.clients = res.data.clientMany;
      })
      .catch((e) => {
        console.error(e);
      });

    return this.clients;
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
      .then((res: any) => {
        this.currencies = res.data.currencyMany;
      })
      .catch((e) => {
        console.error(e);
      });

    return this.currencies;
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
          user:"${this.authService.user._id}"
        }){
          record{
            _id
            comment
            issue
            createdAt
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
    let hasCurrency = !!deposit.currency
      ? `currency: "${deposit.currency}"`
      : '';
    let hasFee = !!deposit.fee ? `fee: ${deposit.fee}` : '';
    let hasClient = !!deposit.clientId ? `clientId: "${deposit.clientId}"` : '';

    return this.apollo.mutate({
      mutation: gql`
        mutation {
          makeDeposit(
            storeId: "${deposit.storeId}"
            date: "${deposit.date}"
            description: "${deposit.description}"
            amount: ${deposit.amount}
            ${hasClient}
            ${hasFee}
            ${hasCurrency}
          ) ${transactionOne}
        }
      `,
    });
  }

  makeWithdraw(deposit: any) {
    let hasCurrency = !!deposit.currency
      ? `currency: "${deposit.currency}"`
      : '';
    let hasFee = !!deposit.fee ? `fee: ${deposit.fee}` : '';
    let hasClient = !!deposit.clientId ? `clientId: "${deposit.clientId}"` : '';

    return this.apollo.mutate({
      mutation: gql`
        mutation {
          makeWithdraw(
            storeId: "${deposit.storeId}"
            date: "${deposit.date}"
            description: "${deposit.description}"
            amount: ${deposit.amount}
            ${hasClient}
            ${hasFee}
            ${hasCurrency}
          ) ${transactionOne}
        }
      `,
    });
  }

  makeLoan(deposit: any) {
    let hasCurrency = !!deposit.currency
      ? `currency: "${deposit.currency}"`
      : '';
    let hasFee = !!deposit.fee ? `fee: ${deposit.fee}` : '';
    let hasClient = !!deposit.clientId ? `clientId: "${deposit.clientId}"` : '';

    return this.apollo.mutate({
      mutation: gql`
        mutation {
          makeLoan(
            storeId: "${deposit.storeId}"
            date: "${deposit.date}"
            description: "${deposit.description}"
            amount: ${deposit.amount}
            ${hasClient}
            ${hasFee}
            ${hasCurrency}
          ) ${transactionOne}
        }
      `,
    });
  }

  makeTrade(trade: any) {
    let hasCurrency = !!trade.currency
      ? `currency: "${trade.currency}"`
      : '';
  
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          makeTrade(
            Store: "${trade.Store}"
            vendorId: "${trade.vendorId}"
            date: "${trade.date}"
            description: "${trade.description}"
            amount: ${trade.amount}
            ${hasCurrency}
          ) ${transactionOne}
        }
      `,
    });
  }

  makeTransfer(deposit: any) {
    let hasCurrency = !!deposit.currency
      ? `currency: "${deposit.currency}"`
      : '';
    let hasFee = !!deposit.fee ? `fee: ${deposit.fee}` : '';

    return this.apollo.mutate({
      mutation: gql`
        mutation {
          makeWithdraw(
            fromStore: "${deposit.fromStore}"
            toEntity: "${deposit.toEntity}"
            date: "${deposit.date}"
            description: "${deposit.description}"
            amount: ${deposit.amount}
            ${hasFee}
            ${hasCurrency}
          ) ${transactionOne}
        }
      `,
    });
  }
}
