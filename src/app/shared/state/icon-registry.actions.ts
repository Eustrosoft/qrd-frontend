import { Icon, IconSvgParams } from '@app/app.models';

export class GetIcon {
  public static readonly type = '[IconRegistry] Get Icon';
  constructor(
    readonly icon: Icon,
    readonly params: IconSvgParams,
  ) {}
}
