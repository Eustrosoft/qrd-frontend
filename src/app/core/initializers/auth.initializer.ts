import { IS_AUTHENTICATED_KEY } from '@app/app.constants';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { inject } from '@angular/core';
import { RestoreAuth } from '@modules/auth/state/auth.actions';
import { ActionCompletion, Actions, dispatch, ofActionCompleted } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';

export const authInitializer = (): Promise<ActionCompletion<RestoreAuth>> | Promise<void> => {
  const localStorageService = inject(LocalStorageService);
  const actions = inject(Actions);
  const restoreAuth = dispatch(RestoreAuth);

  const isAuthenticated = !!+(localStorageService.get<string>(IS_AUTHENTICATED_KEY) ?? '0');

  if (isAuthenticated) {
    restoreAuth();
    return firstValueFrom(actions.pipe(ofActionCompleted(RestoreAuth)));
  }
  return Promise.resolve();
};
