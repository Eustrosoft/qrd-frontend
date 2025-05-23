import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { HtmlLoaderService } from '@shared/service/html-loader.service';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { Locale, Theme } from '@app/app.models';
import { SetLocale, SetTheme } from '@app/state/app.actions';
import { patch } from '@ngxs/store/operators';
import { LOCALE_KEY, THEME_KEY } from '@app/app.constants';
import { WINDOW } from '@cdk/tokens/window.token';

export interface AppStateModel {
  theme: Theme;
  locale: Locale;
}

const defaults: AppStateModel = {
  theme: 'light',
  locale: 'ru',
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
  private readonly window = inject(WINDOW);

  @Selector()
  public static getTheme$({ theme }: AppStateModel): Theme {
    return theme;
  }

  @Selector()
  public static getLocale$({ locale }: AppStateModel): Locale {
    return locale;
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

  @Action(SetLocale)
  public setLocale({ setState }: StateContext<AppStateModel>, { locale, isReloadRequired }: SetLocale): void {
    setState(patch({ locale }));
    this.localStorageService.set(LOCALE_KEY, locale);
    if (isReloadRequired) {
      if (confirm($localize`Для смены языка требуется перезагрузка страницы, продолжить?`)) {
        this.window.location.reload();
      }
    }
  }

  private removeOldThemeStyles(currentTheme: string): void {
    const themeLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).filter(
      (link) => link.id.startsWith('theme-') && link.id !== `theme-${currentTheme}`,
    );
    themeLinks.forEach((link) => link.remove());
  }
}
