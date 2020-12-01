import { Currency } from './currency';
import { User } from './user';

export interface Account {
    type: string
    name: String
    description: String
    user: User
    currency: Currency
    _id: string
}