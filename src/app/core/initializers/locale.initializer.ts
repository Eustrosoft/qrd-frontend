import { LOCALE_KEY } from '@app/app.constants';
import { Locale } from '@app/app.models';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { inject } from '@angular/core';
import { dispatch } from '@ngxs/store';
import { SetLocale } from '@app/state/app.actions';
import { LocaleLoaderService } from '@shared/service/locale-loader.service';

export const localeInitializer = (): Promise<void> => {
  const localStorageService = inject(LocalStorageService);
  const localeLoaderService = inject(LocaleLoaderService);
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const currentLocale: Locale = localStorageService.get<Locale>(LOCALE_KEY) || localeLoaderService.getBrowserLang();
  dispatch(SetLocale)(currentLocale);
  return Promise.resolve();
};
