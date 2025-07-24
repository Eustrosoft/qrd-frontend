import { Routes } from '@angular/router';
import { QrCardsComponent } from '@app/pages/qr-cards/qr-cards.component';
import { QrCardViewComponent } from '@app/pages/qr-cards/components/qr-card-view/qr-card-view.component';
import { QrCardsLayoutComponent } from '@app/pages/qr-cards/components/qr-cards-layout/qr-cards-layout.component';
import { AppRoutes } from '@app/app.constants';
import { QrCardMainComponent } from '@app/pages/qr-cards/components/qr-card-main/qr-card-main.component';
import { QrCardAttrsComponent } from '@app/pages/qr-cards/components/qr-card-attrs/qr-card-attrs.component';
import { RouteTitles } from '@shared/shared.constants';
import { QrCardEditComponent } from '@app/pages/qr-cards/components/qr-card-edit/qr-card-edit.component';
import { QrCardFormFactoryService } from '@app/pages/qr-cards/services/qr-card-form-factory.service';
import { qrCardFormResolver } from '@app/pages/qr-cards/resolvers/qr-card-form.resolver';
import { unsavedDataGuard } from '@shared/guards/unsaved-data.guard';
import { QrCardCreateComponent } from '@app/pages/qr-cards/components/qr-card-create/qr-card-create.component';

export const qrCardsRoutes: Routes = [
  {
    path: '',
    component: QrCardsComponent,
    providers: [QrCardFormFactoryService],
    children: [
      {
        path: '',
        component: QrCardsLayoutComponent,
      },
      {
        path: AppRoutes.new,
        component: QrCardCreateComponent,
        title: RouteTitles.card,
      },
      {
        path: ':code',
        component: QrCardViewComponent,
        title: RouteTitles.card,
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
          {
            path: AppRoutes.attrs,
            component: QrCardAttrsComponent,
          },
        ],
      },
      {
        path: `:code/${AppRoutes.edit}`,
        component: QrCardEditComponent,
        canDeactivate: [unsavedDataGuard<QrCardEditComponent>()],
        resolve: { qrCardForm: qrCardFormResolver() },
        data: { mode: 'edit' },
        title: RouteTitles.card,
      },
    ],
  },
];
