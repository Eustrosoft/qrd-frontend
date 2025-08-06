import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { HtmlRendererService } from '@shared/service/html-renderer.service';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { Locale, Theme, ThemeContrast } from '@app/app.models';
import { FetchSettings, PatchSettings, SetLocale, SetTheme } from '@app/state/app.actions';
import { patch } from '@ngxs/store/operators';
import { DEFAULT_LOCALE, DEFAULT_SETTINGS, LOCALE_KEY, THEME_CONTRAST_KEY, THEME_KEY } from '@app/app.constants';
import { WINDOW } from '@cdk/tokens/window.token';
import { PREFERS_DARK_TOKEN } from '@cdk/tokens/prefers-dark.token';
import { PREFERS_CONTRAST_TOKEN } from '@cdk/tokens/prefers-contrast.token';
import { SettingsDto } from '@api/settings/settings-api.models';
import { SettingsService } from '@shared/service/settings.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';

export interface AppStateModel {
  theme: Theme;
  contrast: ThemeContrast;
  locale: Locale;
  isLoadingSettings: boolean;
  isSavingSettings: boolean;
  settings: SettingsDto['settings'];
}

const defaults: AppStateModel = {
  theme: 'system',
  contrast: '',
  locale: DEFAULT_LOCALE,
  isLoadingSettings: false,
  isSavingSettings: false,
  settings: DEFAULT_SETTINGS,
} as const;

const APP_STATE_TOKEN: StateToken<AppStateModel> = new StateToken<AppStateModel>('app');

@State<AppStateModel>({
  name: APP_STATE_TOKEN,
  defaults,
})
@Injectable()
export class AppState {
  private readonly htmlLoaderService = inject(HtmlRendererService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly settingsService = inject(SettingsService);
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

  @Selector()
  public static getSettingsState$({
    isLoadingSettings,
    isSavingSettings,
    settings,
  }: AppStateModel): Pick<AppStateModel, 'isLoadingSettings' | 'isSavingSettings' | 'settings'> {
    return { isLoadingSettings, isSavingSettings, settings };
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

  @Action(FetchSettings)
  public fetchSettings({ setState }: StateContext<AppStateModel>): Observable<unknown> {
    setState(patch({ isLoadingSettings: true }));
    return this.settingsService.getSettings().pipe(
      tap({
        next: (settings) => {
          setState(
            patch({
              isLoadingSettings: false,
              settings: patch({
                language: settings?.language ?? DEFAULT_SETTINGS.language,
                qrTableColumns: settings?.qrTableColumns ?? DEFAULT_SETTINGS.qrTableColumns,
                defaultQrPrintText: settings?.defaultQrPrintText ?? DEFAULT_SETTINGS.defaultQrPrintText,
                defaultQrPrintTextDown: settings?.defaultQrPrintTextDown ?? DEFAULT_SETTINGS.defaultQrPrintTextDown,
                checkUploadSize: settings?.checkUploadSize ?? DEFAULT_SETTINGS.checkUploadSize,
              }),
            }),
          );
        },
      }),
      catchError(() => {
        setState(patch({ isLoadingSettings: false, settings: DEFAULT_SETTINGS }));
        return of(DEFAULT_SETTINGS);
      }),
    );
  }

  @Action(PatchSettings)
  public patchSettings(
    { getState, setState, dispatch }: StateContext<AppStateModel>,
    { payload }: PatchSettings,
  ): Observable<unknown> {
    setState(patch({ isSavingSettings: true }));
    const { locale, settings } = getState();
    const settingsPayload: SettingsDto['settings'] = {
      language: payload?.language ?? locale,
      qrTableColumns: payload?.qrTableColumns ?? settings?.qrTableColumns ?? DEFAULT_SETTINGS.qrTableColumns,
      defaultQrPrintText:
        payload?.defaultQrPrintText ?? settings?.defaultQrPrintText ?? DEFAULT_SETTINGS.defaultQrPrintText,
      defaultQrPrintTextDown:
        payload?.defaultQrPrintTextDown ?? settings?.defaultQrPrintTextDown ?? DEFAULT_SETTINGS.defaultQrPrintTextDown,
      checkUploadSize: payload?.checkUploadSize ?? settings?.checkUploadSize ?? DEFAULT_SETTINGS.checkUploadSize,
    };
    return this.settingsService.patchSettings(settingsPayload).pipe(
      switchMap(() => {
        setState(patch({ isSavingSettings: false }));
        return dispatch(FetchSettings);
      }),
      catchError(() => {
        setState(patch({ isSavingSettings: false, settings: DEFAULT_SETTINGS }));
        return of(DEFAULT_SETTINGS);
      }),
    );
  }
}
