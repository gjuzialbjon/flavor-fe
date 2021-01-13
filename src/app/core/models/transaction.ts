import { Client } from './client';
import { Currency } from './currency';
import { Post } from './post';
import { Store } from './store';
import { User } from './user';

export interface Transaction {
    type: string
    status: string
    direction: string
    description: string
    user: User
    createdAt: string
    store: Store
    posts: [Post]
    currency: Currency
    client: Client
    _id: string
}