import { Routes } from '@angular/router';
import { CardsComponent } from '@app/pages/cards/cards.component';
import { provideStates } from '@ngxs/store';
import { CardsState } from '@app/pages/cards/state/cards.state';

export const cardsRoutes: Routes = [
  {
    path: '',
    component: CardsComponent,
    providers: [provideStates([CardsState])],
  },
];
