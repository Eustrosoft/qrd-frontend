import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { select } from '@ngxs/store';
import { inject } from '@angular/core';
import { AppRoutes } from '@app/app.constants';
import { AuthSelectors } from '@modules/auth/state/auth.selectors';

export const authGuard: CanActivateFn = (_, state): boolean | UrlTree => {
  const router = inject(Router);

  return (
    select(AuthSelectors.getSlices.isAuthenticated)() ||
    router.createUrlTree([AppRoutes.login], {
      queryParams: { deeplink: state.url },
    })
  );
};
