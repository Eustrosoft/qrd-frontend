import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { ErrorHandlerStrategy } from '@modules/error/error.models';
import { JsonErrorHandlerStrategy } from '@modules/error/strategies/json-error-handler.strategy';
import { UnauthenticatedErrorHandlerStrategy } from '@modules/error/strategies/unauthenticated-error-handler.strategy';
import { DefaultErrorHandlerStrategy } from '@modules/error/strategies/default-error-handler.strategy';
import { SUPPRESS_HTTP_ERROR_INTERCEPTOR } from '@modules/error/error.constants';

@Injectable({
  providedIn: 'root',
})
export class BackendErrorHandlerService {
  private readonly defaultErrorHandlerStrategy = inject(DefaultErrorHandlerStrategy);
  private readonly jsonErrorHandlerStrategy = inject(JsonErrorHandlerStrategy);
  private readonly unauthenticatedErrorHandlerStrategy = inject(UnauthenticatedErrorHandlerStrategy);

  public getHandler(err: HttpErrorResponse, req: HttpRequest<unknown>): ErrorHandlerStrategy {
    if (req.context.has(SUPPRESS_HTTP_ERROR_INTERCEPTOR)) {
      return this.defaultErrorHandlerStrategy;
    }
    if (err.status === HttpStatusCode.Unauthorized) {
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
