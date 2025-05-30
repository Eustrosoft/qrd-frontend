import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { FetchAuthInfo, Login, Logout, ResetAuthState, RestoreAuth } from './auth.actions';
import { AuthService } from '@modules/auth/auth.service';
import { Observable, switchMap, tap } from 'rxjs';
import { AppRoutes, IS_AUTHENTICATED_KEY } from '@app/app.constants';
import { Router } from '@angular/router';
import { patch } from '@ngxs/store/operators';
import { AuthInfo } from '@modules/auth/auth.models';
import { LocalStorageService } from '@shared/service/local-storage.service';

export interface AuthStateModel {
  isAuthenticated: boolean;
  authInfo: AuthInfo | null;
}

const defaults: AuthStateModel = {
  isAuthenticated: false,
  authInfo: null,
} as const;

const AUTH_STATE_TOKEN: StateToken<AuthStateModel> = new StateToken<AuthStateModel>('auth');

@State<AuthStateModel>({
  name: AUTH_STATE_TOKEN,
  defaults,
})
@Injectable()
export class AuthState {
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  @Selector()
  public static isAuthenticated$({ isAuthenticated }: AuthStateModel): boolean {
    return isAuthenticated;
  }

  @Selector()
  public static getAuthInfo$({ authInfo }: AuthStateModel): AuthInfo | null {
    return authInfo;
  }

  @Action(Login)
  public login({ setState, dispatch }: StateContext<AuthStateModel>, { payload }: Login): Observable<void> {
    return this.authService.login(payload).pipe(
      tap({
        next: () => {
          setState(patch({ isAuthenticated: true }));
          this.localStorageService.set(IS_AUTHENTICATED_KEY, '1');
          this.router.navigate([AppRoutes.cards]);
        },
      }),
      switchMap(() => dispatch(FetchAuthInfo)),
    );
  }

  @Action(Logout)
  public logout({ setState }: StateContext<AuthStateModel>): Observable<void> {
    setState(patch({ isAuthenticated: false }));
    this.localStorageService.set(IS_AUTHENTICATED_KEY, '0');
    this.router.navigate([AppRoutes.login]);
    return this.authService.logout();
  }

  @Action(FetchAuthInfo)
  public getAuthInfo({ setState }: StateContext<AuthStateModel>): Observable<AuthInfo> {
    return this.authService.getAuthInfo().pipe(
      tap({
        next: (authInfo) => {
          setState(patch({ authInfo }));
        },
      }),
    );
  }

  @Action(RestoreAuth)
  public restoreAuth({ setState, dispatch }: StateContext<AuthStateModel>): Observable<void> {
    setState(patch({ isAuthenticated: true }));
    return dispatch(FetchAuthInfo);
  }

  @Action(ResetAuthState)
  public resetAuthState({ setState }: StateContext<AuthStateModel>): void {
    setState(defaults);
  }
}
