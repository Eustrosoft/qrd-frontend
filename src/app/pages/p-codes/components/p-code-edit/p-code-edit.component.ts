import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { combineLatest, distinctUntilChanged, map, merge, Observable, of, pairwise, startWith } from 'rxjs';
import { Actions, createDispatchMap, createSelectMap, ofActionErrored, ofActionSuccessful } from '@ngxs/store';
import { PCodesSelectors } from '@app/pages/p-codes/state/p-codes.selectors';
import { CreatePCode, SavePCode } from '@app/pages/p-codes/state/p-codes.actions';
import { PCodesFormFactoryService } from '@app/pages/p-codes/services/p-codes-form-factory.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Data } from '@angular/router';
import { AppRoutes } from '@app/app.constants';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { PCodesLocalization } from '@app/pages/p-codes/p-codes.constants';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { IndicatorComponent } from '@shared/components/indicator/indicator.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { PCodeFormGroup } from '@app/pages/p-codes/p-codes.models';
import { easyHash } from '@shared/utils/functions/easy-hash.function';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { Option } from '@shared/shared.models';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { PCodesUtilsService } from '@app/pages/p-codes/services/p-codes-utils.service';
import { HashService } from '@shared/service/hash.service';

@Component({
  selector: 'p-code-edit',
  imports: [
    BannerComponent,
    UiSkeletonComponent,
    CardContainerComponent,
    IndicatorComponent,
    MatButton,
    ToolbarComponent,
    UiFlexBlockComponent,
    UiGridBlockComponent,
    FormsModule,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlideToggle,
    MatIcon,
    MatIconButton,
    MatSuffix,
    MatTooltip,
  ],
  templateUrl: './p-code-edit.component.html',
  styleUrl: './p-code-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PCodeEditComponent implements OnDestroy, CanComponentDeactivate {
  private readonly pCodesFormFactoryService = inject(PCodesFormFactoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly actions$ = inject(Actions);
  private readonly pCodesUtilsService = inject(PCodesUtilsService);
  private readonly hashService = inject(HashService);

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  protected readonly PCodesLocalization = PCodesLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly AppRoutes = AppRoutes;
  protected readonly RouteTitles = RouteTitles;

  protected readonly p2ModeList: Option<string>[] = [
    {
      value: 'NONE',
      viewValue: 'None',
    },
    {
      value: 'PLAIN',
      viewValue: 'Plain',
    },
    {
      value: 'MD5',
      viewValue: 'MD5',
    },
  ];

  protected readonly isPinVisible = signal<boolean>(false);
  protected readonly isPin2Visible = signal<boolean>(false);

  protected readonly form = toSignal<PCodeFormGroup>(
    this.activatedRoute.data.pipe(map<Data, PCodeFormGroup>((data) => data['pCodeForm'])),
    {
      requireSync: true,
    },
  );

  protected readonly docId = toSignal(this.activatedRoute.queryParamMap.pipe(map((params) => params.get('docId'))));

  protected readonly backNav = computed<string[]>(() => {
    const docId = this.docId();
    if (docId) {
      return ['/', AppRoutes.qrCards, docId, AppRoutes.pins];
    }
    return ['/', AppRoutes.qrCards];
  });

  protected readonly isNew = computed<boolean>(() => !this.form().controls.rowId.getRawValue());

  protected readonly formHasUnsavedChanges = toSignal(
    merge(
      this.form().valueChanges.pipe(
        startWith(this.form().getRawValue()),
        map((value) => easyHash(value)),
        pairwise(),
        map(([prev, current]) => prev !== current),
      ),
      this.actions$.pipe(
        ofActionSuccessful(SavePCode),
        map(() => false),
      ),
    ).pipe(distinctUntilChanged(), takeUntilDestroyed()),
    { initialValue: false },
  );

  protected readonly isMd5Changed = toSignal(
    combineLatest([
      this.form().controls.p2.valueChanges.pipe(
        map(() => true),
        startWith(false),
      ),
      this.form().controls.p2Mode.valueChanges.pipe(
        map((value) => value === 'MD5'),
        startWith(false),
      ),
    ]).pipe(
      map(([p2Changed, isMd5Selected]) => p2Changed && isMd5Selected),
      startWith(false),
    ),
    { requireSync: true },
  );

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  protected readonly selectors = createSelectMap({
    isPCodeLoading: PCodesSelectors.getSlices.isPCodeLoading,
    isPCodeLoadErr: PCodesSelectors.getSlices.isPCodeLoadErr,
    isSaveInProgress: PCodesSelectors.getSlices.isSaveInProgress,
  });

  protected readonly actions = createDispatchMap({
    createPCode: CreatePCode,
    savePCode: SavePCode,
  });

  public ngOnDestroy(): void {
    this.pCodesFormFactoryService.reset();
  }

  protected makeRandomPin(): void {
    this.form().controls.p.setValue(this.pCodesUtilsService.makeRandomPin());
  }

  protected makeRandomPin2(): void {
    this.form().controls.p2.setValue(this.pCodesUtilsService.makeRandomPin());
  }

  protected makeMD5Hash(): void {
    const value = this.form().controls.p2.getRawValue();
    this.form().controls.p2.setValue(this.hashService.md5(value));
  }

  protected saveData(): void {
    this.form().markAllAsTouched();
    if (this.form().invalid) {
      return;
    }
    if (this.isNew()) {
      this.actions.createPCode(this.form().getRawValue(), this.destroyRef);
      return;
    }
    this.actions.savePCode(this.form().getRawValue(), this.isMd5Changed(), this.destroyRef);
  }

  public canDeactivate(isConfirmed: boolean | undefined): Observable<boolean> {
    if (isConfirmed === undefined) {
      return of(false);
    }

    if (isConfirmed) {
      this.actions.savePCode(this.form().getRawValue(), this.isMd5Changed(), this.destroyRef);
      return merge(
        this.actions$.pipe(
          ofActionSuccessful(SavePCode),
          map(() => true),
        ),
        this.actions$.pipe(
          ofActionErrored(SavePCode),
          map(() => false),
        ),
      );
    }

    return of(true);
  }

  public isDataSaved(): boolean {
    return !this.formHasUnsavedChanges();
  }
}
