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
  get pageNotFoundDescription() {
    return $localize`:@@errors.pageNotFoundDescription:Запрашиваемой страницы у нас нет. Возможно, она была удалена или в запросе был указан неверный адрес`;
  },
} as const;
