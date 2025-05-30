import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { select } from '@ngxs/store';
import { AuthState } from '@modules/auth/state/auth.state';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const isAuthenticated = select(AuthState.isAuthenticated$)();
  if (isAuthenticated) {
    return true;
  }
  return router.getCurrentNavigation()?.previousNavigation?.extractedUrl ?? router.createUrlTree(['/']);
};
