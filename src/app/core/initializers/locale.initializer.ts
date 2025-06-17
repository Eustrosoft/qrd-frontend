import { DEFAULT_LOCALE, LOCALE_KEY } from '@app/app.constants';
import { Locale } from '@app/app.models';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { inject } from '@angular/core';
import { dispatch } from '@ngxs/store';
import { SetLocale } from '@app/state/app.actions';

export const localeInitializer = (): Promise<void> => {
  const localStorageService = inject(LocalStorageService);
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const currentLocale: Locale = localStorageService.get<Locale>(LOCALE_KEY) || DEFAULT_LOCALE;
  dispatch(SetLocale)(currentLocale);
  return Promise.resolve();
};
