import { LOCALE_KEY } from '@app/app.constants';
import { Store } from '@ngxs/store';
import { Locale, LocaleJson } from '@app/app.models';
import { SetLocale } from '@app/state/app.actions';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { firstValueFrom, tap } from 'rxjs';
import { LocaleLoaderService } from '@shared/service/locale-loader.service';
import { loadTranslations } from '@angular/localize';

export const localeInitializer = (localStorageService: LocalStorageService, store: Store, localeLoaderService: LocaleLoaderService) => (): Promise<LocaleJson> => {
  // Используется || так как пустую строку также необходимо считать за отсутствие локали
  //eslint-disable-next-line
  const currentLocale: Locale = localStorageService.get<Locale>(LOCALE_KEY) || 'ru';
  return firstValueFrom(
    localeLoaderService.getLocale(currentLocale).pipe(
      tap(({ locale, translations }) => {
        loadTranslations(translations);
        store.dispatch(new SetLocale(locale));
      }),
    ),
  );
};
