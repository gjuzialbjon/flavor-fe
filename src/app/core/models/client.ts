import { Store } from './store';
import { User } from './user';
import { Account } from './account';

export interface Client {
    name: String
    surname: String
    location: String
    description: String
    user: User
    stores: [Store]
    accounts: [Account]
    _id: string
}