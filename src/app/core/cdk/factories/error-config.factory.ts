import { ErrorConfig } from '@cdk/tokens/error-config.token';

import { ErrorsLocalization } from '@modules/error/error.constants';

export const errorConfigFactory = (config: Partial<ErrorConfig> = {}): ErrorConfig => ({
  title: config.title ?? ErrorsLocalization.unknownErr,
  message: config.message ?? ErrorsLocalization.smthWentWrong,
  icon: config.icon ?? 'cringe',
  buttonList: config.buttonList ?? [],
  onInit: config.onInit ?? null,
  onDestroy: config.onDestroy ?? null,
});
