import { Store } from './store';
import { User } from './user';
import { Account } from './account';

export interface Client {
  name: string;
  surname: string;
  location: string;
  revenue: string;
  credit_sum: string;
  liability_sum: number;
  debit_sum: number;
  fee_sum: number;
  description: string;
  favorite: boolean;
  createdAt: Date;
  user: User;
  stores: [Store];
  accounts: [Account];
  _id: string;
}