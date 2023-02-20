import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authSerive: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authSerive.isLoggedIn()) {
        console.log('this.authSerive.isLoggedIn(): ', this.authSerive.isLoggedIn());
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
