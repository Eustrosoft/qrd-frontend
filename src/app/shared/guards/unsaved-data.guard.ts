import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PxToRemPipe } from '@app/shared/pipe/px-to-rem.pipe';
import { first, Observable, of, switchMap } from 'rxjs';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { UNSAVED_FORM_DIALOG_DATA } from '@shared/components/confirmation-dialog/confirmation-dialog.constants';

export interface CanComponentDeactivate {
  canDeactivate: (isConfirmed?: boolean) => Observable<boolean>;
  isTouched: () => boolean;
}

export const unsavedDataGuard = <T extends CanComponentDeactivate>(): CanDeactivateFn<T> => {
  return (component: T) => {
    if (!component.isTouched()) {
      return of(true);
    }
    const matDialog: MatDialog = inject(MatDialog);
    const pxToRemPipe: PxToRemPipe = inject(PxToRemPipe);

    const matDialogRef = matDialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        data: UNSAVED_FORM_DIALOG_DATA,
        width: pxToRemPipe.transform('600'),
      },
    );

    return matDialogRef.afterClosed().pipe(
      switchMap((result) => component.canDeactivate(result)),
      first(),
    );
  };
};
