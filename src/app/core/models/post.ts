import { Transaction } from './transaction';
import { Client } from './client';
import { Currency } from './currency';
import { Store } from './store';
import { User } from './user';
import { Account } from './account';

export interface Post {
    date: Date
    details: string
    ammount: number
    price_in: number
    price_out: number
    currency: Currency
    user: User
    store: Store
    transaction: Transaction
    debit_account: Account
    credit_account: Account
    client: Client
    _id: string
}