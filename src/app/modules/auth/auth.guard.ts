import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { select } from '@ngxs/store';
import { AuthState } from '@modules/auth/state/auth.state';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  // eslint-disable-next-line
  return select(AuthState.isAuthenticated$)() || router.getCurrentNavigation()?.previousNavigation?.extractedUrl || router.createUrlTree(['/']);
};
