import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Actions, createDispatchMap, createSelectMap, ofActionErrored, ofActionSuccessful } from '@ngxs/store';
import { IS_SMALL, IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { SettingsForm, ViewMode } from '@app/pages/settings/settings.models';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, merge, Observable, of, pairwise, startWith } from 'rxjs';
import { easyHash } from '@shared/utils/functions/easy-hash.function';
import { PatchSettings, PatchViewModeSettings } from '@app/state/app.actions';
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
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
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
import { ColumnConfigOverlayComponent } from '@shared/components/column-config-overlay/column-config-overlay.component';
import { OverlayAnimationDirective } from '@shared/directives/overlay-animation.directive';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { OverlayContainerComponent } from '@shared/components/overlay-container/overlay-container.component';
import { MobileToolbarComponent } from '@shared/components/mobile-toolbar/mobile-toolbar.component';
import { UiBottomMenuService } from '@ui/ui-bottom-menu/ui-bottom-menu.service';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Option } from '@shared/shared.models';
import { AppSelectors } from '@app/state/app.selectors';

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
    ColumnConfigOverlayComponent,
    OverlayAnimationDirective,
    CdkOverlayOrigin,
    OverlayContainerComponent,
    MobileToolbarComponent,
    MatIcon,
    MatTooltip,
    MatSuffix,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './settings-edit.component.html',
  styleUrl: './settings-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsEditComponent implements AfterContentInit, OnDestroy, CanComponentDeactivate {
  private readonly fb = inject(FormBuilder);
  private readonly actions$ = inject(Actions);
  private readonly uiBottomMenuService = inject(UiBottomMenuService);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmall = inject(IS_SMALL);

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly SettingsLocalization = SettingsLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly RouteTitles = RouteTitles;
  protected readonly AppRoutes = AppRoutes;
  protected readonly displayTypeList: Option<ViewMode>[] = [
    { value: 'list', viewValue: SharedLocalization.list },
    { value: 'table', viewValue: SharedLocalization.table },
  ];

  protected readonly mobileToolbar = viewChild.required('mobileToolbar', { read: TemplateRef<unknown> });

  protected readonly form = this.fb.group<SettingsForm>({
    checkUploadSize: this.fb.nonNullable.control<boolean>(false),
    defaultQrPrintText: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_NAME_LENGTH)]),
    defaultQrPrintTextDown: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_NAME_LENGTH)]),
    cardsViewMode: this.fb.nonNullable.control<ViewMode>('list'),
    templatesViewMode: this.fb.nonNullable.control<ViewMode>('list'),
    templateAttrsEditViewMode: this.fb.nonNullable.control<ViewMode>('table'),
    filesViewMode: this.fb.nonNullable.control<ViewMode>('list'),
  });

  public readonly formHasUnsavedChanges = toSignal(
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
    settingsState: AppSelectors.getSettingsState$,
    viewModeSettings: AppSelectors.getSlices.viewModeSettings,
    allQrCols: AppSelectors.getAllQrCols$,
    authInfo: AuthState.getAuthInfo$,
  });
  protected readonly actions = createDispatchMap({
    patchSettings: PatchSettings,
    patchViewModeSettings: PatchViewModeSettings,
  });

  protected readonly settingsEff = effect(() => {
    const settingsState = this.selectors.settingsState();
    const viewModeSettings = this.selectors.viewModeSettings();
    this.form.patchValue(
      {
        checkUploadSize: settingsState.settings.checkUploadSize,
        defaultQrPrintText: settingsState.settings.defaultQrPrintText,
        defaultQrPrintTextDown: settingsState.settings.defaultQrPrintTextDown,
        cardsViewMode: viewModeSettings.cardsViewMode,
        templatesViewMode: viewModeSettings.templatesViewMode,
        templateAttrsEditViewMode: viewModeSettings.templateAttrsEditViewMode,
        filesViewMode: viewModeSettings.filesViewMode,
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

  protected readonly viewModeGridTemplateColumns = computed<string>(() => {
    if (this.isXSmall()) {
      return 'repeat(1, 1fr)';
    }
    if (this.isSmall()) {
      return 'repeat(2, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  public ngAfterContentInit(): void {
    this.uiBottomMenuService.renderTemplate(this.mobileToolbar());
  }

  public ngOnDestroy(): void {
    this.uiBottomMenuService.renderDefaultCmp();
  }

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

    const { cardsViewMode, templatesViewMode, templateAttrsEditViewMode, filesViewMode } = this.form.getRawValue();

    this.actions.patchViewModeSettings({
      cardsViewMode,
      templatesViewMode,
      templateAttrsEditViewMode,
      filesViewMode,
    });
    this.actions.patchSettings(this.form.getRawValue());
  }
}
