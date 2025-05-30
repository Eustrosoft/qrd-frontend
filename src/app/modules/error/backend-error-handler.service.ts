import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerStrategy } from '@modules/error/error.models';
import { JsonErrorHandlerStrategy } from '@modules/error/strategies/json-error-handler.strategy';

@Injectable({
  providedIn: 'root',
})
export class BackendErrorHandlerService {
  private readonly jsonErrorHandlerStrategy = inject(JsonErrorHandlerStrategy);

  public getHandler(err: HttpErrorResponse): ErrorHandlerStrategy {
    return this.jsonErrorHandlerStrategy;
  }
}
