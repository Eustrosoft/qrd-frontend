export const SignUpLocalization = {
  get login() {
    return $localize`:@@signUp.login:Логин`;
  },
  get pwd() {
    return $localize`:@@signUp.:Пароль`;
  },
  get signUp() {
    return $localize`:@@signUp.signUp:Регистрация`;
  },
  get forgotPwd() {
    return $localize`:@@signUp.forgotPwd:Не помню пароль`;
  },
  get loginRequiredErr() {
    return $localize`:@@signUp.loginRequiredErr:Логин обязателен`;
  },
  get pwdRequiredErr() {
    return $localize`:@@signUp.pwdRequiredErr:Пароль обязателен`;
  },
} as const;
