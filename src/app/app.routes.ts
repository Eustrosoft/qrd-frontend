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
import { provideStates, select } from '@ngxs/store';
import { AuthState } from '@modules/auth/state/auth.state';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { FilesState } from '@app/pages/files/state/files.state';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import { queryRedirectResolver } from '@shared/resolvers/query-redirect.resolver';
import { loginGuard } from '@modules/auth/login.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: (): string => {
      const isAuthenticated = select(AuthState.isAuthenticated$);
      if (isAuthenticated()) {
        return AppRoutes.qrCards;
      }
      return AppRoutes.login;
    },
  },
  {
    path: AppRoutes.login,
    title: RouteTitles.login,
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: AppRoutes.qrCards,
    title: RouteTitles.cards,
    canActivate: [authGuard],
    loadChildren: () => import('@app/pages/qr-cards/qr-cards.routes').then((m) => m.qrCardsRoutes),
    providers: [provideStates([QrCardsState])],
  },
  {
    path: AppRoutes.templates,
    title: RouteTitles.templates,
    canActivate: [authGuard],
    loadChildren: () => import('@app/pages/templates/templates.routes').then((m) => m.templatesRoutes),
    providers: [provideStates([TemplatesState])],
  },
  {
    path: AppRoutes.files,
    title: RouteTitles.files,
    canActivate: [authGuard],
    loadChildren: () => import('@app/pages/files/files.routes').then((m) => m.filesRoutes),
    providers: [provideStates([FilesState])],
  },
  {
    path: AppRoutes.docs,
    title: RouteTitles.docs,
    canActivate: [authGuard],
    loadChildren: () => import('@app/pages/docs/docs.routes').then((m) => m.docsRoutes),
  },
  {
    path: AppRoutes.settings,
    title: RouteTitles.settings,
    canActivate: [authGuard],
    loadChildren: () => import('@app/pages/settings/settings.routes').then((m) => m.settingsRoutes),
  },
  { path: AppRoutes.deeplink, resolve: { redirect: queryRedirectResolver }, children: [] },
  {
    path: AppRoutes.devSandbox,
    title: RouteTitles.devSandbox,
    canActivate: [(): boolean => !environment.production],
    loadChildren: () => import('@app/pages/dev-sandbox/dev-sandbox.routes').then((m) => m.devSandboxRoutes),
  },
  {
    path: AppRoutes.noConfig,
    title: ErrorsLocalization.noConfig,
    loadComponent: () => import('@app/pages/error-page/error-page.component').then((m) => m.ErrorPageComponent),
    providers: [
      {
        provide: ERROR_CONFIG,
        useFactory: (router: Router): ErrorConfig =>
          errorConfigFactory({
            title: ErrorsLocalization.noConfig,
            message: ErrorsLocalization.noConfigDescription,
            icon: 'not-found',
            buttonList: [{ buttonText: SharedLocalization.mainPage, buttonAction: () => router.navigate(['/']) }],
          }),
        deps: [Router],
      },
    ],
  },
  {
    path: AppRoutes.notFound,
    title: ErrorsLocalization.pageNotFound,
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
    title: ErrorsLocalization.unauthenticatedRoute,
    loadComponent: () => import('@app/pages/error-page/error-page.component').then((m) => m.ErrorPageComponent),
    providers: [
      {
        provide: ERROR_CONFIG,
        useFactory: (router: Router): ErrorConfig =>
          errorConfigFactory({
            title: ErrorsLocalization.unauthenticated,
            message: ErrorsLocalization.unauthenticatedAction,
            icon: 'timeout',
            buttonList: [
              { buttonText: SharedLocalization.login, buttonAction: () => router.navigate([AppRoutes.login]) },
            ],
            onInit: () => {
              timer(5000).subscribe({ next: () => router.navigate([AppRoutes.login]) });
            },
          }),
        deps: [Router],
      },
    ],
  },
  { path: '**', redirectTo: AppRoutes.notFound },
];
