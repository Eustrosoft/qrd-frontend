import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { BackendErrorHandlerService } from '@modules/error/backend-error-handler.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const backendErrorHandlerService = inject(BackendErrorHandlerService);

  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        return backendErrorHandlerService.getHandler(err).handleError(err);
      }
      return throwError(() => err);
    }),
  );
};
