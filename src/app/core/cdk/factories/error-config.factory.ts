import { ErrorConfig } from '@cdk/tokens/error-config.token';

export const errorConfigFactory = (config: Partial<ErrorConfig> = {}): ErrorConfig => ({
  title: config.title ?? $localize`Неизвестная ошибка`,
  message: config.message ?? $localize`Что-то пошло не так`,
  icon: config.icon ?? 'world',
  buttonList: config.buttonList ?? [],
  onInit: config.onInit ?? null,
  onDestroy: config.onDestroy ?? null,
});
