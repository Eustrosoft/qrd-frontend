import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { SetCardsDataViewDisplayType } from '@app/pages/cards/state/cards.actions';
import { CardsState } from '@app/pages/cards/state/cards.state';

@Component({
  selector: 'cards',
  imports: [DataViewComponent],
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
