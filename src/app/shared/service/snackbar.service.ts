import { inject, Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { concatMap, Observable, Subject } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { PxToRemPipe } from '@app/shared/pipe/px-to-rem.pipe';
import { DEFAULT_SNACKBAR_DURATION } from '@core/core.constants';
import { NotificationSnackbarComponent } from '@shared/components/notification-snackbar/notification-snackbar.component';
import {
  NotificationSnackbarData,
  SnackbarTask,
} from '@shared/components/notification-snackbar/notification-snackbar.model';
import { NOTIFICATION_SNACKBAR_LOCALIZATION } from '@shared/components/notification-snackbar/notification-snackbar.constants';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly pxToRemPipe = inject(PxToRemPipe);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly snackBarQueue = new Subject<SnackbarTask>();

  constructor() {
    this.snackBarQueue.pipe(concatMap((snackbarData) => this.processTask(snackbarData))).subscribe();
  }

  public success(
    message: string = NOTIFICATION_SNACKBAR_LOCALIZATION.success,
    duration: number = DEFAULT_SNACKBAR_DURATION,
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

  public warning(
    message: string = NOTIFICATION_SNACKBAR_LOCALIZATION.warning,
    duration: number = DEFAULT_SNACKBAR_DURATION,
  ): void {
    this.queueTask({
      type: 'component',
      component: NotificationSnackbarComponent,
      config: {
        data: {
          title: message,
          icon: 'warning',
          titleFontSize: this.pxToRemPipe.transform('16px'),
        },
        duration,
        panelClass: 'snackbar-panel',
      },
    });
  }

  public danger(
    message: string = NOTIFICATION_SNACKBAR_LOCALIZATION.danger,
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

  private processTask(task: SnackbarTask): Observable<MatSnackBarDismiss> {
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
  ): Observable<MatSnackBarDismiss> {
    return this.matSnackBar.open(message, action, config).afterDismissed();
  }

  private showComponentSnackbar<T, D>(
    component: ComponentType<T>,
    config?: MatSnackBarConfig<D>,
  ): Observable<MatSnackBarDismiss> {
    return this.matSnackBar.openFromComponent<T, D>(component, config).afterDismissed();
  }

  private showTemplateSnackbar<T>(
    template: TemplateRef<T>,
    config?: MatSnackBarConfig,
  ): Observable<MatSnackBarDismiss> {
    return this.matSnackBar.openFromTemplate(template, config).afterDismissed();
  }
}
