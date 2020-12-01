import { Client } from './client';
import { Currency } from './currency';
import { Account } from './account';
import { User } from './user';

export interface Store {
    name: String
    location: String
    description: String
    default_currency: Currency
    users: [User]
    clients: [Client]
    accounts: [Account]
    _id: string
}