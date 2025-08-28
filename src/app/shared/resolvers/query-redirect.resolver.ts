import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const queryRedirectResolver: ResolveFn<RedirectCommand> = (route, state) => {
  const router = inject(Router);

  const target = route.queryParamMap.get('path');
  if (!target) {
    return new RedirectCommand(router.parseUrl('/'));
  }

  return new RedirectCommand(router.parseUrl(target));
};
