import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { HtmlLoaderService } from '@shared/service/html-loader.service';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { Locale, Theme, ThemeContrast } from '@app/app.models';
import { SetLocale, SetTheme } from '@app/state/app.actions';
import { patch } from '@ngxs/store/operators';
import { LOCALE_KEY, THEME_CONTRAST_KEY, THEME_KEY } from '@app/app.constants';
import { WINDOW } from '@cdk/tokens/window.token';
import { PREFERS_DARK_TOKEN } from '@cdk/tokens/prefers-dark.token';
import { PREFERS_CONTRAST_TOKEN } from '@cdk/tokens/prefers-contrast.token';
import { DOCUMENT } from '@angular/common';

export interface AppStateModel {
  theme: Theme;
  contrast: ThemeContrast;
  locale: Locale;
}

const defaults: AppStateModel = {
  theme: 'system',
  contrast: '',
  locale: 'en-US',
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
  private readonly document = inject(DOCUMENT);
  private readonly prefersDark = inject(PREFERS_DARK_TOKEN);
  private readonly prefersContrast = inject(PREFERS_CONTRAST_TOKEN);

  @Selector()
  public static getTheme$({ theme }: AppStateModel): Theme {
    return theme;
  }

  @Selector()
  public static getContrast$({ contrast }: AppStateModel): ThemeContrast {
    return contrast;
  }

  @Selector()
  public static getLocale$({ locale }: AppStateModel): Locale {
    return locale;
  }

  @Action(SetTheme)
  public setTheme({ getState, setState }: StateContext<AppStateModel>, payload: SetTheme): void {
    const { theme, contrast } = getState();
    const newTheme: string = this.getPreferredTheme(payload.theme, payload.contrast);
    if (newTheme === `${theme}${contrast}`) {
      return;
    }
    this.localStorageService.set(THEME_KEY, payload.theme);
    this.localStorageService.set(THEME_CONTRAST_KEY, payload.contrast);
    setState(patch({ theme: payload.theme, contrast: payload.contrast }));
    const link = this.htmlLoaderService.loadLinkStylesheet(`public/themes/${newTheme}.css`, `theme-${newTheme}`);
    link.onload = (): void => {
      this.removeOldThemeStyles(newTheme);
    };
  }

  @Action(SetLocale)
  public setLocale({ setState }: StateContext<AppStateModel>, { locale, isReloadRequired }: SetLocale): void {
    setState(patch({ locale }));
    this.localStorageService.set(LOCALE_KEY, locale);
    this.document.documentElement.setAttribute('lang', locale);

    if (isReloadRequired) {
      this.window.location.reload();
    }
  }

  private getPreferredTheme(theme: Theme, contrast: ThemeContrast): string {
    if (theme === 'system') {
      if (this.prefersContrast()) {
        return this.prefersDark() ? 'dark-hc' : 'light-hc';
      }
      return this.prefersDark() ? 'dark' : 'light';
    }
    return `${theme}${contrast}`;
  }

  private removeOldThemeStyles(currentTheme: string): void {
    const themeLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).filter(
      (link) => link.id.startsWith('theme-') && link.id !== `theme-${currentTheme}`,
    );
    themeLinks.forEach((link) => link.remove());
  }
}
