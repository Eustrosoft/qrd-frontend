import { LoginPayload } from '@core/auth/auth.models';

export class Login {
  public static readonly type = '[Auth] Login';
  constructor(readonly payload: LoginPayload) {}
}
