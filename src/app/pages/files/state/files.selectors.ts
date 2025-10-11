import { createPickSelector, createPropertySelectors, createSelector } from '@ngxs/store';
import { FilesState, FilesStateModel } from '@app/pages/files/state/files.state';

export class FilesSelectors {
  private static readonly getFullState = createSelector([FilesState], (state: FilesStateModel) => state);

  public static getSlices = createPropertySelectors<FilesStateModel>(FilesState);

  public static getFileListSkeletonLoaders$ = createSelector(
    [FilesSelectors.getSlices.fileListSkeletonLoaders],
    (length) => Array.from({ length }, (_, i) => i),
  );

  public static getFileList$ = createSelector(
    [FilesSelectors.getSlices.fileList, FilesSelectors.getSlices.searchValue],
    (fileList, searchValue) =>
      fileList.filter(
        (file) => file.name.toLowerCase().includes(searchValue) || file.description.toLowerCase().includes(searchValue),
      ),
  );

  public static getFileUsagesState$ = createPickSelector(FilesSelectors.getFullState, [
    'isFileUsagesLoading',
    'qrFileUsages',
    'templateFileUsages',
  ]);
}
