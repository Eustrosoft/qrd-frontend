import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { select } from '@ngxs/store';
import { AuthState } from '@modules/auth/state/auth.state';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  return (
    select(AuthState.isAuthenticated$)() ||
    // eslint-disable-next-line
    router.getCurrentNavigation()?.previousNavigation?.extractedUrl ||
    router.createUrlTree(['/'])
  );
};
