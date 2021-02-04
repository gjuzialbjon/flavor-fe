import { Client } from './client';
import { Currency } from './currency';
import { Account } from './account';
import { User } from './user';
import { Transaction } from './transaction';

export interface Store {
  name: string;
  location: string;
  description: string;
  debit_sum: number;
  credit_sum: number;
  balance: number;
  transactions: Transaction[]
  fee_sum: number;
  revenue_sum: number;
  default_currency: Currency;
  users: [User];
  clients: [Client];
  accounts: [Account];
  createdAt: string;
  _id: string;
}
