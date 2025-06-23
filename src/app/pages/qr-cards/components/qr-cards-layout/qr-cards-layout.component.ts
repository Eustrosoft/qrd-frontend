import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import {
  FetchQrCardList,
  SelectedAllQrCards,
  SetQrCardsDataViewDisplayType,
  SetSelectedQrCards,
} from '@app/pages/qr-cards/state/qr-cards.actions';
import { SelectionActionsBarComponent } from '@shared/components/selection-actions-bar/selection-actions-bar.component';
import { QrCardListComponent } from '@app/pages/qr-cards/components/qr-card-list/qr-card-list.component';
import { MatIcon } from '@angular/material/icon';
import { expandAnimation } from '@shared/shared.animations';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'qr-cards-layout',
  imports: [DataViewComponent, SelectionActionsBarComponent, QrCardListComponent, MatIcon, MatMiniFabButton],
  animations: [expandAnimation],
  templateUrl: './qr-cards-layout.component.html',
  styleUrl: './qr-cards-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardsLayoutComponent {
  protected readonly selectors = createSelectMap({
    displayType: QrCardsState.getDisplayType$,
    selectedQrCardList: QrCardsState.getSelectedQrCardList$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetQrCardsDataViewDisplayType,
    fetchQrCards: FetchQrCardList,
    setSelectedQrCards: SetSelectedQrCards,
    selectedAllQrCards: SelectedAllQrCards,
  });

  protected openAdvancedSearch(): void {
    throw new Error('Not implemented');
  }
}
