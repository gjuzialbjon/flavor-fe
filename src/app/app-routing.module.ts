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
        path: 'stores', 
        loadChildren: () => import('./views/stores/stores.module').then(m => m.StoresModule),
      },
      { 
        path: 'transactions', 
        loadChildren: () => import('./views/transactions/transactions.module').then(m => m.TransactionsModule),
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
        path: '', 
        redirectTo: 'stores',
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
  imports: [CommonModule, RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
