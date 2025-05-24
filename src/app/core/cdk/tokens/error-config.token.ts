import { InjectionToken } from '@angular/core';
import { Icon } from '@app/app.models';

export interface ErrorButton {
  buttonText: string;
  buttonAction: (() => void) | null;
}

export interface ErrorConfig {
  title: string;
  message: string;
  icon: Icon;
  buttonList: ErrorButton[];
  onInit: (() => void) | null;
  onDestroy: (() => void) | null;
}

export const ERROR_CONFIG = new InjectionToken<ErrorConfig>('Error config object for setting up ErrorPageComponent');
