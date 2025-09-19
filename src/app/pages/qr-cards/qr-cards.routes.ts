import { Routes } from '@angular/router';
import { QrCardsComponent } from '@app/pages/qr-cards/qr-cards.component';
import { QrCardViewComponent } from '@app/pages/qr-cards/components/qr-card-view/qr-card-view.component';
import { QrCardsLayoutComponent } from '@app/pages/qr-cards/components/qr-cards-layout/qr-cards-layout.component';
import { AppRoutes } from '@app/app.constants';
import { QrCardMainComponent } from '@app/pages/qr-cards/components/qr-card-main/qr-card-main.component';
import { RouteTitles } from '@shared/shared.constants';
import { QrCardEditComponent } from '@app/pages/qr-cards/components/qr-card-edit/qr-card-edit.component';
import { qrCardFormResolver } from '@app/pages/qr-cards/resolvers/qr-card-form.resolver';
import { unsavedDataGuard } from '@shared/guards/unsaved-data.guard';
import { QrCardCreateComponent } from '@app/pages/qr-cards/components/qr-card-create/qr-card-create.component';
import { QrCardListComponent } from '@app/pages/qr-cards/components/qr-card-list/qr-card-list.component';
import { QrCardTableComponent } from '@app/pages/qr-cards/components/qr-card-table/qr-card-table.component';
import { routeParamTitleResolver } from '@shared/resolvers/route-param-title.resolver';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { inject } from '@angular/core';

export const qrCardsRoutes: Routes = [
  {
    path: '',
    component: QrCardsComponent,
    children: [
      {
        path: '',
        component: QrCardsLayoutComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: AppRoutes.list,
          },
          {
            path: AppRoutes.list,
            component: QrCardListComponent,
          },
          {
            path: AppRoutes.table,
            component: QrCardTableComponent,
          },
        ],
      },
      {
        path: AppRoutes.new,
        component: QrCardCreateComponent,
        title: RouteTitles.newCard,
      },
      {
        path: ':code',
        component: QrCardViewComponent,
        title: routeParamTitleResolver(RouteTitles.card, 'code', (param) => inject(ToHexPipe).transform(param)),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: AppRoutes.qrCard,
          },
          {
            path: AppRoutes.qrCard,
            component: QrCardMainComponent,
          },
        ],
      },
      {
        path: `:code/${AppRoutes.edit}`,
        component: QrCardEditComponent,
        title: routeParamTitleResolver(RouteTitles.edit, 'code', (param) => inject(ToHexPipe).transform(param)),
        canDeactivate: [unsavedDataGuard<QrCardEditComponent>()],
        resolve: { qrCardForm: qrCardFormResolver() },
        data: { mode: 'edit' },
      },
    ],
  },
];
