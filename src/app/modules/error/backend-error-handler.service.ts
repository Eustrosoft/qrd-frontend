import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorHandlerStrategy } from '@modules/error/error.models';
import { JsonErrorHandlerStrategy } from '@modules/error/strategies/json-error-handler.strategy';
import { UnauthenticatedErrorHandlerStrategy } from '@modules/error/strategies/unauthenticated-error-handler.strategy';
import { DefaultErrorHandlerStrategy } from '@modules/error/strategies/default-error-handler.strategy';

@Injectable({
  providedIn: 'root',
})
export class BackendErrorHandlerService {
  private readonly defaultErrorHandlerStrategy = inject(DefaultErrorHandlerStrategy);
  private readonly jsonErrorHandlerStrategy = inject(JsonErrorHandlerStrategy);
  private readonly unauthenticatedErrorHandlerStrategy = inject(UnauthenticatedErrorHandlerStrategy);

  public getHandler(err: HttpErrorResponse): ErrorHandlerStrategy {
    if (err.status === HttpStatusCode.Unauthorized || err.status === HttpStatusCode.Forbidden) {
      return this.unauthenticatedErrorHandlerStrategy;
    }
    if (
      err.status === HttpStatusCode.BadRequest ||
      err.status === HttpStatusCode.Conflict ||
      err.status === HttpStatusCode.InternalServerError ||
      err.status === HttpStatusCode.BadGateway ||
      err.status === HttpStatusCode.ServiceUnavailable ||
      err.status === HttpStatusCode.GatewayTimeout
    ) {
      return this.jsonErrorHandlerStrategy;
    }
    return this.jsonErrorHandlerStrategy;
  }
}
