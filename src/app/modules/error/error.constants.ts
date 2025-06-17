import { BackendError } from '@modules/error/error.models';
import { HttpContextToken } from '@angular/common/http';

export const ErrorsLocalization = {
  unknownErr: $localize`:@@errors.unknownErr:Unknown error`,
  smthWentWrong: $localize`:@@errors.smthWentWrong:Something went wrong`,
  pageNotFound: $localize`:@@errors.notFound:Page not found`,
  unauthenticatedRoute: $localize`:@@errors.unauthenticatedRoute:Session expired`,
  unauthenticated: $localize`:@@errors.unauthenticated:Your session expired`,
  unauthenticatedAction: $localize`:@@errors.unauthenticatedAction:You will be redirected to login in 5 seconds`,
  // eslint-disable-next-line max-len
  pageNotFoundDescription: $localize`:@@errors.pageNotFoundDescription:We do not have the requested page. It may have been deleted or an incorrect address was specified in the request`,
  errorCode: $localize`:@@errors.errorCode:Error code`,
} as const;

export const UnknownBackendError: BackendError = {
  title: ErrorsLocalization.unknownErr,
  detail: ErrorsLocalization.smthWentWrong,
  code: 0,
  status: 0,
} as const;

export const SUPPRESS_HTTP_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => true);
