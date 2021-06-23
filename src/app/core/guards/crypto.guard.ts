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
    return new Promise((resolve, reject) => {
      this.authService
        .hasCryptoStore()
        .then((res) => {
          let userStores = (res as any).data.userById.rstores as Store[];
          console.log(userStores);

          let hasCrypto = userStores.find(
            (v) => v._id === environment.btc_store_id
          );
          if (!!hasCrypto) {
            resolve(true);
          } else {
            resolve(false);
            this.returnToOtherPage();
          }
        })
        .catch((e) => {
          console.error(e);
          this.returnToOtherPage();
          resolve(false);
        });
    });
  }

  returnToOtherPage() {
    if (this.router.url.length < 3) {
      if (
        this.authService.user.role === "admin" ||
        this.authService.user.role === "agent"
      ) {
        this.router.navigateByUrl("/stores");
      } else if (this.authService.user.role === "finance") {
        this.router.navigateByUrl("/reports");
      } else {
        console.error("Unknown role in base component");
      }
    }
  }
}
