export const SignUpLocalization = {
  get login() {
    return $localize`:@@signUp.login:Login`;
  },
  get pwd() {
    return $localize`:@@signUp.password:Password`;
  },
  get signUp() {
    return $localize`:@@signUp.signUp:Sign up`;
  },
  get forgotPwd() {
    return $localize`:@@signUp.forgotPwd:Forgot password`;
  },
  get loginRequiredErr() {
    return $localize`:@@signUp.loginRequiredErr:Login required`;
  },
  get pwdRequiredErr() {
    return $localize`:@@signUp.pwdRequiredErr:Password required`;
  },
} as const;
