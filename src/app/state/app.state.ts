import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { HtmlLoaderService } from '@shared/service/html-loader.service';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { Locale, Theme } from '@app/app.models';
import { SetLocale, SetTheme } from '@app/state/app.actions';
import { patch } from '@ngxs/store/operators';
import { LOCALE_KEY, THEME_KEY } from '@app/app.constants';
import { WINDOW } from '@cdk/tokens/window.token';
import { PREFERS_DARK_TOKEN } from '@cdk/tokens/prefers-dark.token';
import { PREFERS_CONTRAST_TOKEN } from '@cdk/tokens/prefers-contrast.token';
import { Option } from '@shared/shared.models';
import { LocalesLocalization } from '@shared/shared.constants';
import { ThemePickerOverlayLocalization } from '@shared/components/theme-picker-overlay/theme-picker-overlay.constants';
import { $localize } from '@angular/localize/init';

export interface AppStateModel {
  theme: Theme;
  availableThemes: Option<Theme>[];
  availableContrast: Option<string>[];
  locale: Locale;
  availableLocales: Option<Locale>[];
}

const defaults: AppStateModel = {
  theme: 'system',
  availableThemes: [
    {
      value: 'light',
      viewValue: ThemePickerOverlayLocalization.light,
    },
    {
      value: 'dark',
      viewValue: ThemePickerOverlayLocalization.dark,
    },
    {
      value: 'system',
      viewValue: ThemePickerOverlayLocalization.system,
    },
  ],
  availableContrast: [
    {
      value: '',
      viewValue: ThemePickerOverlayLocalization.defaultContrast,
    },
    {
      value: '-mc',
      viewValue: ThemePickerOverlayLocalization.mediumContrast,
    },
    {
      value: '-hc',
      viewValue: ThemePickerOverlayLocalization.highContrast,
    },
  ],
  locale: 'ru',
  availableLocales: [
    {
      value: 'ru',
      viewValue: LocalesLocalization.ru,
    },
    {
      value: 'en-US',
      viewValue: LocalesLocalization.enUS,
    },
  ],
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
  private readonly prefersDark = inject(PREFERS_DARK_TOKEN);
  private readonly prefersContrast = inject(PREFERS_CONTRAST_TOKEN);

  @Selector()
  public static getTheme$({ theme }: AppStateModel): Theme {
    return theme;
  }

  @Selector()
  public static getAvailableThemes$({ availableThemes }: AppStateModel): Option<Theme>[] {
    return availableThemes;
  }

  @Selector()
  public static getAvailableContrast$({ availableContrast }: AppStateModel): Option<string>[] {
    return availableContrast;
  }

  @Selector()
  public static getLocale$({ locale }: AppStateModel): Locale {
    return locale;
  }

  @Selector()
  public static getAvailableLocales$({ availableLocales }: AppStateModel): Option<Locale>[] {
    return availableLocales;
  }

  @Action(SetTheme)
  public setTheme({ setState }: StateContext<AppStateModel>, { theme }: SetTheme): void {
    this.localStorageService.set(THEME_KEY, theme);
    setState(patch({ theme: theme }));
    const newTheme: Theme = this.getPreferredTheme(theme);
    const link = this.htmlLoaderService.loadLinkStylesheet(`public/themes/${newTheme}.css`, `theme-${newTheme}`);
    link.onload = (): void => {
      this.removeOldThemeStyles(newTheme);
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

  private getPreferredTheme(theme: Theme): Theme {
    if (theme === 'system') {
      if (this.prefersContrast()) {
        return this.prefersDark() ? 'dark-hc' : 'light-hc';
      }
      return this.prefersDark() ? 'dark' : 'light';
    }
    return theme;
  }

  private removeOldThemeStyles(currentTheme: string): void {
    const themeLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).filter(
      (link) => link.id.startsWith('theme-') && link.id !== `theme-${currentTheme}`,
    );
    themeLinks.forEach((link) => link.remove());
  }
}
