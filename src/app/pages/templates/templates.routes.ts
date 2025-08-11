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
import { templateFormResolver } from '@app/pages/templates/resolvers/template-form.resolver';
import { TemplateFormFactoryService } from '@app/pages/templates/services/template-form-factory.service';

export const templatesRoutes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    providers: [TemplateFormFactoryService],
    children: [
      {
        path: '',
        component: TemplatesLayoutComponent,
      },
      {
        path: AppRoutes.new,
        component: TemplateEditComponent,
        resolve: { templateForm: templateFormResolver(true) },
        data: { mode: 'new' },
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
        resolve: { templateForm: templateFormResolver() },
        data: { mode: 'edit' },
        title: RouteTitles.template,
        runGuardsAndResolvers: 'always',
      },
    ],
  },
];
