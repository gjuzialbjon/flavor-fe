import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { MessageService } from '../helper-services/message.service';
import { SocialTokenResponse } from '../models/socialTokenResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  jwtHelper: JwtHelperService
  decodedToken: any
  googleUser: SocialUser | undefined
  user: any
  token: any
  role!: string;
  username!: string

  constructor(
    private authService: SocialAuthService, 
    private router: Router, 
    private msg: MessageService, 
    private http: HttpClient) { 
      this.jwtHelper = new JwtHelperService()
      this.token = localStorage.getItem('flavorToken')
      this.initTokenAndRole()
  }

  initTokenAndRole() {
    if(!!this.token){
      this.decodedToken = this.jwtHelper.decodeToken(this.token)
      this.role = this.decodedToken.role
      this.username = localStorage.getItem('flavorUsername') + ''
    }
  }

  login(email:string, id:string, name:string){    
    this.http.post(`https${environment.API_URL}getsocialtoken`, { "email": `${email}`, "password": `${id}`, "name": `${name}` }).subscribe(
      (res: SocialTokenResponse) => {
        const token = res.token + ''
        localStorage.setItem('flavorToken', token)
        this.decodedToken = this.jwtHelper.decodeToken(res.token)
        if(this.decodedToken.confirmed){
          this.router.navigate(['stores'])
          this.msg.success('Welcome back')
        } else {
          this.router.navigate(['auth', 'not-authorized'])
        }
        
      }, e => { console.error(e); this.msg.error('Something went wrong. Please try again later.')}
    )
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      res => {
        // console.log('Logged in with google ', res)
        this.login(res.email, res.id, res.name) // CALL LOGIN PROCEDURE TO BACKEND TO GET USER TOKEN
        localStorage.setItem('flavorUsername', res.name)
        this.username = res.name
      }
    ).catch( e => { console.error(e); this.msg.error('Sorry, could not log in with Google now. Please try again later.')})
  }
 
  signOut(): void {
    // Log out from google if user has logged in with google, otherwise simply navigate to login page
    localStorage.clear()
    if(this.googleUser){
      this.authService.signOut().then(
        res => { }
      ).catch( e => { console.error(e)})
    }
  }
}
