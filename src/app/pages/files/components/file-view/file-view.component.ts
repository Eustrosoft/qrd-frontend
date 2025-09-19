import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
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
import { DeleteFiles, DownloadFile, FetchFile, FetchFileUsages } from '@app/pages/files/state/files.actions';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { Title } from '@angular/platform-browser';

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
    BannerComponent,
  ],
  templateUrl: './file-view.component.html',
  styleUrl: './file-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileViewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly routeParams = toSignal(this.activatedRoute.params, { requireSync: true });

  protected readonly selectors = createSelectMap({
    isFileLoading: FilesState.isFileLoading$,
    isFileLoadErr: FilesState.isFileLoadErr$,
    file: FilesState.getFile$,
    fileUsagesState: FilesState.getFileUsagesState$,
    isFileDownloading: FilesState.isFileDownloading$,
    isDeleteInProgress: FilesState.isDeleteInProgress$,
  });

  protected readonly actions = createDispatchMap({
    fetchFile: FetchFile,
    fetchFileUsages: FetchFileUsages,
    downloadFile: DownloadFile,
    deleteFiles: DeleteFiles,
  });

  protected readonly titleEff = effect(() => {
    this.title.setTitle(
      `${SharedLocalization.defaultTitle} | ${RouteTitles.file} ${this.selectors.file()?.name ?? ''}`,
    );
  });

  protected readonly tabLinks: TabLink[] = [
    { link: AppRoutes.file, title: RouteTitles.file },
    { link: AppRoutes.usages, title: RouteTitles.usages },
  ];

  protected readonly AppRoutes = AppRoutes;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;

  public ngOnInit(): void {
    this.actions.fetchFile(this.routeParams()['id'], this.destroyRef);
    this.actions.fetchFileUsages(this.routeParams()['id'], this.destroyRef);
  }
}
