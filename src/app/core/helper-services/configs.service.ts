import { Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

const posRanges = [
  { divider: 1000000 , suffix: 'M' },
  { divider: 1000 , suffix: 'k' }
];

const negRanges = [
  { divider: -1000000 , suffix: 'M' },
  { divider: -1000 , suffix: 'k' }
];

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  constructor() { }

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
      'transfer',
      'trade',
      'loan',
      'withdraw',
      'deposit',
    ];
  }

  getMenuByRole(): NbMenuItem[] {
    let role = 'admin'

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
