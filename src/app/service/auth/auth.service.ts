import { Injectable } from "@angular/core";
import { LoginService } from "../login/login.service";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate
} from "@angular/router";

import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService implements CanActivate {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  /**
   * Creates an instance of AuthGuardService.
   * @param {LoginService} loginService
   * @param {Router} router
   * @memberof AuthGuardService
   */
  constructor(private loginService: LoginService, private router: Router) {}

  /**
   * Check the user is logged in or not
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<boolean>}
   * @memberof AuthGuardService
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (this.loginService.isLoggedIn()) {
      this.loginService.emitLogInOut();
      return of(true);
    } else {
      //If user is not logged in move to login page
      this.router.navigateByUrl("/login");
      return of(false);
    }
  }
}
