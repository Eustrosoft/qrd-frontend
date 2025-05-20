import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { themeInitializer } from '@core/initializers/theme.initializer';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { Store } from '@ngxs/store';
import { localeInitializer } from '@core/initializers/locale.initializer';
import { LocaleLoaderService } from '@shared/service/locale-loader.service';

export function provideInitializers(): EnvironmentProviders[] {
  return [
    provideAppInitializer(() => themeInitializer(inject(LocalStorageService), inject(Store))()),
    provideAppInitializer(() => localeInitializer(inject(LocalStorageService), inject(Store), inject(LocaleLoaderService))()),
    // provideAppInitializer(() => authRestoreInitializer(inject(Store), inject(Actions), inject(LocalStorageService))()),
    // provideAppInitializer(() => configInitializer(inject(Store), inject(Actions), inject(Router))()),
  ];
}
