import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { environment } from "@env";
import { Observable, of } from "rxjs";
import { Store } from "../models/store";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root",
})
export class CryptoGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.hasCryptoStore();
  }
}
