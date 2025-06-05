import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BackendError, ErrorHandlerStrategy } from '@modules/error/error.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { ErrorsLocalization, UnknownBackendError } from '@modules/error/error.constants';
import { ErrorMessageSnackbarComponent } from '@modules/error/components/error-message-snackbar/error-message-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class JsonErrorHandlerStrategy implements ErrorHandlerStrategy {
  private readonly matSnackBar = inject(MatSnackBar);

  public handleError(err: HttpErrorResponse): Observable<never> {
    const errors: BackendError[] = err?.error?.errors?.map((error: Partial<BackendError>) => ({
      title: error?.title ?? ErrorsLocalization.unknownErr,
      detail: error?.detail ?? ErrorsLocalization.smthWentWrong,
      code: error?.code ?? 0,
      status: error?.status ?? 0,
    })) ?? [UnknownBackendError];
    this.matSnackBar.openFromComponent<ErrorMessageSnackbarComponent, BackendError[]>(ErrorMessageSnackbarComponent, {
      data: errors,
      panelClass: 'error-message-snackbar-panel',
    });
    return throwError(() => err);
  }
}
