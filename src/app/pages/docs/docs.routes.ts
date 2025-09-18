import { Routes } from '@angular/router';
import { DocsComponent } from '@app/pages/docs/docs.component';
import { DocsLayoutComponent } from '@app/pages/docs/components/docs-layout/docs-layout.component';

export const docsRoutes: Routes = [
  {
    path: '',
    component: DocsComponent,
    children: [
      {
        path: '',
        component: DocsLayoutComponent,
        children: [],
      },
    ],
  },
];
