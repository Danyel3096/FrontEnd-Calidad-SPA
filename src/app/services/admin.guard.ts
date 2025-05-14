import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = this.loginService.getUserRole();

    // Permitir acceso a ADMIN o CUSTOMER
    if (role === 'ADMIN' || role === 'CUSTOMER') {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
