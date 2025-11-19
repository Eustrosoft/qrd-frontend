import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { distinctUntilChanged, map, merge, Observable, of, pairwise, startWith } from 'rxjs';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { Gs1FormFactoryService } from '@app/pages/markings/services/gs1-form-factory.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Gs1FormGroup } from '@app/pages/markings/markings.models';
import { Actions, createDispatchMap, createSelectMap, ofActionSuccessful } from '@ngxs/store';
import { MarkingsSelectors } from '@app/pages/markings/state/markings.selectors';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { IndicatorComponent } from '@shared/components/indicator/indicator.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { easyHash } from '@shared/utils/functions/easy-hash.function';
import { FetchQrCardList, SaveMarking } from '@app/pages/markings/state/markings.actions';
import { MarkingsLocalization } from '@app/pages/markings/markings.constants';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { DEFAULT_EMPTY_ID } from '@app/app.constants';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatHint, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MaxDescriptionLength, MaxNameLength } from '@app/pages/files/files.constants';
import { Option } from '@shared/shared.models';

@Component({
  selector: 'gs1-edit',
  imports: [
    BannerComponent,
    UiSkeletonComponent,
    CardContainerComponent,
    IndicatorComponent,
    MatButton,
    ToolbarComponent,
    UiFlexBlockComponent,
    UiGridBlockComponent,
    InteractionEffect,
    MatFormField,
    MatOption,
    MatSelect,
    MatLabel,
    MatHint,
    MatIcon,
    MatIconButton,
    MatSuffix,
    MatProgressSpinner,
    RouterLink,
    ReactiveFormsModule,
    MatInput,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './gs1-edit.component.html',
  styleUrl: './gs1-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gs1EditComponent implements OnInit, CanComponentDeactivate, OnDestroy {
  private readonly gs1FormFactoryService = inject(Gs1FormFactoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly actions$ = inject(Actions);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  protected readonly form = toSignal<Gs1FormGroup>(this.activatedRoute.data.pipe(map((data) => data['gs1Form'])), {
    requireSync: true,
  });

  protected readonly isNew = computed<boolean>(() => !this.form().controls.id.getRawValue());

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  protected readonly rtypeList = signal<Option<number>[]>([
    {
      value: 1,
      viewValue: 'GTIN',
    },
  ]);

  protected readonly formHasUnsavedChanges = toSignal(
    merge(
      this.form().valueChanges.pipe(
        startWith(this.form().getRawValue()),
        map((value) => easyHash(value)),
        pairwise(),
        map(([prev, current]) => prev !== current),
      ),
      this.actions$.pipe(
        ofActionSuccessful(SaveMarking),
        map(() => false),
      ),
    ).pipe(distinctUntilChanged(), takeUntilDestroyed()),
    { initialValue: false },
  );

  protected readonly selectors = createSelectMap({
    isGs1Loading: MarkingsSelectors.getSlices.isGs1Loading,
    isGs1LoadErr: MarkingsSelectors.getSlices.isGs1LoadErr,
    isSaveInProgress: MarkingsSelectors.getSlices.isSaveInProgress,
    gs1: MarkingsSelectors.getSlices.gs1,
    getQrCardsState: MarkingsSelectors.getQrCardsState$,
  });

  protected readonly actions = createDispatchMap({
    fetchQrCardList: FetchQrCardList,
  });

  protected readonly MarkingsLocalization = MarkingsLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;

  public ngOnInit(): void {
    this.actions.fetchQrCardList(this.destroyRef);
    this.form().valueChanges.pipe(startWith(this.form().getRawValue())).subscribe(console.log);
  }

  public ngOnDestroy(): void {
    this.gs1FormFactoryService.reset();
  }

  protected saveData(): void {
    console.log(this.form().getRawValue());
    // this.form().markAllAsTouched();
    // if (this.form().invalid) {
    //   return;
    // }
    // this.actions.saveQrCard(this.form().getRawValue(), this.destroyRef);
  }

  public canDeactivate(isConfirmed: boolean | undefined): Observable<boolean> {
    return of(true);
  }

  public isDataSaved(): boolean {
    return !this.formHasUnsavedChanges();
  }

  protected readonly RouteTitles = RouteTitles;
  protected readonly DEFAULT_EMPTY_ID = DEFAULT_EMPTY_ID;
  protected readonly MAX_NAME_LENGTH = MaxNameLength;
  protected readonly MaxDescriptionLength = MaxDescriptionLength;
}
