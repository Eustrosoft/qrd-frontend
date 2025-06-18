import { Routes } from '@angular/router';
import { QrCardsComponent } from '@app/pages/qr-cards/qr-cards.component';
import { QrCardViewComponent } from '@app/pages/qr-cards/components/qr-card-view/qr-card-view.component';
import { QrCardsLayoutComponent } from '@app/pages/qr-cards/components/qr-cards-layout/qr-cards-layout.component';
import { AppRoutes, RouteTitles } from '@app/app.constants';
import { QrCardMainComponent } from '@app/pages/qr-cards/components/qr-card-main/qr-card-main.component';
import { QrCardAttrsComponent } from '@app/pages/qr-cards/components/qr-card-attrs/qr-card-attrs.component';

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
        path: ':id',
        component: QrCardViewComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: AppRoutes.card,
          },
          {
            path: AppRoutes.card,
            title: RouteTitles.card,
            component: QrCardMainComponent,
          },
          {
            path: AppRoutes.attrs,
            title: RouteTitles.attrs,
            component: QrCardAttrsComponent,
          },
        ],
      },
    ],
  },
];
