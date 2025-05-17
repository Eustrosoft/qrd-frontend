import { THEME_KEY } from '@app/app.constants';
import { Store } from '@ngxs/store';
import { Theme } from '@app/app.models';
import { SetTheme } from '@app/state/app.actions';
import { LocalStorageService } from '@shared/service/local-storage.service';

export const themeInitializer = (localStorageService: LocalStorageService, store: Store) => (): Promise<void> => {
  const currentTheme: Theme | null = localStorageService.get<Theme>(THEME_KEY);
  store.dispatch(new SetTheme(currentTheme ?? 'light'));

  return Promise.resolve();
};
