import { Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigsService {
  constructor(private authService: AuthenticationService) {}

  getDTOptions(): DataTables.Settings {
    return {
      pagingType: 'full',
      pageLength: 10,
      processing: true,
      responsive: true,
      // scrollCollapse: true,
      // scrollY: '500px',
    };
  }

  getTransactionDTOptions(): DataTables.Settings {
    return {
      pagingType: 'full',
      pageLength: 10,
      lengthChange: false,
      processing: true,
      responsive: true,
      dom:
        "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        //@ts-ignore
      buttons: ['copy', 'csv', 'excel', 'print'],
    };
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
    ];
  }

  getMenuByRole(): NbMenuItem[] {
    let role = this.authService.user.role;

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
      ];
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
      ];
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
      ];
    } else {
      return [];
    }
  }
}
