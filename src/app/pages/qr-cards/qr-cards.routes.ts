import { Routes } from '@angular/router';
import { QrCardsComponent } from '@app/pages/qr-cards/qr-cards.component';
import { provideStates } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';

export const qrCardsRoutes: Routes = [
  {
    path: '',
    component: QrCardsComponent,
    providers: [provideStates([QrCardsState])],
  },
];
