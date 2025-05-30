import { LoginPayload } from '@modules/auth/auth.models';

export class Login {
  public static readonly type = '[Auth] Login';
  constructor(readonly payload: LoginPayload) {}
}

export class Logout {
  public static readonly type = '[Auth] Logout';
}

export class ResetAuthState {
  public static readonly type = '[Auth] Reset Auth State';
}
