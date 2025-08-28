import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { select } from '@ngxs/store';
import { AuthState } from '@modules/auth/state/auth.state';
import { inject } from '@angular/core';
import { AppRoutes } from '@app/app.constants';

export const authGuard: CanActivateFn = (_, state): boolean | UrlTree => {
  const router = inject(Router);

  return (
    select(AuthState.isAuthenticated$)() ||
    router.createUrlTree([AppRoutes.login], {
      queryParams: { deeplink: state.url },
    })
  );
};
