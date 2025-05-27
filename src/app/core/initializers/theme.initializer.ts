import { THEME_KEY } from '@app/app.constants';
import { Theme } from '@app/app.models';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetTheme } from '@app/state/app.actions';

export const themeInitializer = (): Promise<void> => {
  const localStorageService = inject(LocalStorageService);
  const store = inject(Store);
  const currentTheme: Theme | null = localStorageService.get<Theme>(THEME_KEY);
  //eslint-disable-next-line
  store.dispatch(new SetTheme(currentTheme || 'system'));

  return Promise.resolve();
};
