import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import {
  FetchQrCardList,
  SelectAllQrCards,
  SetQrCardsDataViewDisplayType,
  SetSelectedQrCards,
} from '@app/pages/qr-cards/state/qr-cards.actions';
import { SelectionBarComponent } from '@shared/components/selection-bar/selection-bar.component';
import { QrCardListComponent } from '@app/pages/qr-cards/components/qr-card-list/qr-card-list.component';
import { MatIcon } from '@angular/material/icon';
import { expandAnimation } from '@shared/shared.animations';
import { MatMiniFabButton } from '@angular/material/button';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';

@Component({
  selector: 'qr-cards-layout',
  imports: [DataViewComponent, SelectionBarComponent, QrCardListComponent, MatIcon, MatMiniFabButton],
  animations: [expandAnimation],
  templateUrl: './qr-cards-layout.component.html',
  styleUrl: './qr-cards-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardsLayoutComponent {
  protected readonly uiSidenavService = inject(UiSidenavService);
  protected readonly document = inject(DOCUMENT);

  protected readonly selectors = createSelectMap({
    displayType: QrCardsState.getDisplayType$,
    selectedQrCardList: QrCardsState.getSelectedQrCardList$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetQrCardsDataViewDisplayType,
    fetchQrCards: FetchQrCardList,
    setSelectedQrCards: SetSelectedQrCards,
    selectedAllQrCards: SelectAllQrCards,
  });

  protected openAdvancedSearch(): void {
    this.uiSidenavService.open(MatIcon, {
      content: [[this.document.createTextNode('database_search')]],
      position: 'end',
    });
  }
}
