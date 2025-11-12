import { createPropertySelectors, createSelector } from '@ngxs/store';
import { AuthState, AuthStateModel } from '@modules/auth/state/auth.state';

export class AuthSelectors {
  public static getSlices = createPropertySelectors<AuthStateModel>(AuthState);

  public static getRanges$ = createSelector([AuthSelectors.getSlices.authInfo], (authInfo) => authInfo?.ranges ?? []);
}
