import { ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject } from '@angular/core';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FilesState } from '@app/pages/files/state/files.state';
import {
  DeleteFiles,
  FetchFileList,
  SelectAllFiles,
  SetFilesDataViewDisplayType,
  SetSelectedFiles,
} from '@app/pages/files/state/files.actions';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { SelectionBarComponent } from '@shared/components/selection-bar/selection-bar.component';
import { MatIcon } from '@angular/material/icon';
import { FileListComponent } from '@app/pages/files/components/file-list/file-list.component';
import { expandAnimation } from '@shared/shared.animations';
import { MatMiniFabButton } from '@angular/material/button';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';

@Component({
  selector: 'files-layout',
  imports: [
    DataViewComponent,
    SelectionBarComponent,
    MatIcon,
    FileListComponent,
    MatMiniFabButton,
    UiSkeletonComponent,
  ],
  animations: [expandAnimation],
  templateUrl: './files-layout.component.html',
  styleUrl: './files-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesLayoutComponent {
  protected readonly uiSidenavService = inject(UiSidenavService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly document = inject(DOCUMENT);

  protected readonly selectors = createSelectMap({
    displayType: FilesState.getDisplayType$,
    selectedFileList: FilesState.getSelectedFileList$,
    isDeleteInProgress: FilesState.isDeleteInProgress$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetFilesDataViewDisplayType,
    fetchFileList: FetchFileList,
    setSelectedFiles: SetSelectedFiles,
    selectAllFiles: SelectAllFiles,
    deleteFiles: DeleteFiles,
  });

  protected openAdvancedSearch(): void {
    this.uiSidenavService.open(MatIcon, {
      content: [[this.document.createTextNode('database_search')]],
    });
  }
}
