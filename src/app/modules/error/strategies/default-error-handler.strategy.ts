import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerStrategy } from '@modules/error/error.models';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DefaultErrorHandlerStrategy implements ErrorHandlerStrategy {
  public handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }
}
