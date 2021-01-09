import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { Apollo, gql } from 'apollo-angular';
import { MessageService } from '../helper-services/message.service';
import { SocialTokenResponse } from '../models/socialTokenResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  jwtHelper: JwtHelperService;
  decodedToken: any;
  googleUser: SocialUser | undefined;
  user: any;
  token: any;
  role!: string;
  username!: string;

  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private msg: MessageService,
    private apollo: Apollo,
    private http: HttpClient
  ) {
    this.jwtHelper = new JwtHelperService();
  }

  login(email: string, password: string) {
    this.http
      .post(`https${environment.API_URL}login`, {
        email: `${email}`,
        password: `${password}`,
      })
      .subscribe(
        (res: SocialTokenResponse) => {
          console.log(res);
          const token = res.token + '';
          localStorage.setItem('flavorToken', token);
          this.decodedToken = this.jwtHelper.decodeToken(res.token);
          console.log(this.decodedToken);

          this.router.navigate(['stores']);
          setTimeout(() => {
            this.msg.success('', 'Welcome back!');
          }, 1500);
        },
        (e) => {
          console.error(e);
          this.msg.error(
            'Something went wrong. Please try again.',
            'Error!'
          );
        }
      );
  }

  signInWithGoogle(): void {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((res) => {
        this.login(res.email, res.id); // CALL LOGIN PROCEDURE TO BACKEND TO GET USER TOKEN
      })
      .catch((e) => {
        console.error(e);
        this.msg.error(
          'Sorry, could not log in with Google now. Please try again later.'
        );
      });
  }

  resetPassword(newPassword: string) {
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        resetPassword(
          new:"${newPassword}"
        ){
          message
        }
      }
      `,
    });
  }

  forgotPassword(email: string){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        forgotPassword(
          email:"${email}"
        )
      }
      `
    })
  }
}
