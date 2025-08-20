import { Routes } from '@angular/router';
import { RouteTitles } from '@shared/shared.constants';
import { unsavedDataGuard } from '@shared/guards/unsaved-data.guard';
import { SettingsComponent } from '@app/pages/settings/settings.component';
import { SettingsEditComponent } from '@app/pages/settings/components/settings-edit/settings-edit.component';
import { PasswordChangeComponent } from '@app/pages/settings/components/password-change/password-change.component';
import { AppRoutes } from '@app/app.constants';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        title: RouteTitles.settings,
        component: SettingsEditComponent,
        canDeactivate: [unsavedDataGuard<SettingsEditComponent>()],
      },
      {
        path: AppRoutes.password,
        title: RouteTitles.passwordChange,
        component: PasswordChangeComponent,
        canDeactivate: [unsavedDataGuard<PasswordChangeComponent>()],
      },
    ],
  },
];
