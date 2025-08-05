import { EnvironmentProviders, provideAppInitializer } from '@angular/core';
import { themeInitializer } from '@core/initializers/theme.initializer';
import { localeInitializer } from '@core/initializers/locale.initializer';
import { authInitializer } from '@core/initializers/auth.initializer';
import { customIconsInitializer } from '@core/initializers/custom-icons.Initializer';
import { settingsInitializer } from '@core/initializers/settings.initializer';

export function provideInitializers(): EnvironmentProviders[] {
  return [
    provideAppInitializer(() => themeInitializer()),
    provideAppInitializer(() => localeInitializer()),
    provideAppInitializer(() => authInitializer()),
    provideAppInitializer(() => customIconsInitializer()),
    provideAppInitializer(() => settingsInitializer()),
  ];
}
