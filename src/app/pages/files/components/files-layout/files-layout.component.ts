import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FilesState } from '@app/pages/files/state/files.state';
import {
  FetchFileList,
  SelectAllFiles,
  SetFilesDataViewDisplayType,
  SetSelectedFiles,
} from '@app/pages/files/state/files.actions';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { SelectionActionsBarComponent } from '@shared/components/selection-actions-bar/selection-actions-bar.component';
import { MatIcon } from '@angular/material/icon';
import { FileListComponent } from '@app/pages/files/components/file-list/file-list.component';
import { expandAnimation } from '@shared/shared.animations';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'files-layout',
  imports: [DataViewComponent, SelectionActionsBarComponent, MatIcon, FileListComponent, MatMiniFabButton],
  animations: [expandAnimation],
  templateUrl: './files-layout.component.html',
  styleUrl: './files-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesLayoutComponent {
  protected readonly selectors = createSelectMap({
    displayType: FilesState.getDisplayType$,
    selectedFileList: FilesState.getSelectedFileList$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetFilesDataViewDisplayType,
    fetchFileList: FetchFileList,
    setSelectedFiles: SetSelectedFiles,
    selectAllFiles: SelectAllFiles,
  });

  protected openAdvancedSearch(): void {
    throw new Error('Not implemented');
  }
}
