import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { distinctUntilChanged, map, merge, Observable, of, pairwise, startWith } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Actions, createDispatchMap, createSelectMap, ofActionErrored, ofActionSuccessful } from '@ngxs/store';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { easyHash } from '@shared/utils/functions/easy-hash.function';
import { AuthState } from '@modules/auth/state/auth.state';
import { PasswordChangeForm } from '@app/pages/settings/settings.models';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { SettingsLocalization } from '@app/pages/settings/settings.constants';
import { AppRoutes } from '@app/app.constants';
import { ChangePassword } from '@modules/auth/state/auth.actions';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { IndicatorComponent } from '@shared/components/indicator/indicator.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { passwordMatchValidator } from '@shared/validators/password-match.validator';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'password-change',
  imports: [
    CardContainerComponent,
    UiFlexBlockComponent,
    ToolbarComponent,
    MatButton,
    IndicatorComponent,
    UiSkeletonComponent,
    UiGridBlockComponent,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    MatError,
    MatIcon,
    MatIconButton,
    MatSuffix,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordChangeComponent implements CanComponentDeactivate {
  private readonly fb = inject(FormBuilder);
  private readonly actions$ = inject(Actions);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly SettingsLocalization = SettingsLocalization;
  protected readonly RouteTitles = RouteTitles;
  protected readonly AppRoutes = AppRoutes;

  protected readonly form = this.fb.group<PasswordChangeForm>(
    {
      oldPassword: this.fb.nonNullable.control<string>('', [Validators.required]),
      newPassword: this.fb.nonNullable.control<string>('', [Validators.required]),
      confirmNewPassword: this.fb.nonNullable.control<string>('', [Validators.required]),
    },
    {
      validators: [passwordMatchValidator('newPassword', 'confirmNewPassword')],
    },
  );

  protected readonly isOldPwdVisible = signal<boolean>(false);
  protected readonly isNewPwdVisible = signal<boolean>(false);
  protected readonly isRepeatPwdVisible = signal<boolean>(false);

  public formHasUnsavedChanges = toSignal<boolean, boolean>(
    merge(
      this.form.valueChanges.pipe(
        startWith(this.form.getRawValue()),
        map((value) => easyHash(value)),
        pairwise(),
        map(([prev, current]) => prev !== current),
      ),
      this.actions$.pipe(
        ofActionSuccessful(ChangePassword),
        map(() => false),
      ),
    ).pipe(distinctUntilChanged(), takeUntilDestroyed()),
    { initialValue: false },
  );

  protected readonly selectors = createSelectMap({
    isSavingPassword: AuthState.isSavingPassword$,
  });
  protected readonly actions = createDispatchMap({
    changePassword: ChangePassword,
  });

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  public canDeactivate(isConfirmed: boolean | undefined): Observable<boolean> {
    if (isConfirmed === undefined) {
      return of(false);
    }

    if (isConfirmed) {
      this.actions.changePassword(this.form.getRawValue());
      return merge(
        this.actions$.pipe(
          ofActionSuccessful(ChangePassword),
          map(() => true),
        ),
        this.actions$.pipe(
          ofActionErrored(ChangePassword),
          map(() => false),
        ),
      );
    }

    return of(true);
  }

  public isDataSaved(): boolean {
    return !this.formHasUnsavedChanges();
  }

  protected saveData(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.actions.changePassword(this.form.getRawValue());
  }
}
