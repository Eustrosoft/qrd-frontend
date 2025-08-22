import { ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject } from '@angular/core';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FilesState } from '@app/pages/files/state/files.state';
import {
  DeleteFiles,
  FetchFileList,
  SelectAllFiles,
  SetFileListSearchValue,
  SetSelectedFiles,
} from '@app/pages/files/state/files.actions';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { SelectionBarComponent } from '@shared/components/selection-bar/selection-bar.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { AnimatedIfDirective } from '@shared/directives/animated-if.directive';
import { SharedLocalization } from '@shared/shared.constants';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'files-layout',
  imports: [
    DataViewComponent,
    SelectionBarComponent,
    MatIcon,
    MatMiniFabButton,
    UiSkeletonComponent,
    AnimatedIfDirective,
    RouterOutlet,
  ],
  templateUrl: './files-layout.component.html',
  styleUrl: './files-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesLayoutComponent {
  protected readonly uiSidenavService = inject(UiSidenavService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly document = inject(DOCUMENT);
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly selectors = createSelectMap({
    searchValue: FilesState.getSearchValue$,
    selectedFileList: FilesState.getSelectedFileList$,
    isDeleteInProgress: FilesState.isDeleteInProgress$,
  });
  protected readonly actions = createDispatchMap({
    fetchFileList: FetchFileList,
    setFileListSearchValue: SetFileListSearchValue,
    setSelectedFiles: SetSelectedFiles,
    selectAllFiles: SelectAllFiles,
    deleteFiles: DeleteFiles,
  });

  protected openAdvancedSearch(): void {
    this.uiSidenavService.open(MatButton, {
      content: [[this.document.createTextNode(SharedLocalization.close)]],
      position: 'end',
    });
    const closeAction = (): void => {
      this.uiSidenavService.close();
      this.uiSidenavService.sidenavCmpRef()?.location.nativeElement.removeEventListener('click', closeAction);
    };
    this.uiSidenavService.sidenavCmpRef()?.location.nativeElement.addEventListener('click', closeAction);
  }
}
