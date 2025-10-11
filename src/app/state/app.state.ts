import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { HtmlRendererService } from '@shared/service/html-renderer.service';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { AppConfig, AppLayoutConfig, Locale, Theme, ThemeContrast } from '@app/app.models';
import {
  FetchConfig,
  FetchFields,
  FetchLayoutConfig,
  FetchSettings,
  FetchViewModeSettings,
  PatchSettings,
  PatchViewModeSettings,
  ResetAppState,
  SetLocale,
  SetTheme,
} from '@app/state/app.actions';
import { patch } from '@ngxs/store/operators';
import { DEFAULT_LOCALE, LOCALE_KEY, THEME_CONTRAST_KEY, THEME_KEY, VIEW_MODE_SETTINGS_KEY } from '@app/app.constants';
import { WINDOW } from '@cdk/tokens/window.token';
import { PREFERS_DARK_TOKEN } from '@cdk/tokens/prefers-dark.token';
import { PREFERS_CONTRAST_TOKEN } from '@cdk/tokens/prefers-contrast.token';
import { Column, SettingsDto } from '@api/settings/settings-api.models';
import { SettingsService } from '@shared/service/settings.service';
import { catchError, EMPTY, Observable, of, switchMap, tap } from 'rxjs';
import { BaseQrTableCols } from '@app/pages/qr-cards/qr-cards.constants';
import { DEFAULT_SETTINGS, DEFAULT_VIEW_MODE_SETTINGS } from '@app/pages/settings/settings.constants';
import { ConfigService } from '@shared/service/config.service';
import { ViewModeSettings } from '@app/pages/settings/settings.models';

export interface AppStateModel {
  theme: Theme;
  contrast: ThemeContrast;
  locale: Locale;
  isLoadingSettings: boolean;
  isSavingSettings: boolean;
  settings: SettingsDto['settings'];
  viewModeSettings: ViewModeSettings;
  isLoadingFields: boolean;
  qrFieldColumns: Column[];
  isLoadingConfig: boolean;
  config: Partial<AppConfig>;
  isLoadingLayoutConfig: boolean;
  layoutConfig: Partial<AppLayoutConfig>;
}

const defaults: AppStateModel = {
  theme: 'system',
  contrast: '',
  locale: DEFAULT_LOCALE,
  isLoadingSettings: false,
  isSavingSettings: false,
  settings: DEFAULT_SETTINGS,
  viewModeSettings: DEFAULT_VIEW_MODE_SETTINGS,
  isLoadingFields: false,
  qrFieldColumns: BaseQrTableCols,
  isLoadingConfig: false,
  config: {},
  isLoadingLayoutConfig: false,
  layoutConfig: {},
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
  private readonly configService = inject(ConfigService);
  private readonly window = inject(WINDOW);
  private readonly document = inject(DOCUMENT);
  private readonly prefersDark = inject(PREFERS_DARK_TOKEN);
  private readonly prefersContrast = inject(PREFERS_CONTRAST_TOKEN);

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

  @Action(FetchViewModeSettings)
  public fetchViewModeSettings({ setState }: StateContext<AppStateModel>): void {
    const value = this.localStorageService.get<string>(VIEW_MODE_SETTINGS_KEY);
    const parsedValue: Partial<ViewModeSettings> = JSON.parse(value ?? '{}');

    setState(
      patch({
        viewModeSettings: patch({
          cardsViewMode: parsedValue?.cardsViewMode ?? DEFAULT_VIEW_MODE_SETTINGS.cardsViewMode,
          templatesViewMode: parsedValue?.templatesViewMode ?? DEFAULT_VIEW_MODE_SETTINGS.templatesViewMode,
          templateAttrsEditViewMode:
            parsedValue?.templateAttrsEditViewMode ?? DEFAULT_VIEW_MODE_SETTINGS.templateAttrsEditViewMode,
          filesViewMode: parsedValue?.filesViewMode ?? DEFAULT_VIEW_MODE_SETTINGS.filesViewMode,
        }),
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

  @Action(PatchViewModeSettings)
  public patchViewModeSettings(
    { setState, dispatch }: StateContext<AppStateModel>,
    { payload }: PatchViewModeSettings,
  ): void {
    setState(patch({ viewModeSettings: payload }));
    this.localStorageService.set(VIEW_MODE_SETTINGS_KEY, JSON.stringify(payload));
    dispatch(FetchViewModeSettings);
  }

  @Action(FetchFields)
  public fetchFields({ setState }: StateContext<AppStateModel>): Observable<unknown> {
    setState(patch({ isLoadingFields: true }));
    return this.settingsService.getFields().pipe(
      tap({
        next: (qrFieldColumns) => {
          setState(
            patch({
              isLoadingFields: false,
              qrFieldColumns,
            }),
          );
        },
      }),
      catchError(() => {
        setState(patch({ isLoadingFields: false, qrFieldColumns: BaseQrTableCols }));
        return of(BaseQrTableCols);
      }),
    );
  }

  @Action(FetchConfig)
  public fetchConfig({ setState }: StateContext<AppStateModel>): Observable<unknown> {
    setState(patch({ isLoadingConfig: true }));
    return this.configService.fetchConfig().pipe(
      tap({
        next: (config) => {
          setState(
            patch({
              isLoadingConfig: false,
              config,
            }),
          );
        },
      }),
      catchError(() => {
        setState(patch({ isLoadingConfig: false }));
        return EMPTY;
      }),
    );
  }

  @Action(FetchLayoutConfig)
  public fetchLayoutConfig(
    { setState }: StateContext<AppStateModel>,
    { locale }: FetchLayoutConfig,
  ): Observable<unknown> {
    setState(patch({ isLoadingLayoutConfig: true }));
    return this.configService.fetchLayoutConfig(locale).pipe(
      tap({
        next: (layoutConfig) => {
          setState(
            patch({
              isLoadingLayoutConfig: false,
              layoutConfig,
            }),
          );
        },
      }),
      catchError(() => {
        setState(patch({ isLoadingLayoutConfig: false }));
        return EMPTY;
      }),
    );
  }

  @Action(ResetAppState)
  public resetAppState({ setState }: StateContext<AppStateModel>): void {
    setState(defaults);
  }
}
