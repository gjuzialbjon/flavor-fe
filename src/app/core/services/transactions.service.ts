import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthenticationService } from './authentication.service';
import * as moment from 'moment'; // add this 1 of 4
import { environment } from '@env';

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
  date
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
    _id
  }
  _id
}`;

const transactionOneForCryptos = `
{
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
    date
    type
    details
    ammount
    crypto_ammount
    price_current
    total_bought
    from_account
    fee
    client{
      name
      surname
      _id
    }
    createdAt
  }
  currency {
    symbol
  }
  client {
    name
    surname
    _id
  }
  _id
}`;

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

const myStores = gql`
  {
    Me {
      stores {
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
    let storeFilter = !!storeId
      ? `in:["${storeId}"]`
      : `nin:["${environment.btc_store_id}"]`;
    let clientFilter = !!clientId ? `client: "${clientId}"` : '';

    return this.apollo.query({
      query: gql`
      {
        Me{
          stores(filter:{
            _operators:{
              _id:{
                ${storeFilter}
              }
            }
          }){
            _id
            transactions(filter:{
              _operators:{
                type:{
                  nin: crypto
                }
              }
              ${clientFilter}
            })${transactionOne}
          }
        }
      }
      `,
    });
  }

  getCryptoTransactions() {
    return this.apollo.query({
      query: gql`
      {
        Me{
          stores(filter:{
              _operators:{
                _id:{
                  in:["${environment.btc_store_id}"]
                }
              }
            }){
            transactions(filter: { type: crypto }) 
            ${transactionOne}
          }
        }
      }
      `,
    });
  }

  getCryptoTransactionById(transactionId: string) {
    return this.apollo.query({
      query: gql`{
        transactionById(_id:"${transactionId}")${transactionOneForCryptos}
      }`,
    });
  }

  getCryptoTransfers() {
    return this.apollo.query({
      query: gql`
        {
          Me {
            stores(filter:{
              _operators:{
                _id:{
                  in:["${environment.btc_store_id}"]
                }
              }
            }) {
              transactions(filter: { type: transfer }) ${transactionOne}
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
        query: myStores,
      })
      .toPromise()
      .then((res: any) => {
        this.stores = res.data.Me.stores;
      })
      .catch((e) => {
        console.error(e);
      });

    this.stores = this.stores.filter((store) => store.name !== 'CRYPTO STORE');

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

  makeRepayment(repayment: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          repayInstallments(
            transaction: "${repayment.transaction}"
            amount: ${repayment.amount}
            entity: "${repayment.entity}"
            details: "${repayment.details}"
            date: "${repayment.date}"
          ) {
            createdAt
          }
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

  completeTransaction(transactionId: string) {
    return this.apollo.mutate({
      mutation: gql`mutation{
        closeTransaction(
          transaction:"${transactionId}"
          )${transactionOne}
      }`,
    });
  }

  createCryptoTransaction(transaction: any) {
    let date = new Date(transaction.date);
    date.setHours(12, 0, 0, 0);

    return this.apollo.mutate({
      mutation: gql`mutation{
        createCryptoTransaction(
          date:"${date.toISOString()}"
          description:"${transaction.description}"
          Store: "${transaction.Store}"
        )${transactionOne}
      }`,
    });
  }

  makeCryptoSale(sale: any) {
    let hasClient = !!sale.client ? `client: "${sale.client}"` : '';
    let date = new Date(sale.date);
    date.setHours(12, 0, 0, 0);

    return this.apollo.mutate({
      mutation: gql`
        mutation {
          makeCryptoSale(
            transaction: "${sale.transaction}"
            crypto_ammount: ${sale.crypto_ammount}
            price_current: ${sale.price_current}
            total_bought: ${sale.total_bought}
            from_account: "${sale.from_account}"
            ammount_sold: ${sale.ammount_sold}
            fee: ${sale.fee}
            ${hasClient}
            description: "${sale.description}"
            date:"${date.toISOString()}"
          ) {
            createdAt
          }
        }
      `,
    });
  }
}
