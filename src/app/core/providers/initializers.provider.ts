import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { themeInitializer } from '@core/initializers/theme.initializer';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { Store } from '@ngxs/store';

export function provideInitializers(): EnvironmentProviders[] {
  return [
    provideAppInitializer(() => themeInitializer(inject(LocalStorageService), inject(Store))()),
    // provideAppInitializer(() => authRestoreInitializer(inject(Store), inject(Actions), inject(LocalStorageService))()),
    // provideAppInitializer(() => configInitializer(inject(Store), inject(Actions), inject(Router))()),
  ];
}
