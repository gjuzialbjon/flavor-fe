import { Store } from './store';
import { Account } from './account';

export interface User {
    email: string
    name: string
    image: string
    role: string
    passsword: string
    confirmed: Boolean
    stores: [Store]
    accounts: [Account]
    _id: string
}