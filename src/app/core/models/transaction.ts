import { Client } from './client'
import { Currency } from './currency'
import { Post } from './post'
import { Store } from './store'
import { User } from './user'

export interface Transaction {
	postOrigin: any
	default_fee: number
	type: string
	status: string
	direction: string
	amount_in: number | null
	amount_out: number | null
	revenue: number | null
	description: string
	user: User
	createdAt: string
	store: Store
	toStore: Store
	comments: any[]
	posts: [Post]
	issue: boolean
	currency: Currency
	client: Client
	post_origin: string
	_id: string
}
