import { InjectionToken } from '@angular/core';
import { GenericButton, Icon } from '@app/app.models';

export interface ErrorConfig {
  title: string;
  message: string;
  icon: Icon;
  buttonList: GenericButton[];
  onInit: (() => void) | null;
  onDestroy: (() => void) | null;
}

export const ERROR_CONFIG = new InjectionToken<ErrorConfig>('Error config object for setting up ErrorPageComponent');
