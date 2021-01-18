import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // CHECK IF TOKEN EXISTS AND HAS NOT EXPIRED
    if(this.authService.isTokenExpired()){
      this.router.navigateByUrl('/auth/login')
      return false
    } else {
      // CHECK IF USER IN CONFIRMED
      if(!!this.authService.user && !this.authService.user.confirmed){
        this.router.navigateByUrl('/auth/not-authorized')
        console.error('User unconfirmed')
        return false
      } else {
        // CHECK IF ROLE HAS PERMISSION TO ACCESS PAGE
        if(route.data.roles.includes(this.authService.user.role)){
          return true
        } else {
          alert('Not enough permissions to visit this page')
          return false
        }
      }
    }

  }
  
}
