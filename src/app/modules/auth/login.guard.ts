import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { select } from '@ngxs/store';
import { AuthState } from '@modules/auth/state/auth.state';

export const loginGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);

  if (!select(AuthState.isAuthenticated$)()) {
    return true;
  }

  return router.getCurrentNavigation()?.previousNavigation?.extractedUrl ?? router.createUrlTree(['/']);
};
