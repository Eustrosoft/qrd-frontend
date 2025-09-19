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
import { TemplateCreateComponent } from '@app/pages/templates/components/template-create/template-create.component';
import { TemplateListComponent } from '@app/pages/templates/components/template-list/template-list.component';
import { TemplateTableComponent } from '@app/pages/templates/components/template-table/template-table.component';

export const templatesRoutes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    children: [
      {
        path: '',
        component: TemplatesLayoutComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: AppRoutes.list,
          },
          {
            path: AppRoutes.list,
            component: TemplateListComponent,
          },
          {
            path: AppRoutes.table,
            component: TemplateTableComponent,
          },
        ],
      },
      {
        path: AppRoutes.new,
        component: TemplateCreateComponent,
        title: RouteTitles.newTemplate,
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
        title: RouteTitles.template,
        runGuardsAndResolvers: 'always',
      },
    ],
  },
];
