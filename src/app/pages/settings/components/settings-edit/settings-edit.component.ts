import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Actions, createDispatchMap, createSelectMap, ofActionErrored, ofActionSuccessful } from '@ngxs/store';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { SettingsForm } from '@app/pages/settings/settings.models';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, merge, Observable, of, pairwise, startWith } from 'rxjs';
import { easyHash } from '@shared/utils/functions/easy-hash.function';
import { PatchSettings } from '@app/state/app.actions';
import { AppState } from '@app/state/app.state';
import { AuthState } from '@modules/auth/state/auth.state';
import { ErrorStateMatcher } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { SettingsLocalization } from '@app/pages/settings/settings.constants';
import { MAX_NAME_LENGTH } from '@app/pages/files/files.constants';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { IndicatorComponent } from '@shared/components/indicator/indicator.component';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { MatError } from '@angular/material/form-field';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { QrRangePipe } from '@shared/pipe/qr-range.pipe';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '@app/app.constants';

@Component({
  selector: 'settings-edit',
  imports: [
    CardContainerComponent,
    FallbackPipe,
    FormsModule,
    IndicatorComponent,
    MatButton,
    MatLabel,
    MatError,
    MatFormField,
    MatInput,
    UiFlexBlockComponent,
    ToolbarComponent,
    UiGridBlockComponent,
    ReactiveFormsModule,
    MatSlideToggle,
    UiBadgeComponent,
    UiSkeletonComponent,
    QrRangePipe,
    RouterLink,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './settings-edit.component.html',
  styleUrl: './settings-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsEditComponent implements CanComponentDeactivate {
  private readonly fb = inject(FormBuilder);
  private readonly actions$ = inject(Actions);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly SettingsLocalization = SettingsLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly RouteTitles = RouteTitles;
  protected readonly AppRoutes = AppRoutes;

  protected readonly form = this.fb.group<SettingsForm>({
    checkUploadSize: this.fb.nonNullable.control<boolean>(false),
    defaultQrPrintText: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_NAME_LENGTH)]),
    defaultQrPrintTextDown: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_NAME_LENGTH)]),
  });

  public formHasUnsavedChanges = toSignal<boolean, boolean>(
    merge(
      this.form.valueChanges.pipe(
        startWith(this.form.getRawValue()),
        map((value) => easyHash(value)),
        pairwise(),
        map(([prev, current]) => prev !== current),
      ),
      this.actions$.pipe(
        ofActionSuccessful(PatchSettings),
        map(() => false),
      ),
    ).pipe(distinctUntilChanged(), takeUntilDestroyed()),
    { initialValue: false },
  );

  protected readonly selectors = createSelectMap({
    settingsState: AppState.getSettingsState$,
    authInfo: AuthState.getAuthInfo$,
  });
  protected readonly actions = createDispatchMap({
    patchSettings: PatchSettings,
  });

  protected readonly settingsEff = effect(() => {
    const settingsState = this.selectors.settingsState();
    this.form.patchValue(
      {
        checkUploadSize: settingsState.settings.checkUploadSize,
        defaultQrPrintText: settingsState.settings.defaultQrPrintText,
        defaultQrPrintTextDown: settingsState.settings.defaultQrPrintTextDown,
      },
      { emitEvent: false },
    );
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
      this.actions.patchSettings(this.form.getRawValue());
      return merge(
        this.actions$.pipe(
          ofActionSuccessful(PatchSettings),
          map(() => true),
        ),
        this.actions$.pipe(
          ofActionErrored(PatchSettings),
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

    this.actions.patchSettings(this.form.getRawValue());
  }
}
