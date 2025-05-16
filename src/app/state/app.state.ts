import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { HtmlLoaderService } from '@shared/service/html-loader.service';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { Theme } from '@app/app.models';
import { SetTheme } from '@app/state/app.actions';
import { patch } from '@ngxs/store/operators';
import { THEME_KEY } from '@app/app.constants';

export interface AppStateModel {
  theme: Theme;
}

const defaults: AppStateModel = {
  theme: 'light',
} as const;

const APP_STATE_TOKEN: StateToken<AppStateModel> = new StateToken<AppStateModel>('app');

@State<AppStateModel>({
  name: APP_STATE_TOKEN,
  defaults,
})
@Injectable()
export class AppState {
  private readonly htmlLoaderService = inject(HtmlLoaderService);
  private readonly localStorageService = inject(LocalStorageService);

  @Selector()
  public static getTheme$({ theme }: AppStateModel): Theme {
    return theme;
  }

  @Action(SetTheme)
  public setTheme({ setState, getState }: StateContext<AppStateModel>, { theme }: SetTheme): void {
    if (theme === getState().theme) {
      return;
    }
    const link = this.htmlLoaderService.loadLinkStylesheet(`public/themes/${theme}.css`, `theme-${theme}`);
    link.onload = (): void => {
      this.localStorageService.set(THEME_KEY, theme);
      setState(patch({ theme }));
      this.removeOldThemeStyles(theme);
    };
  }

  private removeOldThemeStyles(currentTheme: string): void {
    const themeLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).filter(
      (link) => link.id.startsWith('theme-') && link.id !== `theme-${currentTheme}`,
    );
    themeLinks.forEach((link) => link.remove());
  }
}
