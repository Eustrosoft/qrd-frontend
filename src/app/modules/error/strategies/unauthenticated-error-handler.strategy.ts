import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ErrorHandlerStrategy } from '@modules/error/error.models';
import { Observable, throwError } from 'rxjs';
import { AppRoutes } from '@app/app.constants';
import { dispatch } from '@ngxs/store';
import { ResetAuthState } from '@modules/auth/state/auth.actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UnauthenticatedErrorHandlerStrategy implements ErrorHandlerStrategy {
  private readonly router = inject(Router);
  private readonly resetAuthState = dispatch(ResetAuthState);

  public handleError(err: HttpErrorResponse): Observable<never> {
    this.resetAuthState();
    this.router.navigate([AppRoutes.unauthenticated]);
    return throwError(() => err);
  }
}
