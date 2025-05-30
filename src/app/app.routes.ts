import { Router, Routes } from '@angular/router';
import { AppRoutes } from '@app/app.constants';
import { environment } from '@environment';
import { errorConfigFactory } from '@cdk/factories/error-config.factory';
import { ERROR_CONFIG, ErrorConfig } from '@cdk/tokens/error-config.token';
import { LoginComponent } from '@app/pages/login/login.component';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { authGuard } from '@modules/auth/auth.guard';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { timer } from 'rxjs';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoutes.devSandbox,
  },
  {
    path: AppRoutes.login,
    title: () => RouteTitles.login,
    component: LoginComponent,
  },
  {
    path: AppRoutes.cards,
    title: () => RouteTitles.cards,
    canActivate: [authGuard],
    loadChildren: () => import('@app/pages/cards/cards.routes').then((m) => m.cardsRoutes),
  },
  {
    path: AppRoutes.templates,
    title: () => RouteTitles.templates,
    canActivate: [authGuard],
    loadChildren: () => import('@app/pages/templates/templates.routes').then((m) => m.templatesRoutes),
  },
  {
    path: AppRoutes.files,
    title: () => RouteTitles.files,
    canActivate: [authGuard],
    loadChildren: () => import('@app/pages/files/files.routes').then((m) => m.filesRoutes),
  },
  {
    path: AppRoutes.devSandbox,
    title: () => RouteTitles.devSandbox,
    canActivate: [(): boolean => !environment.production],
    loadChildren: () => import('@app/pages/dev-sandbox/dev-sandbox.routes').then((m) => m.devSandboxRoutes),
  },
  {
    path: AppRoutes.notFound,
    title: () => ErrorsLocalization.pageNotFound,
    loadComponent: () => import('@app/pages/error-page/error-page.component').then((m) => m.ErrorPageComponent),
    providers: [
      {
        provide: ERROR_CONFIG,
        useFactory: (router: Router): ErrorConfig =>
          errorConfigFactory({
            title: ErrorsLocalization.pageNotFound,
            message: ErrorsLocalization.pageNotFoundDescription,
            icon: 'not-found',
            buttonList: [{ buttonText: SharedLocalization.mainPage, buttonAction: () => router.navigate(['/']) }],
          }),
        deps: [Router],
      },
    ],
  },
  {
    path: AppRoutes.unauthenticated,
    title: () => ErrorsLocalization.unauthenticatedRoute,
    loadComponent: () => import('@app/pages/error-page/error-page.component').then((m) => m.ErrorPageComponent),
    providers: [
      {
        provide: ERROR_CONFIG,
        useFactory: (router: Router): ErrorConfig =>
          errorConfigFactory({
            title: ErrorsLocalization.unauthenticated,
            message: ErrorsLocalization.unauthenticatedAction,
            icon: 'timeout',
            buttonList: [{ buttonText: SharedLocalization.login, buttonAction: () => router.navigate([AppRoutes.login]) }],
            onInit: () => {
              timer(5000).subscribe({ next: () => router.navigate([AppRoutes.login]) });
            },
          }),
        deps: [Router],
      },
    ],
  },
  { path: '**', redirectTo: `/${AppRoutes.notFound}` },
];
