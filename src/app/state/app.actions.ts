import { Locale, Theme, ThemeContrast } from '@app/app.models';

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
