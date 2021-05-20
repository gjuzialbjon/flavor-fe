import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthenticationService } from './authentication.service';
import { environment } from '@env';

const transactionOne = `{
  type
  createdAt
  status
  direction
  revenue
  issue
  default_fee
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
  toStore {
    name
    _id
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
  default_fee
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
    crypto_ammount
    price_current
    total_bought
    from_account
    fee
    service_fee
    conversion_fee
    client{
      name
      surname
      _id
    }
    toStore {
      name
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

	constructor(private apollo: Apollo, private authService: AuthenticationService) {}

	// QUERIES
	getTransactions(storeId?: string, clientId?: string) {
		let storeFilter = !!storeId ? `in:["${storeId}"]` : ``;
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

	getCryptoTransfers(transactionId: string) {
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
              transactions(filter: { type: transfer  cryptoOrigin:"${transactionId}" }) ${transactionOne}
            }
          }
        }
      `,
		});
	}

	getClientCryptoPosts(clientId: string) {
		return this.apollo.query({
			query: gql`{
        clientMany(filter:{
          _id:"${clientId}"
        }){
          crypto_posts{
            date
            type
            details
            ammount
            crypto_ammount
            price_current
            total_bought
            from_account
            fee
            service_fee
            conversion_fee
          }
        }
      }`,
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
          ) ${transactionOne}
        }
      `,
		});
	}

	makeWithdraw(deposit: any) {
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
          ) ${transactionOne}
        }
      `,
		});
	}

	makeLoan(deposit: any) {
		let hasCurrency = !!deposit.currency ? `currency: "${deposit.currency}"` : '';
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

	makeTransfer(transfer: any) {
		let hasCurrency = !!transfer.currency ? `currency: "${transfer.currency}"` : '';
		let hasFee = !!transfer.fee ? `fee: ${transfer.fee}` : '';
		let hasToStore = !!transfer.toStore ? `toStore: "${transfer.toStore}"` : '';
		let hasTransferOrigin = !!transfer.transfer_origin ? `transaction_origin: "${transfer.transfer_origin}"` : '';

		return this.apollo.mutate({
			mutation: gql`
        mutation {
          makeTransfer(
            fromStore: "${transfer.fromStore}"
            toEntity: "${transfer.toEntity}"
            date: "${transfer.date}"
            description: "${transfer.description}"
            amount: ${transfer.amount}
            ${hasFee}
            ${hasCurrency}
            ${hasToStore}
            ${hasTransferOrigin}
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

	withdrawTransaction(transactionId: string) {
		return this.apollo.mutate({
			mutation: gql`mutation{
        withdrawTransaction(
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
          date:"${date.toISOString().split('T')[0]}"
          description:""
          Store: "${transaction.Store}"
          default_fee: ${transaction.default_fee}
        )${transactionOne}
      }`,
		});
	}

	makeCryptoSale(sale: any) {
		let hasClient = !!sale.client ? `client: "${sale.client}"` : '';
		let hasToStore = !!sale.toStore ? `toStore: "${sale.toStore}"` : '';

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
            conversion_fee: ${sale.conversion_fee}
            service_fee: ${sale.service_fee}
            description: "${sale.description}"
            date:"${date.toISOString()}"
            ${hasClient}
            ${hasToStore}
          ) {
            createdAt
          }
        }
      `,
		});
	}

	updatePostClient(postId: string, clientId: string) {
		return this.apollo.mutate({
			mutation: gql`
      mutation {
        postUpdateById(record:{
          _id:"${postId}"
          client:"${clientId}"
        }){
          record{
            _id
            client {
              name
            }
          }
        }
      }
      `,
		});
	}
}
