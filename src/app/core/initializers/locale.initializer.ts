import { LOCALE_KEY } from '@app/app.constants';
import { Locale, LocaleJson } from '@app/app.models';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { firstValueFrom, tap } from 'rxjs';
import { LocaleLoaderService } from '@shared/service/locale-loader.service';
import { loadTranslations } from '@angular/localize';
import { inject } from '@angular/core';
import { dispatch } from '@ngxs/store';
import { SetLocale } from '@app/state/app.actions';

export const localeInitializer = (): Promise<LocaleJson> => {
  const localeLoaderService = inject(LocaleLoaderService);
  const localStorageService = inject(LocalStorageService);
  const setLocale = dispatch(SetLocale);
  //eslint-disable-next-line
  const currentLocale: Locale = localStorageService.get<Locale>(LOCALE_KEY) || 'ru';
  return firstValueFrom(
    localeLoaderService.getLocale(currentLocale).pipe(
      tap(({ locale, translations }) => {
        loadTranslations(translations);
        setLocale(locale);
      }),
    ),
  );
};
