import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { ChangePassword, FetchAuthInfo, Login, Logout, ResetAuthState, RestoreAuth } from './auth.actions';
import { AuthService } from '@modules/auth/auth.service';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { AppRoutes, IS_AUTHENTICATED_KEY } from '@app/app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { patch } from '@ngxs/store/operators';
import { LocalStorageService } from '@shared/service/local-storage.service';
import { ParticipantDto } from '@api/api.models';
import { FetchSettings, ResetAppState } from '@app/state/app.actions';
import { SnackbarService } from '@shared/service/snackbar.service';
import { SettingsLocalization } from '@app/pages/settings/settings.constants';

export interface AuthStateModel {
  isAuthenticated: boolean;
  isAuthInfoLoading: boolean;
  authInfo: ParticipantDto | null;
  isSavingPassword: boolean;
}

const defaults: AuthStateModel = {
  isAuthenticated: false,
  isAuthInfoLoading: false,
  authInfo: null,
  isSavingPassword: false,
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
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly snackbarService = inject(SnackbarService);

  @Selector()
  public static isAuthenticated$({ isAuthenticated }: AuthStateModel): boolean {
    return isAuthenticated;
  }

  @Selector()
  public static isAuthInfoLoading$({ isAuthInfoLoading }: AuthStateModel): boolean {
    return isAuthInfoLoading;
  }

  @Selector()
  public static getAuthInfo$({ authInfo }: AuthStateModel): ParticipantDto | null {
    return authInfo;
  }

  @Selector()
  public static isSavingPassword$({ isSavingPassword }: AuthStateModel): boolean {
    return isSavingPassword;
  }

  @Action(Login)
  public login({ setState, dispatch }: StateContext<AuthStateModel>, { payload }: Login): Observable<void> {
    setState(patch({ isAuthInfoLoading: true }));
    return this.authService.login(payload).pipe(
      tap({
        next: () => {
          setState(patch({ isAuthenticated: true }));
          this.localStorageService.set(IS_AUTHENTICATED_KEY, '1');
          const deeplink = this.activatedRoute.snapshot.queryParamMap.get('deeplink');
          this.router.navigateByUrl(deeplink ?? `/${AppRoutes.qrCards}`);
        },
      }),
      switchMap(() => dispatch(FetchAuthInfo)),
      switchMap(() => dispatch(FetchSettings)),
      catchError((err) => {
        setState(patch({ isAuthInfoLoading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(Logout)
  public logout({ setState, dispatch }: StateContext<AuthStateModel>): Observable<void> {
    setState(patch({ isAuthenticated: false }));
    this.localStorageService.set(IS_AUTHENTICATED_KEY, '0');
    this.router.navigate([AppRoutes.login]);
    return this.authService.logout().pipe(
      tap({
        next: () => {
          dispatch([ResetAuthState, ResetAppState]);
        },
      }),
    );
  }

  @Action(FetchAuthInfo)
  public getAuthInfo({ setState }: StateContext<AuthStateModel>): Observable<ParticipantDto> {
    return this.authService.getAuthInfo().pipe(
      tap({
        next: (authInfo) => {
          setState(patch({ authInfo, isAuthInfoLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isAuthInfoLoading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(ChangePassword)
  public changePassword(
    { setState }: StateContext<AuthStateModel>,
    { formValue }: ChangePassword,
  ): Observable<unknown> {
    setState(patch({ isSavingPassword: true }));
    return this.authService.changePassword(formValue).pipe(
      tap({
        next: () => {
          this.snackbarService.success(SettingsLocalization.passwordUpdated);
          this.router.navigate([AppRoutes.settings]);
          setState(patch({ isSavingPassword: false }));
        },
      }),
      catchError((err) => {
        this.snackbarService.success(SettingsLocalization.passwordUpdateErr);
        setState(patch({ isSavingPassword: false }));
        return throwError(() => err);
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
    this.localStorageService.set(IS_AUTHENTICATED_KEY, '0');
    setState(defaults);
  }
}
