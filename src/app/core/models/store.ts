import { Client } from './client';
import { Currency } from './currency';
import { Account } from './account';
import { User } from './user';

export interface Store {
    name: string
    location: string
    description: string
    default_currency: Currency
    users: [User]
    clients: [Client]
    accounts: [Account]
    createdAt: string
    _id: string
}