import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { MessageService } from '../helper-services/message.service'
import { AuthenticationService } from '../services/authentication.service'

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthenticationService, private router: Router, private msg: MessageService) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		// CHECK IF TOKEN EXISTS AND HAS NOT EXPIRED
		if (this.authService.isTokenExpired()) {
			this.router.navigateByUrl('/auth/login')
			return false
		} else {
			// CHECK IF USER IN CONFIRMED
			if (!!this.authService.user && !this.authService.user.confirmed) {
				this.router.navigateByUrl('/auth/not-authorized')
				console.error('User unconfirmed')
				return false
			} else {
				// CHECK IF ROLE HAS PERMISSION TO ACCESS PAGE
				if (route.data.roles.includes(this.authService.user.role)) {
					return true
				} else {
					this.msg.error('Not enough permissions to visit this page', 'Error!')
					if (this.authService.user.role === 'admin' || this.authService.user.role === 'agent') {
						this.router.navigateByUrl('/stores')
					} else if (this.authService.user.role === 'finance') {
						this.router.navigateByUrl('/reports')
					} else {
						console.error('Unknown role in base component')
					}
					return false
				}
			}
		}
	}
}
