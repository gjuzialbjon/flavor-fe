import { Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  constructor(
    private authService: AuthenticationService
  ) { }

  getDTOptions(): DataTables.Settings {
    return {
      pagingType: 'full',
      pageLength: 10,
      processing: true,
      responsive: true,
      // scrollCollapse: true,
      // scrollY: '500px',
    }
  }

  getTransactionTypes(){
    return [
      {
        _id: 'transfer',
        name: 'Transfer'
      },
      {
        _id: 'trade',
        name: 'Trade'
      },
      {
        _id: 'loan',
        name: 'Loan'
      },
      {
        _id: 'withdraw',
        name: 'Withdraw'
      },
      {
        _id: 'deposit',
        name: 'Deposit'
      }
    ];
  }

  getMenuByRole(): NbMenuItem[] {
    let role = this.authService.user.role

    if(role === 'admin'){
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
      ];
    } else if(role === 'agent'){
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
      ];
    } else if( role === 'finance'){
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
