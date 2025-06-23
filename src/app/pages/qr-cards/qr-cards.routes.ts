import { Routes } from '@angular/router';
import { QrCardsComponent } from '@app/pages/qr-cards/qr-cards.component';
import { QrCardViewComponent } from '@app/pages/qr-cards/components/qr-card-view/qr-card-view.component';
import { QrCardsLayoutComponent } from '@app/pages/qr-cards/components/qr-cards-layout/qr-cards-layout.component';
import { AppRoutes } from '@app/app.constants';
import { QrCardMainComponent } from '@app/pages/qr-cards/components/qr-card-main/qr-card-main.component';
import { QrCardAttrsComponent } from '@app/pages/qr-cards/components/qr-card-attrs/qr-card-attrs.component';
import { RouteTitles } from '@shared/shared.constants';

export const qrCardsRoutes: Routes = [
  {
    path: '',
    component: QrCardsComponent,
    children: [
      {
        path: '',
        component: QrCardsLayoutComponent,
      },
      {
        path: ':code',
        component: QrCardViewComponent,
        title: RouteTitles.card,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: AppRoutes.card,
          },
          {
            path: AppRoutes.card,
            component: QrCardMainComponent,
          },
          {
            path: AppRoutes.attrs,
            component: QrCardAttrsComponent,
          },
        ],
      },
    ],
  },
];
