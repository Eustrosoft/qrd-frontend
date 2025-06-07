import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { SetCardsDataViewDisplayType } from '@app/pages/cards/state/cards.actions';
import { CardsState } from '@app/pages/cards/state/cards.state';
import { ViewListItemComponent } from '@shared/components/view-list-item/view-list-item.component';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';

@Component({
  selector: 'cards',
  imports: [
    DataViewComponent,
    ViewListItemComponent,
    EllipsisDirective,
    MatMenuItem,
    MatIcon,
    UiBadgeComponent,
    UiFlexBlockComponent,
  ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent {
  protected readonly selectors = createSelectMap({
    displayType: CardsState.getDisplayType$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetCardsDataViewDisplayType,
  });

  protected openAdvancedSearch(): void {
    throw new Error('Not implemented');
  }
}
