import { inject } from '@angular/core';
import { ActionCompletion, Actions, dispatch, ofActionCompleted } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';
import { FetchSettings } from '@app/state/app.actions';
import { IS_AUTHENTICATED_KEY } from '@app/app.constants';
import { LocalStorageService } from '@shared/service/local-storage.service';

export const settingsInitializer = (): Promise<ActionCompletion<FetchSettings>> | Promise<void> => {
  const actions = inject(Actions);
  const localStorageService = inject(LocalStorageService);

  const isAuthenticated = !!+(localStorageService.get<string>(IS_AUTHENTICATED_KEY) ?? '0');

  if (isAuthenticated) {
    dispatch(FetchSettings)();
    return firstValueFrom(actions.pipe(ofActionCompleted(FetchSettings)));
  }
  return Promise.resolve();
};
