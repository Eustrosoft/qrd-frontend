import { InjectionToken } from '@angular/core';

export interface ErrorButton {
  buttonText: string;
  buttonAction: (() => void) | null;
}

export interface ErrorConfig {
  title: string;
  message: string;
  icon: string;
  buttonList: ErrorButton[];
  onInit: (() => void) | null;
  onDestroy: (() => void) | null;
}

export const ERROR_CONFIG = new InjectionToken<ErrorConfig>('ERROR_CONFIG');
