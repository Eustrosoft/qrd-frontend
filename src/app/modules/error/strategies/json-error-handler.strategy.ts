import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BackendError, ErrorHandlerStrategy } from '@modules/error/error.models';
import { Observable, throwError } from 'rxjs';
import { ErrorsLocalization, UnknownBackendError } from '@modules/error/error.constants';
import { ErrorMessageSnackbarComponent } from '@modules/error/components/error-message-snackbar/error-message-snackbar.component';
import { SnackbarService } from '@shared/service/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class JsonErrorHandlerStrategy implements ErrorHandlerStrategy {
  private readonly snackbarService = inject(SnackbarService);

  public handleError(err: HttpErrorResponse): Observable<never> {
    const errors: BackendError[] = err?.error?.errors?.map((error: Partial<BackendError>) => ({
      title: error?.title ?? ErrorsLocalization.unknownErr,
      detail: error?.detail ?? ErrorsLocalization.smthWentWrong,
      code: error?.code ?? 0,
      status: error?.status ?? 0,
    })) ?? [UnknownBackendError];
    this.snackbarService.openFromComponent<ErrorMessageSnackbarComponent, BackendError[]>(
      ErrorMessageSnackbarComponent,
      {
        data: errors,
        panelClass: 'snackbar-panel',
      },
    );
    return throwError(() => err);
  }
}
