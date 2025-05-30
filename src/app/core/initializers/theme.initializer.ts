import { THEME_CONTRAST_KEY, THEME_KEY, THEMES, THEMES_CONTRAST } from '@app/app.constants';
import { Theme, ThemeContrast } from '@app/app.models';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { inject } from '@angular/core';
import { dispatch } from '@ngxs/store';
import { SetTheme } from '@app/state/app.actions';

export const themeInitializer = (): Promise<void> => {
  const localStorageService = inject(LocalStorageService);
  const setTheme = dispatch(SetTheme);

  const storedTheme = localStorageService.get<Theme>(THEME_KEY);
  const storedContrast = localStorageService.get<ThemeContrast>(THEME_CONTRAST_KEY);

  const theme = storedTheme && THEMES.has(storedTheme) ? storedTheme : 'system';
  const contrast = storedContrast && THEMES_CONTRAST.has(storedContrast) ? storedContrast : '';

  setTheme(theme, contrast);
  return Promise.resolve();
};
