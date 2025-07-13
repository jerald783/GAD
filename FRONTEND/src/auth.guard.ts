import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    // ✅ Real check: replace with token, session, or API check as needed
    return !!localStorage.getItem('username');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      // 🔁 Optional: Pass return URL
      this.router.navigate(['/admin-login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state); // Reuse same logic
  }
}
