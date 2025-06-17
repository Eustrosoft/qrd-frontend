import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import {
  FetchQrCards,
  SelectedAllQrCards,
  SetQrCardsDataViewDisplayType,
  SetSelectedQrCards,
} from '@app/pages/qr-cards/state/qr-cards.actions';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { QrCardListComponent } from '@app/pages/qr-cards/components/qr-card-list/qr-card-list.component';
import { SelectionActionsBarComponent } from '@shared/components/selection-actions-bar/selection-actions-bar.component';
import { expandAnimation } from '@shared/shared.animations';

@Component({
  selector: 'qr-cards',
  imports: [DataViewComponent, QrCardListComponent, SelectionActionsBarComponent],
  animations: [expandAnimation],
  templateUrl: './qr-cards.component.html',
  styleUrl: './qr-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardsComponent {
  protected readonly selectors = createSelectMap({
    displayType: QrCardsState.getDisplayType$,
    selectedQrCardList: QrCardsState.getSelectedQrCardList$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetQrCardsDataViewDisplayType,
    fetchQrCards: FetchQrCards,
    setSelectedQrCards: SetSelectedQrCards,
    selectedAllQrCards: SelectedAllQrCards,
  });

  protected openAdvancedSearch(): void {
    throw new Error('Not implemented');
  }
}
