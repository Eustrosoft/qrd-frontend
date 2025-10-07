import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import localeRuExtra from '@angular/common/locales/extra/ru';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import localeBgExtra from '@angular/common/locales/extra/bg';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { DOCUMENT, Injector } from '@angular/core';
import { LocaleLoaderService } from '@shared/service/locale-loader.service';
import { LOCALE_KEY } from '@app/app.constants';
import { firstValueFrom } from 'rxjs';
import { loadTranslations } from '@angular/localize';
import { Locale } from '@app/app.models';
import { HttpClient } from '@angular/common/http';
import { httpClient } from '@cdk/factories/before-bootstrap-http.factory';
import { provideBaseHref } from '@core/providers/base-href.provider';
import { WINDOW } from '@cdk/tokens/window.token';

registerLocaleData(localeRu, 'ru-RU', localeRuExtra);
registerLocaleData(localeEn, 'en-US', localeEnExtra);
registerLocaleData(localeEn, 'bg-BG', localeBgExtra);

async function initApp(): Promise<void> {
  const injector = Injector.create({
    providers: [
      { provide: DOCUMENT, useValue: document },
      { provide: HttpClient, useValue: httpClient },
      { provide: WINDOW, useValue: window },
      LocalStorageService,
      LocaleLoaderService,
      provideBaseHref(),
    ],
  });

  const localStorageService = injector.get(LocalStorageService);
  const localeLoaderService = injector.get(LocaleLoaderService);

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const currentLocale = localStorageService.get<Locale>(LOCALE_KEY) || localeLoaderService.getBrowserLang();
  const { translations } = await firstValueFrom(localeLoaderService.fetchLocale(currentLocale));
  loadTranslations(translations);

  const { AppComponent } = await import('@app/app.component');
  const { appConfig } = await import('@app/app.config');

  await bootstrapApplication(AppComponent, appConfig);
}
// eslint-disable-next-line no-console
initApp().catch((err) => console.error('App init failed', err));
