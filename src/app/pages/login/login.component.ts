import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginForm } from '@app/pages/login/login.models';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { SignUpLocalization } from '@app/pages/login/login.constants';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { createSelectMap, dispatch } from '@ngxs/store';
import { Login } from '@modules/auth/state/auth.actions';
import { MatIcon } from '@angular/material/icon';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { AppSelectors } from '@app/state/app.selectors';
import { AuthSelectors } from '@modules/auth/state/auth.selectors';
import { ProfileInfoOverlayLocalization } from '@modules/auth/components/profile-info-overlay/profile-info-overlay.constants';

@Component({
  selector: 'login',
  imports: [
    MatFormField,
    MatIconButton,
    MatInput,
    MatLabel,
    MatError,
    MatSuffix,
    MatButton,
    ReactiveFormsModule,
    UiFlexBlockComponent,
    MatIcon,
    UiSkeletonComponent,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly isXSmall = inject(IS_XSMALL);

  private readonly login = dispatch(Login);

  protected readonly selectors = createSelectMap({
    isAuthInfoLoading: AuthSelectors.getSlices.isAuthInfoLoading,
    configState: AppSelectors.getConfigState$,
  });

  protected readonly RouteTitles = RouteTitles;
  protected readonly SignUpLocalization = SignUpLocalization;
  protected readonly ProfileInfoOverlayLocalization = ProfileInfoOverlayLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly isPwdVisible = signal<boolean>(false);

  protected readonly form = this.fb.nonNullable.group<LoginForm>({
    username: this.fb.nonNullable.control<string>('', [Validators.required]),
    password: this.fb.nonNullable.control<string>('', [Validators.required]),
  });

  protected submitForm(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.login(this.form.getRawValue());
  }
}
