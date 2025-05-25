import { Router, Routes } from '@angular/router';
import { AppRoutes, RouteTitles } from '@app/app.constants';
import { environment } from '@environment';
import { errorConfigFactory } from '@cdk/factories/error-config.factory';
import { ERROR_CONFIG, ErrorConfig } from '@cdk/tokens/error-config.token';
import { LoginComponent } from '@app/pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoutes.DEV_SANDBOX,
  },
  {
    path: AppRoutes.LOGIN,
    title: RouteTitles.LOGIN,
    component: LoginComponent,
  },
  {
    path: AppRoutes.CARDS,
    title: RouteTitles.CARDS,
    loadChildren: () => import('@app/pages/cards/cards.routes').then((m) => m.cardsRoutes),
  },
  {
    path: AppRoutes.TEMPLATES,
    title: RouteTitles.TEMPLATES,
    loadChildren: () => import('@app/pages/templates/templates.routes').then((m) => m.templatesRoutes),
  },
  {
    path: AppRoutes.FILES,
    title: RouteTitles.FILES,
    loadChildren: () => import('@app/pages/files/files.routes').then((m) => m.filesRoutes),
  },
  {
    path: AppRoutes.DEV_SANDBOX,
    title: RouteTitles.DEV_SANDBOX,
    canActivate: [(): boolean => !environment.production],
    loadChildren: () => import('@app/pages/dev-sandbox/dev-sandbox.routes').then((m) => m.devSandboxRoutes),
  },
  {
    path: AppRoutes.NOT_FOUND,
    title: RouteTitles.NOT_FOUND,
    loadComponent: () => import('@app/pages/error-page/error-page.component').then((m) => m.ErrorPageComponent),
    providers: [
      {
        provide: ERROR_CONFIG,
        useFactory: (router: Router): ErrorConfig =>
          errorConfigFactory({
            title: $localize`Такая страница не найдена`,
            message: $localize`Запрашиваемой страницы у нас нет. Возможно, она была удалена или в запросе был указан неверный адрес`,
            icon: 'not-found',
            buttonList: [{ buttonText: $localize`Главная страница`, buttonAction: () => router.navigate(['/']) }],
          }),
        deps: [Router],
      },
    ],
  },
  { path: '**', redirectTo: `/${AppRoutes.NOT_FOUND}` },
];
