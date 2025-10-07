import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TABLE_CONTEXT, TableContext } from '@cdk/tokens/table.tokens';
import { FileDto } from '@api/files/files-api.models';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTableDataSource,
} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { SharedLocalization } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { FilesState } from '@app/pages/files/state/files.state';
import { DeleteFiles, FetchFileList, SetSelectedFiles } from '@app/pages/files/state/files.actions';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatMenuItem } from '@angular/material/menu';
import { TableContainerComponent } from '@shared/components/table-container/table-container.component';
import { MoreMenuComponent } from '@shared/components/more-menu/more-menu.component';
import { MatIcon } from '@angular/material/icon';
import { FilesLocalization } from '@app/pages/files/files.constants';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { BoolToTextPipe } from '@shared/pipe/bool-to-text.pipe';

@Component({
  selector: 'file-table',
  imports: [
    DatePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatMenuItem,
    TableContainerComponent,
    MatSort,
    MatHeaderCellDef,
    RouterLink,
    MatSortHeader,
    MoreMenuComponent,
    MatRow,
    MatRowDef,
    BytesToSizePipe,
    BoolToTextPipe,
  ],
  providers: [
    {
      provide: TABLE_CONTEXT,
      useFactory: (cmp: FileTableComponent): TableContext<FileDto, 'id'> => ({
        dataSource: cmp.dataSource,
        selectionModel: cmp.selectionModel,
        selectionKey: 'id',
        columns: cmp.displayedColumns,
      }),
      deps: [FileTableComponent],
    },
  ],
  templateUrl: './file-table.component.html',
  styleUrl: './file-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileTableComponent implements OnInit, AfterViewInit {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly activatedRoute = inject(ActivatedRoute);

  protected readonly FilesLocalization = FilesLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly AppRoutes = AppRoutes;

  protected readonly selectors = createSelectMap({
    isFileListLoading: FilesState.isFileListLoading$,
    isFileListLoadErr: FilesState.isFileListLoadErr$,
    fileList: FilesState.getFileList$,
    selectedFileList: FilesState.getSelectedFileList$,
  });
  protected readonly actions = createDispatchMap({
    fetchFileList: FetchFileList,
    setSelectedFiles: SetSelectedFiles,
    deleteFiles: DeleteFiles,
  });

  protected readonly sort = viewChild.required('sort', { read: MatSort });

  protected readonly displayedColumns = signal([
    'select',
    'name',
    'fileName',
    'description',
    'fileSize',
    'isPublic',
    'created',
    'actions',
  ]);
  protected readonly dataSource = new MatTableDataSource<FileDto>(this.selectors.fileList());
  protected readonly dataSourceEff = effect(() => {
    this.dataSource.data = this.selectors.fileList();
    this.dataSource.sort = this.sort();
  });

  protected readonly selectionModel = new SelectionModel<number>(true, this.selectors.selectedFileList());
  public readonly selectionChanged = output<number[]>();
  private readonly selEff = effect(() => {
    const selectedValues = this.selectors.selectedFileList();
    this.selectionModel.select(...selectedValues);
    if (!selectedValues.length) {
      this.selectionModel.clear();
    }
  });

  public ngOnInit(): void {
    this.actions.fetchFileList(this.destroyRef);
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
  }
}
