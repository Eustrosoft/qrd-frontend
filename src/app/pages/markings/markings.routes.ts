import { Routes } from '@angular/router';
import { RouteTitles } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { unsavedDataGuard } from '@shared/guards/unsaved-data.guard';
import { MarkingsComponent } from '@app/pages/markings/markings.component';
import { Gs1EditComponent } from '@app/pages/markings/components/gs1-edit/gs1-edit.component';
import { gs1FormResolver } from '@app/pages/markings/resolvers/gs1-form.resolver';

export const markingsRoutes: Routes = [
  {
    path: '',
    component: MarkingsComponent,
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
        title: RouteTitles.marking,
        canDeactivate: [unsavedDataGuard<Gs1EditComponent>()],
        resolve: { gs1Form: gs1FormResolver() },
      },
    ],
  },
];
