import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export type BackendError = {
  title: string;
  detail: string;
  code: number;
  status: number;
};

export interface ErrorHandlerStrategy {
  handleError(err: HttpErrorResponse): Observable<never>;
}
