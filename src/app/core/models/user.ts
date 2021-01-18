import { Store } from './store';
import { Account } from './account';

export interface User {
    telegramName: string
    telegramId: string
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