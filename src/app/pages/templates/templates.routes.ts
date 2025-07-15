import { Routes } from '@angular/router';
import { TemplatesComponent } from '@app/pages/templates/templates.component';
import { TemplatesLayoutComponent } from '@app/pages/templates/components/templates-layout/templates-layout.component';
import { AppRoutes } from '@app/app.constants';
import { RouteTitles } from '@shared/shared.constants';
import { TemplateEditComponent } from '@app/pages/templates/components/template-edit/template-edit.component';
import { TemplateViewComponent } from '@app/pages/templates/components/template-view/template-view.component';
import { TemplateMainComponent } from '@app/pages/templates/components/template-main/template-main.component';
import { TemplateAttrsComponent } from '@app/pages/templates/components/template-attrs/template-attrs.component';
import { TemplateUsagesComponent } from '@app/pages/templates/components/template-usages/template-usages.component';
import { unsavedDataGuard } from '@shared/guards/unsaved-data.guard';

export const templatesRoutes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    children: [
      {
        path: '',
        component: TemplatesLayoutComponent,
      },
      {
        path: AppRoutes.new,
        component: TemplateEditComponent,
        canDeactivate: [unsavedDataGuard<TemplateEditComponent>()],
        title: RouteTitles.template,
      },
      {
        path: ':id',
        component: TemplateViewComponent,
        title: RouteTitles.template,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: AppRoutes.template,
          },
          {
            path: AppRoutes.template,
            component: TemplateMainComponent,
          },
          {
            path: AppRoutes.attrs,
            component: TemplateAttrsComponent,
          },
          {
            path: AppRoutes.usages,
            component: TemplateUsagesComponent,
          },
        ],
      },
      {
        path: `:id/${AppRoutes.edit}`,
        component: TemplateEditComponent,
        canDeactivate: [unsavedDataGuard<TemplateEditComponent>()],
        title: RouteTitles.template,
      },
    ],
  },
];
