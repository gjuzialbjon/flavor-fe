import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { NbMenuItem } from '@nebular/theme'
import { AuthenticationService } from '../services/authentication.service'

@Injectable({
	providedIn: 'root',
})
export class ConfigsService {
	constructor(private authService: AuthenticationService, private router: Router) {}

	getDTOptions(): DataTables.Settings {
		return {
			pagingType: 'full',
			pageLength: 10,
			processing: true,
			responsive: true,
		}
	}

	getBTCDTOptions(): DataTables.Settings {
		return {
			paging: false,
			processing: true,
			responsive: true,
			dom: 'ft',
			order: []
		}
	}

	getTransactionDTOptions(): DataTables.Settings {
		return {
			pagingType: 'full',
			pageLength: 10,
			lengthChange: true,
			processing: true,
			responsive: true,
			//@ts-ignore
			buttons: [
				{
					extend: 'pdf',
					text: '<i class="fas fa-file-pdf"></i>',
					title: 'Download as PDF',
				},
				{
					extend: 'csv',
					text: '<i class="fas fa-file-csv"></i>',
				},
				{
					extend: 'copy',
					text: '<i class="fas fa-copy"></i>',
				},
				{
					extend: 'print',
					text: '<i class="fas fa-print"></i>',
				},
			],
		}
	}

	getTransactionTypes() {
		return [
			{
				_id: 'transfer',
				name: 'Transfer',
			},
			{
				_id: 'trade',
				name: 'Trade',
			},
			{
				_id: 'loan',
				name: 'Loan',
			},
			{
				_id: 'withdraw',
				name: 'Withdraw',
			},
			{
				_id: 'deposit',
				name: 'Deposit',
			},
		]
	}

	getMenuByRole(): NbMenuItem[] {
		let role = ''

		if (this.authService.user) {
			role = this.authService.user.role
		} else {
			this.router.navigateByUrl('/auth/login')
		}

		if (role === 'admin') {
			return [
				{
					title: 'Stores',
					link: '/stores',
					icon: {
						icon: 'stores',
						pack: 'menu',
					},
					pathMatch: 'prefix',
				},
				{
					title: 'Clients',
					link: '/clients',
					icon: 'user-tie',
					pathMatch: 'prefix',
				},
				{
					title: 'Transactions',
					link: '/transactions',
					icon: {
						icon: 'transactions',
						pack: 'menu',
					},
					pathMatch: 'prefix',
				},
				{
					title: 'Reports',
					link: '/reports',
					icon: {
						icon: 'reports',
						pack: 'menu',
					},
					pathMatch: 'prefix',
				},
				{
					title: 'Settings',
					link: '/settings',
					icon: {
						icon: 'settings',
						pack: 'menu',
					},
					pathMatch: 'prefix',
				},
			]
		} else if (role === 'agent') {
			return [
				{
					title: 'Stores',
					link: '/stores',
					icon: {
						icon: 'stores',
						pack: 'menu',
					},
					pathMatch: 'prefix',
				},
				{
					title: 'Clients',
					link: '/clients',
					icon: 'user-tie',
					pathMatch: 'prefix',
				},
				{
					title: 'Transactions',
					link: '/transactions',
					icon: {
						icon: 'transactions',
						pack: 'menu',
					},
					pathMatch: 'prefix',
				},
			]
		} else if (role === 'finance') {
			return [
				{
					title: 'Transactions',
					link: '/transactions',
					icon: {
						icon: 'transactions',
						pack: 'menu',
					},
					pathMatch: 'prefix',
				},
				{
					title: 'Reports',
					link: '/reports',
					icon: {
						icon: 'reports',
						pack: 'menu',
					},
					pathMatch: 'prefix',
				},
			]
		} else {
			return []
		}
	}
}
