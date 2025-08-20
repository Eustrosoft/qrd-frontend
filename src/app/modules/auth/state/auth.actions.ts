import { UserLoginDto } from '@api/api.models';
import { PasswordChangeFormGroup } from '@app/pages/settings/settings.models';

export class Login {
  public static readonly type = '[Auth] Login';
  constructor(readonly payload: UserLoginDto) {}
}

export class Logout {
  public static readonly type = '[Auth] Logout';
}

export class FetchAuthInfo {
  public static readonly type = '[Auth] Fetch Auth Info';
}

export class ChangePassword {
  public static readonly type = '[Auth] Change Password';
  constructor(readonly formValue: ReturnType<PasswordChangeFormGroup['getRawValue']>) {}
}

export class RestoreAuth {
  public static readonly type = '[Auth] Restore Auth';
}

export class ResetAuthState {
  public static readonly type = '[Auth] Reset Auth State';
}
