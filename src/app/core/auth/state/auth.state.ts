import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { Login } from './auth.actions';
import { AuthService } from '@core/auth/auth.service';
import { Observable, tap } from 'rxjs';
import { AppRoutes } from '@app/app.constants';
import { Router } from '@angular/router';
import { patch } from '@ngxs/store/operators';

export interface AuthStateModel {
  isAuthenticated: boolean;
}

const defaults: AuthStateModel = {
  isAuthenticated: false,
} as const;

const AUTH_STATE_TOKEN: StateToken<AuthStateModel> = new StateToken<AuthStateModel>('auth');

@State<AuthStateModel>({
  name: AUTH_STATE_TOKEN,
  defaults,
})
@Injectable()
export class AuthState {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Selector()
  public static isAuthenticated$({ isAuthenticated }: AuthStateModel): boolean {
    return isAuthenticated;
  }

  @Action(Login)
  public login({ setState }: StateContext<AuthStateModel>, { payload }: Login): Observable<void> {
    return this.authService.login(payload).pipe(
      tap({
        next: () => {
          setState(patch({ isAuthenticated: true }));
          this.router.navigate([AppRoutes.cards]);
        },
      }),
    );
  }
}
