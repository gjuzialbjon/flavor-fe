import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { BaseComponent } from './theme/base/base.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children:[
      { 
        path: 'clients', 
        loadChildren: () => import('./views/clients/clients.module').then(m => m.ClientsModule),
        canActivate: [AuthGuard],
        data:{
          roles: ['admin', 'agent']
        }
      },
      { 
        path: 'stores', 
        loadChildren: () => import('./views/stores/stores.module').then(m => m.StoresModule),
        canActivate: [AuthGuard],
        data:{
          roles: ['admin', 'agent']
        }
      },
      { 
        path: 'transactions', 
        loadChildren: () => import('./views/transactions/transactions.module').then(m => m.TransactionsModule),
        canActivate: [AuthGuard],
        data:{
          roles: ['admin', 'agent']
        }
      },
      { 
        path: 'reports', 
        loadChildren: () => import('./views/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [AuthGuard],
        data:{
          roles: ['admin', 'finance']
        }
      },
      { 
        path: 'settings', 
        loadChildren: () => import('./views/settings/settings.module').then(m => m.SettingsModule),
        canActivate: [AuthGuard],
        data:{
          roles: ['admin']
        }
      },
      { 
        path: 'profile', 
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuard],
        data:{
          roles: ['admin', 'agent', 'finance']
        }
      },
      { 
        path: 'search', 
        loadChildren: () => import('./views/search/search.module').then(m => m.SearchModule),
        canActivate: [AuthGuard],
        data:{
          roles: ['admin', 'agent']
        }
      },
    ]
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: '**', 
    redirectTo: '/',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', onSameUrlNavigation:'ignore'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
