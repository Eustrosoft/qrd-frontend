import { createPropertySelectors } from '@ngxs/store';
import { AuthState, AuthStateModel } from '@modules/auth/state/auth.state';

export class AuthSelectors {
  public static getSlices = createPropertySelectors<AuthStateModel>(AuthState);
}
