import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

export interface NotificationSnackbarData {
  title: string;
  subtitle?: string;
  icon: string;
  iconClass: string;
  hideCloseButton?: boolean;
  action?: string;
}

export type SnackbarTask<T = unknown, D = unknown> =
  | { type: 'text'; message: string; action?: string; config?: MatSnackBarConfig<D> }
  | { type: 'component'; component: ComponentType<T>; config?: MatSnackBarConfig<D> }
  | { type: 'template'; template: TemplateRef<T>; config?: MatSnackBarConfig<D> };
