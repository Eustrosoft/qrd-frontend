import { LoginPayload } from '@modules/auth/auth.models';

export class Login {
  public static readonly type = '[Auth] Login';
  constructor(readonly payload: LoginPayload) {}
}

export class Logout {
  public static readonly type = '[Auth] Logout';
}

export class FetchAuthInfo {
  public static readonly type = '[Auth] Fetch Auth Info';
}

export class RestoreAuth {
  public static readonly type = '[Auth] Set Is Authenticated';
}

export class ResetAuthState {
  public static readonly type = '[Auth] Reset Auth State';
}
