import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { QrCardsLocalization } from '@app/pages/qr-cards/qr-cards.constants';
import { FilesLocalization, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '@app/pages/files/files.constants';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { CreateQrCard, FetchQrRangeList, FetchTemplateList } from '@app/pages/qr-cards/state/qr-cards.actions';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QrCardCreationForm } from '@app/pages/qr-cards/qr-cards.models';
import { MatButton, MatIconButton } from '@angular/material/button';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { QrRangePipe } from '@shared/pipe/qr-range.pipe';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'qr-card-create',
  imports: [
    CardContainerComponent,
    ToolbarComponent,
    UiSkeletonComponent,
    MatButton,
    FormsModule,
    MatError,
    UiGridBlockComponent,
    MatFormField,
    UiFlexBlockComponent,
    MatProgressSpinner,
    MatIcon,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatIconButton,
    FallbackPipe,
    QrRangePipe,
    MatSuffix,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './qr-card-create.component.html',
  styleUrl: './qr-card-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly queryParams = toSignal(this.activatedRoute.queryParamMap, { requireSync: true });
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  protected readonly selectors = createSelectMap({
    isSaveInProgress: QrCardsState.isSaveInProgress$,
    qrRangesState: QrCardsState.getQrRangesState$,
    templatesState: QrCardsState.getTemplatesState$,
  });

  protected readonly actions = createDispatchMap({
    createQrCard: CreateQrCard,
    fetchTemplateList: FetchTemplateList,
    fetchQrRangeList: FetchQrRangeList,
  });

  protected readonly queryParamsEff = effect(() => {
    const templateId = this.queryParams().get('templateId');
    if (templateId) {
      this.form.controls.formId.patchValue(+templateId);
    }
  });

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  protected readonly form = this.fb.group<QrCardCreationForm>({
    name: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_NAME_LENGTH)]),
    description: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_DESCRIPTION_LENGTH)]),
    formId: this.fb.nonNullable.control<number | null>(null),
    rangeId: this.fb.nonNullable.control<number | null>(null, [Validators.required]),
  });

  protected readonly RouteTitles = RouteTitles;
  protected readonly QrCardsLocalization = QrCardsLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;

  public ngOnInit(): void {
    this.actions.fetchTemplateList(this.destroyRef);
    this.actions.fetchQrRangeList(this.destroyRef);
  }

  protected createQrCard(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.actions.createQrCard(this.form.getRawValue(), this.destroyRef);
  }
}
