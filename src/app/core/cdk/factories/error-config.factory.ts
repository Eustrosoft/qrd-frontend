import { ErrorConfig } from '@cdk/tokens/error-config.token';
import { ErrorsLocalization } from '@app/pages/error-page/error-page.constants';

export const errorConfigFactory = (config: Partial<ErrorConfig> = {}): ErrorConfig => ({
  title: config.title ?? ErrorsLocalization.unknownErr,
  message: config.message ?? ErrorsLocalization.smthWentWrong,
  icon: config.icon ?? 'world',
  buttonList: config.buttonList ?? [],
  onInit: config.onInit ?? null,
  onDestroy: config.onDestroy ?? null,
});
