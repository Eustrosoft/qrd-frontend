import { BackendError } from '@modules/error/error.models';

export const ErrorsLocalization = {
  get unknownErr() {
    return $localize`:@@errors.unknownErr:Неизвестная ошибка`;
  },
  get smthWentWrong() {
    return $localize`:@@errors.smthWentWrong:Что-то пошло не так`;
  },
  get pageNotFound() {
    return $localize`:@@errors.notFound:Страница не найдена`;
  },
  get unauthenticatedRoute() {
    console.log('unauthenticatedRoute');
    return $localize`:@@errors.unauthenticatedRoute:Сессия истекла`;
  },
  get unauthenticated() {
    return $localize`:@@errors.unauthenticated:Ваша сессия истекла`;
  },
  get unauthenticatedAction() {
    return $localize`:@@errors.unauthenticatedAction:Через 5 секунд Вы будете перенаправлены на страницу входа`;
  },
  get pageNotFoundDescription() {
    return $localize`:@@errors.pageNotFoundDescription:Запрашиваемой страницы у нас нет. Возможно, она была удалена или в запросе был указан неверный адрес`;
  },
  get errorCode() {
    return $localize`:@@errors.errorCode:Код ошибки`;
  },
} as const;

export const UnknownBackendError: BackendError = {
  title: ErrorsLocalization.unknownErr,
  detail: ErrorsLocalization.smthWentWrong,
  code: 0,
  status: 0,
} as const;
