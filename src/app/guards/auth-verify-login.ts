import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthVerifyLogin implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        if (!this.authService.isLogged()) {
            return true;
        }
        this.router.navigateByUrl('/');
        return false;
    }
}