import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FetchQrCards, SetQrCardsDataViewDisplayType } from '@app/pages/qr-cards/state/qr-cards.actions';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { ViewListItemComponent } from '@shared/components/view-list-item/view-list-item.component';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { QrCardsLocalization } from '@app/pages/qr-cards/qr-cards.constants';
import { SharedLocalization } from '@shared/shared.constants';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { ScrolledToLastDirective } from '@shared/directives/scrolled-to-last.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { map } from 'rxjs';

@Component({
  selector: 'qr-cards',
  imports: [
    DataViewComponent,
    ViewListItemComponent,
    EllipsisDirective,
    MatMenuItem,
    MatIcon,
    ToHexPipe,
    UiFlexBlockComponent,
    UiSkeletonComponent,
    ScrolledToLastDirective,
  ],
  templateUrl: './qr-cards.component.html',
  styleUrl: './qr-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardsComponent implements OnInit {
  protected readonly selectors = createSelectMap({
    displayType: QrCardsState.getDisplayType$,
    isQrCardListLoading: QrCardsState.isQrCardListLoading$,
    qrCardList: QrCardsState.getQrCardList$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetQrCardsDataViewDisplayType,
    fetchQrCards: FetchQrCards,
  });

  protected readonly selectionModel = new SelectionModel<number>(true);

  protected readonly QrCardsLocalization = QrCardsLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  public ngOnInit(): void {
    this.actions.fetchQrCards();
    this.selectionModel.changed
      .asObservable()
      .pipe(map(() => this.selectionModel.selected))
      .subscribe(console.log);
  }

  protected openAdvancedSearch(): void {
    throw new Error('Not implemented');
  }

  protected scrolledToLast(): void {
    console.log('ScrolledToLast');
  }
}
