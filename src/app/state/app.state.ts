import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { HtmlRendererService } from '@shared/service/html-renderer.service';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { AppConfig, AppLayoutConfig, Locale, Theme, ThemeContrast } from '@app/app.models';
import { FetchConfig, FetchFields, FetchSettings, PatchSettings, SetLocale, SetTheme } from '@app/state/app.actions';
import { patch } from '@ngxs/store/operators';
import { AppRoutes, DEFAULT_LOCALE, LOCALE_KEY, THEME_CONTRAST_KEY, THEME_KEY } from '@app/app.constants';
import { WINDOW } from '@cdk/tokens/window.token';
import { PREFERS_DARK_TOKEN } from '@cdk/tokens/prefers-dark.token';
import { PREFERS_CONTRAST_TOKEN } from '@cdk/tokens/prefers-contrast.token';
import { Column, QrTableColumnFieldName, SettingsDto } from '@api/settings/settings-api.models';
import { SettingsService } from '@shared/service/settings.service';
import { catchError, EMPTY, Observable, of, switchMap, tap } from 'rxjs';
import { BaseQrTableCols } from '@app/pages/qr-cards/qr-cards.constants';
import { DEFAULT_SETTINGS } from '@app/pages/settings/settings.constants';
import { uniq } from '@shared/utils/functions/uniq.function';
import { ConfigService } from '@shared/service/config.service';
import { Router } from '@angular/router';

export interface AppStateModel {
  theme: Theme;
  contrast: ThemeContrast;
  locale: Locale;
  isLoadingSettings: boolean;
  isSavingSettings: boolean;
  settings: SettingsDto['settings'];
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
  private readonly router = inject(Router);
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

  @Selector()
  public static getConfigState$({
    isLoadingConfig,
    config,
  }: AppStateModel): Pick<AppStateModel, 'isLoadingConfig' | 'config'> {
    return { isLoadingConfig, config };
  }

  @Selector()
  public static getAllQrCols$({ settings, qrFieldColumns }: AppStateModel): Column[] {
    const columns = settings.qrTableColumns;

    return uniq([...columns, ...qrFieldColumns, ...BaseQrTableCols], 'name');
  }

  @Selector()
  public static getQrTableColumns$({ settings }: AppStateModel): Column[] {
    return settings.qrTableColumns;
  }

  @Selector()
  public static getEnabledQrTableColumns$({ settings }: AppStateModel): string[] {
    const columns = settings.qrTableColumns;

    return columns.reduce<string[]>((acc, col) => {
      if (col.enable && BaseQrTableCols.some((column) => column.fieldName === col.fieldName)) {
        acc.push(col.fieldName);
      }
      return acc;
    }, []);
  }

  @Selector()
  public static qrTableColumnVisibility$({ settings }: AppStateModel): Record<QrTableColumnFieldName, boolean> {
    const columns = settings.qrTableColumns;

    return {
      code_picture: columns.some((col) => col.fieldName === 'code_picture'),
      code: columns.some((col) => col.fieldName === 'code'),
      name: columns.some((col) => col.fieldName === 'name'),
      description: columns.some((col) => col.fieldName === 'description'),
      created: columns.some((col) => col.fieldName === 'created'),
      updated: columns.some((col) => col.fieldName === 'updated'),
    };
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
        this.router.navigate([AppRoutes.noConfig]);
        return EMPTY;
      }),
    );
  }
}
