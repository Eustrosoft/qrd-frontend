import { Routes } from '@angular/router';
import { AppRoutes, RouteTitles } from '@app/app.constants';
import { environment } from '@environment';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoutes.DEV_SANDBOX,
  },
  {
    path: AppRoutes.DEV_SANDBOX,
    title: RouteTitles.DEV_SANDBOX,
    canActivate: [(): boolean => !environment.production],
    loadChildren: () => import('@app/pages/dev-sandbox/dev-sandbox.routes').then((m) => m.devSandboxRoutes),
  },
  { path: '**', redirectTo: `/${AppRoutes.NOT_FOUND}` },
];
