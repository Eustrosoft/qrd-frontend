import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  TitleStrategy,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { routes } from './app.routes';
import { AppState } from '@app/state/app.state';
import { provideStore, Store } from '@ngxs/store';
import { environment } from '@environment';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { providePipes } from '@core/providers/pipes.provider';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideMaterialConfig } from '@core/providers/material-options.provider';
import { provideInitializers } from '@core/providers/initializers.provider';
import { localizedDateAdapterFactory } from '@cdk/factories/localized-date-adapter.factory';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { RuDateAdapterParsePipe } from '@shared/pipe/ru-adapter-parse.pipe';
import { TemplatePageTitleStrategy } from '@cdk/classes/title-strategy.class';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { AuthState } from '@modules/auth/state/auth.state';
import { httpErrorInterceptor } from '@modules/error/http-error.interceptor';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import { APP_BASE_HREF, LocationStrategy } from '@angular/common';
import { CustomLocationStrategy } from '@cdk/classes/custom-location-strategy.class';

export const appConfig: ApplicationConfig = {
  providers: [
    provideInitializers(),
    // TODO Make zoneless, after provideZonelessChangeDetection() will come out from Developer Preview
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideStore(
      [AppState, AuthState, DictionaryRegistryState, FileUploadState],
      {
        developmentMode: !environment.production,
        selectorOptions: {
          suppressErrors: false,
        },
      },
      withNgxsReduxDevtoolsPlugin(),
    ),
    providePipes(),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideMaterialConfig(),
    {
      provide: LOCALE_ID,
      useFactory: (store: Store): string => store.selectSnapshot(AppState.getLocale$),
      deps: [Store],
    },
    provideNativeDateAdapter(),
    {
      provide: DateAdapter,
      useFactory: localizedDateAdapterFactory,
      deps: [LOCALE_ID, RuDateAdapterParsePipe],
    },
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: LocationStrategy, useClass: CustomLocationStrategy },
  ],
};
