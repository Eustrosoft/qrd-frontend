import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { AppState } from '@app/state/app.state';
import { provideStore } from '@ngxs/store';
import { environment } from '@environment';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { providePipes } from '@core/providers/pipes.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideStore(
      [AppState],
      {
        developmentMode: !environment.production,
        selectorOptions: {
          suppressErrors: false,
        },
      },
      withNgxsReduxDevtoolsPlugin(),
    ),
    providePipes(),
  ],
};
