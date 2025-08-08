import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { ViewListItemComponent } from '@shared/components/view-list-item/view-list-item.component';
import { SelectionModel } from '@angular/cdk/collections';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { MatMenuItem } from '@angular/material/menu';
import { SharedLocalization } from '@shared/shared.constants';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { MatIcon } from '@angular/material/icon';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FilesState } from '@app/pages/files/state/files.state';
import { DeleteFiles, FetchFileList, SetFilesDataViewDisplayType } from '@app/pages/files/state/files.actions';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { DatePipe } from '@angular/common';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { AppRoutes } from '@app/app.constants';
import { FileDto } from '@api/files/files-api.models';
import { RangeSelectorService } from '@shared/service/range-selector.service';

@Component({
  selector: 'file-list',
  imports: [
    UiFlexBlockComponent,
    ViewListItemComponent,
    EllipsisDirective,
    MatMenuItem,
    UiSkeletonComponent,
    MatIcon,
    RouterLink,
    UiBadgeComponent,
    BytesToSizePipe,
    DatePipe,
    FallbackPipe,
  ],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RangeSelectorService],
})
export class FileListComponent implements OnInit {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly rangeSelectorService = inject(RangeSelectorService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly selectors = createSelectMap({
    displayType: FilesState.getDisplayType$,
    isFileListLoading: FilesState.isFileListLoading$,
    fileListSkeletonLoaders: FilesState.getFileListSkeletonLoaders$,
    fileList: FilesState.getFileList$,
    selectedFileList: FilesState.getSelectedFileList$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetFilesDataViewDisplayType,
    fetchFileList: FetchFileList,
    deleteFiles: DeleteFiles,
  });

  protected readonly selectionModel = new SelectionModel(true, this.selectors.selectedFileList());
  public readonly selectionChanged = outputFromObservable(
    this.selectionModel.changed.asObservable().pipe(map(() => this.selectionModel.selected)),
  );
  private readonly selEff = effect(() => {
    const selectedValues = this.selectors.selectedFileList();
    this.selectionModel.select(...selectedValues);
    this.rangeSelectorService.updateLastSelectedId(this.selectionModel);
    if (!selectedValues.length) {
      this.selectionModel.clear();
    }
  });

  protected readonly AppRoutes = AppRoutes;
  protected readonly SharedLocalization = SharedLocalization;

  public ngOnInit(): void {
    this.actions.fetchFileList();
  }

  protected makeSelect(item: FileDto): void {
    this.rangeSelectorService.selectItemOrRange(this.selectors.fileList(), this.selectionModel, item);
  }

  protected fetchMore(): void {
    throw new Error('Not implemented');
  }
}
