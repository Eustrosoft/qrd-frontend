import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginForm } from '@app/pages/login/login.models';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { SignUpLocalization } from '@app/pages/login/login.constants';

@Component({
  selector: 'login',
  imports: [FlexBlockComponent, MatFormField, UiIconComponent, MatIconButton, MatInput, MatLabel, MatError, MatSuffix, MatButton, ReactiveFormsModule],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly isXSmall = inject(IS_XSMALL);

  protected readonly RouteTitles = RouteTitles;
  protected readonly SignUpLocalization = SignUpLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly isPwdVisible = signal<boolean>(false);

  protected readonly form = this.fb.nonNullable.group<LoginForm>({
    login: this.fb.nonNullable.control<string>('', [Validators.required]),
    password: this.fb.nonNullable.control<string>('', [Validators.required]),
  });

  protected submitForm(): void {
    this.form.markAllAsTouched();
    console.log(this.form.getRawValue());
  }
}
