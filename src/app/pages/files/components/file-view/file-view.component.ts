import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { TabLink } from '@shared/shared.models';
import { AppRoutes } from '@app/app.constants';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { FilesState } from '@app/pages/files/state/files.state';
import { DeleteFiles, DownloadFile, FetchFile } from '@app/pages/files/state/files.actions';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';

@Component({
  selector: 'file-view',
  imports: [
    MatButton,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    UiSkeletonComponent,
    UpperCasePipe,
    EllipsisDirective,
    FallbackPipe,
    ToolbarComponent,
  ],
  templateUrl: './file-view.component.html',
  styleUrl: './file-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileViewComponent implements OnInit {
  protected readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly routeParams = toSignal(this.activatedRoute.params, { requireSync: true });
  protected readonly selectors = createSelectMap({
    isFileLoading: FilesState.isFileLoading$,
    file: FilesState.getFile$,
    isFileDownloading: FilesState.isFileDownloading$,
    isDeleteInProgress: FilesState.isDeleteInProgress$,
  });
  protected readonly actions = createDispatchMap({
    fetchFile: FetchFile,
    downloadFile: DownloadFile,
    deleteFiles: DeleteFiles,
  });
  protected readonly tabLinks: TabLink[] = [
    { link: AppRoutes.file, title: RouteTitles.file },
    { link: AppRoutes.usages, title: RouteTitles.usages },
  ];
  protected readonly AppRoutes = AppRoutes;
  protected readonly SharedLocalization = SharedLocalization;

  public ngOnInit(): void {
    this.actions.fetchFile(this.routeParams()['id'], this.destroyRef);
  }
}
