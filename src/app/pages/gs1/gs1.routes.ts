import { Routes } from '@angular/router';
import { RouteTitles } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { unsavedDataGuard } from '@shared/guards/unsaved-data.guard';
import { Gs1Component } from '@app/pages/gs1/gs1.component';
import { Gs1EditComponent } from '@app/pages/gs1/components/gs1-edit/gs1-edit.component';
import { gs1FormResolver } from '@app/pages/gs1/resolvers/gs1-form.resolver';

export const gs1Routes: Routes = [
  {
    path: '',
    component: Gs1Component,
    children: [
      {
        path: `${AppRoutes.new}/${AppRoutes.gs1}`,
        title: RouteTitles.newGs1,
        component: Gs1EditComponent,
        resolve: { gs1Form: gs1FormResolver() },
      },
      {
        path: `:id/${AppRoutes.edit}`,
        component: Gs1EditComponent,
        title: RouteTitles.gs1,
        canDeactivate: [unsavedDataGuard<Gs1EditComponent>()],
        resolve: { gs1Form: gs1FormResolver() },
      },
    ],
  },
];
