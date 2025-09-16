import { Locale, Theme, ThemeContrast } from '@app/app.models';
import { SettingsDto } from '@api/settings/settings-api.models';

export class SetTheme {
  public static readonly type = '[App] Set Theme';
  constructor(
    readonly theme: Theme,
    readonly contrast: ThemeContrast,
  ) {}
}

export class SetLocale {
  public static readonly type = '[App] Set Locale';
  constructor(
    readonly locale: Locale,
    readonly isReloadRequired: boolean = false,
  ) {}
}

export class FetchSettings {
  public static readonly type = '[App] Fetch Settings';
}

export class PatchSettings {
  public static readonly type = '[App] Patch Settings';
  constructor(readonly payload: Partial<SettingsDto['settings']>) {}
}

export class FetchFields {
  public static readonly type = '[App] Fetch Fields';
}

export class FetchConfig {
  public static readonly type = '[App] Fetch Config';
}

export class FetchLayoutConfig {
  public static readonly type = '[App] Fetch Layout Config';
  constructor(readonly locale: Locale) {}
}
