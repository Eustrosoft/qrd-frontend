import { Routes } from '@angular/router';
import { FilesComponent } from '@app/pages/files/files.component';
import { RouteTitles } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { FilesLayoutComponent } from '@app/pages/files/components/files-layout/files-layout.component';
import { FileViewComponent } from '@app/pages/files/components/file-view/file-view.component';
import { FileMainComponent } from '@app/pages/files/components/file-main/file-main.component';
import { FileUsagesComponent } from '@app/pages/files/components/file-usages/file-usages.component';
import { FileEditComponent } from '@app/pages/files/components/file-edit/file-edit.component';
import { unsavedDataGuard } from '@shared/guards/unsaved-data.guard';
import { FileListComponent } from '@app/pages/files/components/file-list/file-list.component';
import { FileTableComponent } from '@app/pages/files/components/file-table/file-table.component';
import { viewModeRedirect } from '@shared/utils/functions/view-mode-redirect.function';

export const filesRoutes: Routes = [
  {
    path: '',
    component: FilesComponent,
    children: [
      {
        path: '',
        component: FilesLayoutComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: viewModeRedirect('filesViewMode'),
          },
          {
            path: AppRoutes.list,
            component: FileListComponent,
          },
          {
            path: AppRoutes.table,
            component: FileTableComponent,
          },
        ],
      },
      {
        path: AppRoutes.new,
        component: FileEditComponent,
        title: RouteTitles.newFile,
      },
      {
        path: ':id',
        component: FileViewComponent,
        title: RouteTitles.file,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: AppRoutes.file,
          },
          {
            path: AppRoutes.file,
            component: FileMainComponent,
          },
          {
            path: AppRoutes.usages,
            component: FileUsagesComponent,
          },
        ],
      },
      {
        path: `:id/${AppRoutes.edit}`,
        component: FileEditComponent,
        canDeactivate: [unsavedDataGuard<FileEditComponent>()],
        title: RouteTitles.file,
      },
    ],
  },
];
