import { EmbeddedViewRef, inject, Injectable, TemplateRef } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { concatMap, Subject } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { PxToRemPipe } from '@app/shared/pipe/px-to-rem.pipe';
import { DEFAULT_SNACKBAR_DURATION, DEFAULT_SUCCESS_SNACKBAR_DURATION } from '@core/core.constants';
import { NotificationSnackbarComponent } from '@shared/components/notification-snackbar/notification-snackbar.component';
import {
  NotificationSnackbarData,
  SnackbarTask,
} from '@shared/components/notification-snackbar/notification-snackbar.model';

import { NotificationSnackbarLocalization } from '@modules/error/error.constants';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly pxToRemPipe = inject(PxToRemPipe);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly snackBarQueue = new Subject<SnackbarTask>();

  constructor() {
    this.snackBarQueue.pipe(concatMap((snackbarData) => this.processTask(snackbarData).afterDismissed())).subscribe();
  }

  public success(
    message: string = NotificationSnackbarLocalization.success,
    duration: number = DEFAULT_SUCCESS_SNACKBAR_DURATION,
  ): void {
    this.queueTask({
      type: 'component',
      component: NotificationSnackbarComponent,
      config: {
        data: {
          title: message,
          icon: 'task_alt',
          iconClass: 'icon-success',
          titleFontSize: this.pxToRemPipe.transform('16px'),
        },
        duration,
        panelClass: 'snackbar-panel',
      },
    });
  }

  public showOnce(
    message: string = NotificationSnackbarLocalization.info,
    action?: string,
    icon: string = 'info',
    iconClass: string = 'icon-secondary',
    horizontalPosition?: MatSnackBarHorizontalPosition,
    verticalPosition?: MatSnackBarVerticalPosition,
    duration: number = DEFAULT_SNACKBAR_DURATION,
  ): MatSnackBarRef<NotificationSnackbarComponent> {
    return this.showComponentSnackbar(NotificationSnackbarComponent, {
      data: {
        title: message,
        icon,
        iconClass,
        titleFontSize: this.pxToRemPipe.transform('16px'),
        action,
      },
      duration,
      panelClass: 'snackbar-panel',
      horizontalPosition,
      verticalPosition,
    });
  }

  public warning(
    message: string = NotificationSnackbarLocalization.warning,
    duration: number = DEFAULT_SNACKBAR_DURATION,
  ): void {
    this.queueTask({
      type: 'component',
      component: NotificationSnackbarComponent,
      config: {
        data: {
          title: message,
          icon: 'warning',
          iconClass: 'icon-secondary',
          titleFontSize: this.pxToRemPipe.transform('16px'),
        },
        duration,
        panelClass: 'snackbar-panel',
      },
    });
  }

  public danger(
    message: string = NotificationSnackbarLocalization.danger,
    duration: number = DEFAULT_SNACKBAR_DURATION,
  ): void {
    this.queueTask({
      type: 'component',
      component: NotificationSnackbarComponent,
      config: {
        data: {
          title: message,
          icon: 'report',
          iconClass: 'icon-error',
          titleFontSize: this.pxToRemPipe.transform('16px'),
        },
        duration,
        panelClass: 'snackbar-panel',
      },
    });
  }

  public open(message: string, action?: string, config?: MatSnackBarConfig): void {
    this.queueTask({
      type: 'text',
      message,
      action,
      config,
    });
  }

  public openFromComponent<T, D>(component: ComponentType<T>, config?: MatSnackBarConfig<D>): void {
    this.queueTask({
      type: 'component',
      component,
      config,
    });
  }

  public openFromTemplate<T = unknown, D = NotificationSnackbarData>(
    template: TemplateRef<T>,
    config?: MatSnackBarConfig<D>,
  ): void {
    this.queueTask({
      type: 'template',
      template,
      config,
    });
  }

  private queueTask(task: SnackbarTask): void {
    this.snackBarQueue.next(task);
  }

  private processTask(task: SnackbarTask): MatSnackBarRef<unknown> {
    switch (task.type) {
      case 'text':
        return this.showTextSnackbar(task.message, task.action, task.config);
      case 'component':
        return this.showComponentSnackbar(task.component, task.config);
      case 'template':
        return this.showTemplateSnackbar(task.template, task.config);
      default:
        throw new Error('Unknown task type');
    }
  }

  private showTextSnackbar(
    message: string,
    action?: string,
    config?: MatSnackBarConfig,
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.matSnackBar.open(message, action, config);
  }

  private showComponentSnackbar<T, D>(component: ComponentType<T>, config?: MatSnackBarConfig<D>): MatSnackBarRef<T> {
    return this.matSnackBar.openFromComponent<T, D>(component, config);
  }

  private showTemplateSnackbar<T>(
    template: TemplateRef<T>,
    config?: MatSnackBarConfig,
  ): MatSnackBarRef<EmbeddedViewRef<T>> {
    return this.matSnackBar.openFromTemplate(template, config);
  }
}
