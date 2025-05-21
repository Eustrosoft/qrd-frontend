import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, TitleStrategy, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { AppState } from '@app/state/app.state';
import { provideStore, Store } from '@ngxs/store';
import { environment } from '@environment';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { providePipes } from '@core/providers/pipes.provider';
import { provideHttpClient } from '@angular/common/http';
import { IconRegistryState } from '@shared/state/icon-registry.state';
import { provideMaterialConfig } from '@core/providers/material-options.provider';
import { provideInitializers } from '@core/providers/initializers.provider';
import { localizedDateAdapterFactory } from '@cdk/factories/localized-date-adapter.factory';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { RuDateAdapterParsePipe } from '@shared/pipe/ru-adapter-parse.pipe';
import { TemplatePageTitleStrategy } from '@cdk/classes/title-strategy.class';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideStore(
      [AppState, IconRegistryState],
      {
        developmentMode: !environment.production,
        selectorOptions: {
          suppressErrors: false,
        },
      },
      withNgxsReduxDevtoolsPlugin(),
    ),
    provideInitializers(),
    providePipes(),
    provideHttpClient(),
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
  ],
};
