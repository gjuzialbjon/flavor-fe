import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthenticationService } from './authentication.service';

const transactionOne = `{
  type
  createdAt
  status
  direction
  revenue
  issue
  amount_in
  amount_out
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
    _id
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

const vendorMany = gql`
  {
    clientMany(filter: { isVendor: true }) {
      _id
      name
      surname
      vendorType
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
  vendors: any[] = [];

  constructor(
    private apollo: Apollo,
    private authService: AuthenticationService
  ) {}

  // QUERIES
  getTransactions(storeId?: string, clientId?: string) {
    let storeFilter = !!storeId ? `store: "${storeId}"` : '';
    let clientFilter = !!clientId ? `client: "${clientId}"` : '';

    return this.apollo.query({
      query: gql`
      {
        Me{
          stores(
            filter:{
              ${storeFilter}
            }
          ){
            transactions(
              filter:{
                ${clientFilter}
              }
            )${transactionOne}
          }
        }
      }
      `,
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

  async getVendors() {
    await this.apollo
      .query({
        query: vendorMany,
      })
      .toPromise()
      .then((res: any) => {
        this.vendors = res.data.clientMany;
      })
      .catch((e) => {
        console.error(e);
      });

    return this.vendors;
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
    let hasCurrency = !!trade.currency ? `currency: "${trade.currency}"` : '';

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
          makeTransfer(
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

  updatePost(postId: string, post: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          postUpdateById(
            record: { _id: "${postId}", date: "${post.date}", details: "${post.details}", ammount: ${post.amount} }
          ) {
            record {
              date
              details
              ammount
            }
          }
        }
      `,
    });
  }
}
