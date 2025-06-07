import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { ScrolledToLastDirective } from '@shared/directives/scrolled-to-last.directive';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { FetchQrCards, SetQrCardsDataViewDisplayType } from '@app/pages/qr-cards/state/qr-cards.actions';
import { ViewListItemComponent } from '@shared/components/view-list-item/view-list-item.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { MatMenuItem } from '@angular/material/menu';
import { SharedLocalization } from '@shared/shared.constants';
import { QrCardsLocalization } from '@app/pages/qr-cards/qr-cards.constants';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { map } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'qr-card-list',
  imports: [
    UiFlexBlockComponent,
    ScrolledToLastDirective,
    ViewListItemComponent,
    ToHexPipe,
    EllipsisDirective,
    MatMenuItem,
    UiSkeletonComponent,
    MatIcon,
  ],
  templateUrl: './qr-card-list.component.html',
  styleUrl: './qr-card-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardListComponent implements OnInit {
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

  protected fetchMore(): void {
    throw new Error('Not implemented');
  }
}
