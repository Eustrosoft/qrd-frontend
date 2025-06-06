import { BackendError } from '@modules/error/error.models';
import { HttpContextToken } from '@angular/common/http';

export const ErrorsLocalization = {
  get unknownErr() {
    return $localize`:@@errors.unknownErr:Unknown error`;
  },
  get smthWentWrong() {
    return $localize`:@@errors.smthWentWrong:Something went wrong`;
  },
  get pageNotFound() {
    return $localize`:@@errors.notFound:Page not found`;
  },
  get unauthenticatedRoute() {
    return $localize`:@@errors.unauthenticatedRoute:Session expired`;
  },
  get unauthenticated() {
    return $localize`:@@errors.unauthenticated:Your session expired`;
  },
  get unauthenticatedAction() {
    return $localize`:@@errors.unauthenticatedAction:You will be redirected login in 5 seconds`;
  },
  get pageNotFoundDescription() {
    // eslint-disable-next-line max-len
    return $localize`:@@errors.pageNotFoundDescription:We do not have the requested page. It may have been deleted or an incorrect address was specified in the request`;
  },
  get errorCode() {
    return $localize`:@@errors.errorCode:Error code`;
  },
} as const;

export const UnknownBackendError: BackendError = {
  title: ErrorsLocalization.unknownErr,
  detail: ErrorsLocalization.smthWentWrong,
  code: 0,
  status: 0,
} as const;

export const SUPPRESS_HTTP_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => true);
