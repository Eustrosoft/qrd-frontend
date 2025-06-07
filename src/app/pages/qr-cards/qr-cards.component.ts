import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FetchQrCards, SetQrCardsDataViewDisplayType } from '@app/pages/qr-cards/state/qr-cards.actions';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { QrCardListComponent } from '@app/pages/qr-cards/components/qr-card-list/qr-card-list.component';

@Component({
  selector: 'qr-cards',
  imports: [DataViewComponent, QrCardListComponent],
  templateUrl: './qr-cards.component.html',
  styleUrl: './qr-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardsComponent {
  protected readonly selectors = createSelectMap({
    displayType: QrCardsState.getDisplayType$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetQrCardsDataViewDisplayType,
    fetchQrCards: FetchQrCards,
  });

  protected openAdvancedSearch(): void {
    throw new Error('Not implemented');
  }
}
