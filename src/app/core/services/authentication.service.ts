import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env';
import { Apollo, gql } from 'apollo-angular';
import { MessageService } from '../helper-services/message.service';
import { SocialTokenResponse } from '../models/socialTokenResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  jwtHelper: JwtHelperService;
  decodedToken: any;
  user: any;
  token: any;
  role!: string;
  username!: string;

  constructor(
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
        ){
          message
        }
      }
      `
    })
  }

  resetForgotPassword(newPassword: string, token: string){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        resetforgotPassword(
          new:"${newPassword}"
          token:"${token}"
        ){
          message
        }
      }
      `
    })
  }
}
