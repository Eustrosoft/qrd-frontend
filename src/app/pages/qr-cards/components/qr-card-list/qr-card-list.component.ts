import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  inputBinding,
  OnInit,
} from '@angular/core';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import {
  DeleteQrCards,
  FetchQrCardList,
  SetQrCardsDataViewDisplayType,
} from '@app/pages/qr-cards/state/qr-cards.actions';
import { ViewListItemComponent } from '@shared/components/view-list-item/view-list-item.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { MatMenuItem } from '@angular/material/menu';
import { SharedLocalization } from '@shared/shared.constants';
import { QrCardsLocalization } from '@app/pages/qr-cards/qr-cards.constants';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { MatIcon } from '@angular/material/icon';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ImgLoadStateDirective } from '@shared/directives/img-load-state.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QrViewComponent } from '@app/pages/qr-view/qr-view.component';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { AppState } from '@app/state/app.state';
import { RangeSelectorService } from '@shared/service/range-selector.service';
import { QRDto } from '@api/qr-cards/qrs-api.models';
import { AppRoutes } from '@app/app.constants';
import { WINDOW } from '@cdk/tokens/window.token';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'qr-card-list',
  imports: [
    ViewListItemComponent,
    ToHexPipe,
    EllipsisDirective,
    MatMenuItem,
    UiSkeletonComponent,
    MatIcon,
    ImgLoadStateDirective,
    RouterLink,
    FallbackPipe,
  ],
  providers: [RangeSelectorService],
  templateUrl: './qr-card-list.component.html',
  styleUrl: './qr-card-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardListComponent implements OnInit {
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly window = inject(WINDOW);
  protected readonly uiSidenavService = inject(UiSidenavService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly rangeSelectorService = inject(RangeSelectorService);
  protected readonly QrCardsLocalization = QrCardsLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly AppRoutes = AppRoutes;

  protected readonly selectors = createSelectMap({
    displayType: QrCardsState.getDisplayType$,
    isQrCardListLoading: QrCardsState.isQrCardListLoading$,
    qrCardListSkeletonLoaders: QrCardsState.getQrCardListSkeletonLoaders$,
    qrCardList: QrCardsState.getQrCardList$,
    selectedQrCardList: QrCardsState.getSelectedQrCardList$,
    qrTableColumnVisibility: AppState.qrTableColumnVisibility$,
    settingsState: AppState.getSettingsState$,
  });

  protected readonly actions = createDispatchMap({
    setDisplayType: SetQrCardsDataViewDisplayType,
    fetchQrCards: FetchQrCardList,
    deleteQrCards: DeleteQrCards,
  });

  // prettier-ignore
  protected readonly skeletonHeight = computed(() => this.isSmallScreen() ? '96' : '144');

  protected readonly selectionModel = new SelectionModel(true, this.selectors.selectedQrCardList());
  public readonly selectionChanged = outputFromObservable(
    this.selectionModel.changed.asObservable().pipe(map(() => this.selectionModel.selected)),
  );

  private readonly selEff = effect(() => {
    const selectedValues = this.selectors.selectedQrCardList();
    this.selectionModel.select(...selectedValues);
    this.rangeSelectorService.updateLastSelectedId(this.selectionModel);
    if (!selectedValues.length) {
      this.selectionModel.clear();
    }
  });

  public ngOnInit(): void {
    this.actions.fetchQrCards();
  }

  protected makeSelect(item: QRDto): void {
    this.rangeSelectorService.selectItemOrRange(this.selectors.qrCardList(), this.selectionModel, item);
  }

  protected openCardPreview(previewUrl: string): void {
    this.uiSidenavService.open(QrViewComponent, {
      bindings: [inputBinding('iframeSrc', () => previewUrl)],
      position: 'end',
      width: this.isXSmall() ? 'full' : 'sm',
      isFixed: true,
    });
  }

  protected openPrint(code: string): void {
    const queryParams = new HttpParams({
      fromObject: {
        q: code,
        text: this.selectors.settingsState().settings.defaultQrPrintText,
        textDown: this.selectors.settingsState().settings.defaultQrPrintTextDown,
      },
    });
    this.window.open(`/printer/?${queryParams.toString()}`, '_blank', 'noopener noreferrer');
  }

  protected fetchMore(): void {
    throw new Error('Not implemented');
  }
}
