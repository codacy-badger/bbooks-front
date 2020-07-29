import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {SocialAuthService} from "angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
      private router: Router,
      private authServiceSocial: SocialAuthService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (localStorage.getItem('token') && localStorage.getItem('token') !== 'null') {
      return true;
    }

    this.router.navigate(['']);
    return true;
  }


  public getToken(): string {
    return localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
  }

  public setToken(token) {
    localStorage.setItem('token', token);
  }

  public getUser(): JSON {
    return JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : JSON.parse(sessionStorage.getItem('user'));
  }

  public isLogged(): boolean {
    let user = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : JSON.parse(sessionStorage.getItem('user'));
    if(user !== null)
      return true;
    else
      return false;
  }

  public setUser(user): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public setSessionToken(token){
    sessionStorage.setItem('token', token);
  }

  public setSessionUser(user){
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  public login(res, keepLogin: boolean) {
    if (keepLogin) {
      this.setToken(res['token']);
      this.setUser(res);
    } else {
      this.setSessionToken(res['token']);
      this.setSessionUser(res);
    }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.authServiceSocial.signOut();
  }
}
