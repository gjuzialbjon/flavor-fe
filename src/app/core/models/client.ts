import { Store } from './store';
import { User } from './user';
import { Account } from './account';

export interface Client {
    name: string
    surname: string
    location: string
    description: string
    user: User
    stores: [Store]
    accounts: [Account]
    _id: string
}