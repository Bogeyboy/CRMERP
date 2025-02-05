import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
 /* canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  if(!this.authService.user || !this.authService.token)
    {
      this.authService.logout();
      return false;
    }
    let token = this.authService.token;
    let expiration = (JSON.parse(atob(token.split('.')[1]))).exp;
    if(Math.floor((new Date().getTime()/1000)) >= expiration)
    {
      this.authService.logout();
      return false;
    }
    return true;
  } */
}
