import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env';
import { Apollo, gql } from 'apollo-angular';
import { MessageService } from '../helper-services/message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  jwtHelper: JwtHelperService;
  user: any;
  username!: string;

  constructor(
    private router: Router,
    private msg: MessageService,
    private apollo: Apollo,
    private http: HttpClient
  ) {
    this.jwtHelper = new JwtHelperService();
    this.checkIfToken()
  }

  checkIfToken(){
    const token = localStorage.getItem('flavorToken')
    if(!!token && token.length > 10){
      this.user = this.jwtHelper.decodeToken(token)
      console.log('User after app init is ', this.user);
      
    }
  }

  initApp(token: string){
    localStorage.setItem('flavorToken', token)
    this.user = this.jwtHelper.decodeToken(token)
    console.log('User after login is ', this.user)
  }

  login(email: string, password: string) {
    return this.http
      .post(`https${environment.API_URL}login`, {
        email: `${email}`,
        password: `${password}`,
      })
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
