import { Routes } from '@angular/router';
import { RouteTitles } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { unsavedDataGuard } from '@shared/guards/unsaved-data.guard';
import { PCodesComponent } from '@app/pages/p-codes/p-codes.component';
import { PCodeEditComponent } from '@app/pages/p-codes/components/p-code-edit/p-code-edit.component';
import { pCodeFormResolver } from '@app/pages/p-codes/resolvers/p-code-form.resolver';

export const pCodesRoutes: Routes = [
  {
    path: '',
    component: PCodesComponent,
    children: [
      {
        path: `${AppRoutes.new}/${AppRoutes.pin}`,
        title: RouteTitles.newPCode,
        component: PCodeEditComponent,
        resolve: { pCodeForm: pCodeFormResolver() },
      },
      {
        path: `:rowId/${AppRoutes.edit}`,
        component: PCodeEditComponent,
        title: RouteTitles.pin,
        canDeactivate: [unsavedDataGuard<PCodeEditComponent>()],
        resolve: { pCodeForm: pCodeFormResolver() },
      },
    ],
  },
];
