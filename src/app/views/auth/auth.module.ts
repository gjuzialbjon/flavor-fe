import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbSpinnerModule } from '@nebular/theme';

@NgModule({
  declarations: [AuthComponent, LoginComponent, NotAuthorizedComponent],
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
          },
          {
            path: 'not-authorized',
            component: NotAuthorizedComponent
          }
        ]
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbFormFieldModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbSpinnerModule
  ]
})
export class AuthModule { }
