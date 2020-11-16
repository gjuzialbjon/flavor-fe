import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './theme/base/base.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children:[
      { 
        path: 'dashboard', 
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      { 
        path: 'users', 
        loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule),
      },
      { 
        path: 'transactions', 
        loadChildren: () => import('./views/transactions/transactions.module').then(m => m.TransactionsModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule) 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
