import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AppRoutes } from '@app/app.constants';
import { BackendErrorHandlerService } from '@modules/error/backend-error-handler.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const backendErrorHandlerService = inject(BackendErrorHandlerService);
  // const resetUserState = dispatch(ResetUserState);

  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === HttpStatusCode.Unauthorized || err.status === HttpStatusCode.Forbidden) {
          // resetUserState();
          router.navigate([`/${AppRoutes.unauthenticated}`]);
          return throwError(() => err);
        }
        return backendErrorHandlerService.getHandler(err).handleError(err);
      }
      return throwError(() => err);
    }),
  );
};
