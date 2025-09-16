import { inject } from '@angular/core';
import { ActionCompletion, Actions, dispatch, ofActionCompleted } from '@ngxs/store';
import { FetchConfig, FetchLayoutConfig } from '@app/state/app.actions';
import { firstValueFrom, zip } from 'rxjs';
import { Locale } from '@app/app.models';
import { DEFAULT_LOCALE, LOCALE_KEY } from '@app/app.constants';
import { LocalStorageService } from '@shared/service/local-storage.service';

export const configInitializer = ():
  | Promise<[ActionCompletion<FetchConfig>, ActionCompletion<FetchLayoutConfig>]>
  | Promise<void> => {
  const actions = inject(Actions);
  const localStorageService = inject(LocalStorageService);

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const currentLocale: Locale = localStorageService.get<Locale>(LOCALE_KEY) || DEFAULT_LOCALE;

  dispatch(FetchConfig)();
  dispatch(FetchLayoutConfig)(currentLocale);

  return firstValueFrom(
    zip([actions.pipe(ofActionCompleted(FetchConfig)), actions.pipe(ofActionCompleted(FetchLayoutConfig))]),
  );
};
