import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { select } from '@ngxs/store';
import { AuthSelectors } from '@modules/auth/state/auth.selectors';

export const loginGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);

  if (!select(AuthSelectors.getSlices.isAuthenticated)()) {
    return true;
  }

  return router.currentNavigation()?.previousNavigation?.extractedUrl ?? router.createUrlTree(['/']);
};
