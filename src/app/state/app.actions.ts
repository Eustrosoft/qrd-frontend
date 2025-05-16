import { Theme } from '@app/app.models';

export class SetTheme {
  public static readonly type = '[App] Set Theme';
  constructor(readonly theme: Theme) {}
}
