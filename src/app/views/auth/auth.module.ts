import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { NbAlertModule, NbButtonModule, NbCardModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbSpinnerModule } from '@nebular/theme';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  declarations: [AuthComponent, LoginComponent, NotAuthorizedComponent, ForgotComponent, ResetComponent],
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
            path: 'forgot',
            component: ForgotComponent,
          },
          {
            path: 'reset',
            component: ResetComponent,
          },
          {
            path: 'not-found',
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
    NbSpinnerModule,
    NbAlertModule
  ]
})
export class AuthModule { }
