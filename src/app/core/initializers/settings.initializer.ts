import { inject } from '@angular/core';
import { ActionCompletion, Actions, dispatch, ofActionCompleted } from '@ngxs/store';
import { firstValueFrom, zip } from 'rxjs';
import { FetchFields, FetchSettings } from '@app/state/app.actions';
import { IS_AUTHENTICATED_KEY } from '@app/app.constants';
import { LocalStorageService } from '@shared/service/local-storage.service';

export const settingsInitializer = ():
  | Promise<[ActionCompletion<FetchSettings>, ActionCompletion<FetchFields>]>
  | Promise<void> => {
  const actions = inject(Actions);
  const localStorageService = inject(LocalStorageService);

  const isAuthenticated = !!+(localStorageService.get<string>(IS_AUTHENTICATED_KEY) ?? '0');

  if (isAuthenticated) {
    dispatch(FetchSettings)();
    dispatch(FetchFields)();
    return firstValueFrom(
      zip([actions.pipe(ofActionCompleted(FetchSettings)), actions.pipe(ofActionCompleted(FetchFields))]),
    );
  }
  return Promise.resolve();
};
