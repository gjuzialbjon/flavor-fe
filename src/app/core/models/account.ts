import { Currency } from './currency';
import { User } from './user';

export interface Account {
    type: string
    name: string
    description: string
    user: User
    currency: Currency
    _id: string
}