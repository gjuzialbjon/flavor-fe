import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './theme/base/base.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children:[
      { 
        path: 'clients', 
        loadChildren: () => import('./views/clients/clients.module').then(m => m.ClientsModule),
      },
      { 
        path: 'stores', 
        loadChildren: () => import('./views/stores/stores.module').then(m => m.StoresModule),
      },
      { 
        path: 'transactions', 
        loadChildren: () => import('./views/transactions/transactions.module').then(m => m.TransactionsModule),
      },
      { 
        path: 'reports', 
        loadChildren: () => import('./views/reports/reports.module').then(m => m.ReportsModule),
      },
      { 
        path: 'settings', 
        loadChildren: () => import('./views/settings/settings.module').then(m => m.SettingsModule),
      },
      { 
        path: 'profile', 
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule),
      },
      { 
        path: 'search', 
        loadChildren: () => import('./views/search/search.module').then(m => m.SearchModule),
      },
      { 
        path: '', 
        redirectTo: 'transactions',
        pathMatch: 'full'
      },
    ]
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule) 
  },

  // TO DO - NOT FOUND PAGE
  // {
  //   path: '**',
  //   redirectTo: 'auth',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', onSameUrlNavigation:'ignore'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
