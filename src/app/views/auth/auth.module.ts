import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthComponent, LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
        children: [
          {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full'
          },
          {
            path: 'login',
            component: LoginComponent,
          }
        ]
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
