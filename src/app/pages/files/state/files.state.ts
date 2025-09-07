import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { FileDto } from '@api/files/files-api.models';
import {
  catchError,
  concatMap,
  EMPTY,
  from,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
  timer,
  toArray,
  zip,
} from 'rxjs';
import { patch } from '@ngxs/store/operators';
import { AppRoutes, DEFAULT_ITEMS_PER_PAGE, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DeleteFiles,
  DownloadFile,
  FetchFile,
  FetchFileList,
  FetchFileUsages,
  SelectAllFiles,
  SetFileListSearchValue,
  SetSelectedFiles,
} from '@app/pages/files/state/files.actions';
import { FilesService } from '@app/pages/files/services/files.service';
import { HttpResponse } from '@angular/common/http';
import { ContentDispositionHeaderParsePipe } from '@shared/pipe/content-disposition-header-parse.pipe';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { DeletionDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.constants';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@shared/service/snackbar.service';
import { ErrorsLocalization, NotificationSnackbarLocalization } from '@modules/error/error.constants';
import { WINDOW } from '@cdk/tokens/window.token';
import { EntityDto } from '@api/api.models';

export interface FilesStateModel {
  searchValue: string;
  isFileListLoading: boolean;
  fileListSkeletonLoaders: number;
  fileList: FileDto[];
  selectedFileList: number[];
  isFileLoading: boolean;
  isFileLoadErr: boolean;
  file: FileDto | null;
  isFileUsagesLoading: boolean;
  qrFileUsages: EntityDto[] | null;
  templateFileUsages: EntityDto[] | null;
  isFileDownloading: boolean;
  isDeleteInProgress: boolean;
}

const defaults: FilesStateModel = {
  searchValue: '',
  isFileListLoading: false,
  fileListSkeletonLoaders: DEFAULT_ITEMS_PER_PAGE,
  fileList: [],
  selectedFileList: [],
  isFileLoading: false,
  isFileLoadErr: false,
  file: null,
  isFileUsagesLoading: false,
  qrFileUsages: null,
  templateFileUsages: null,
  isFileDownloading: false,
  isDeleteInProgress: false,
} as const;

const FILES_STATE_TOKEN: StateToken<FilesStateModel> = new StateToken<FilesStateModel>('files');

@State<FilesStateModel>({
  name: FILES_STATE_TOKEN,
  defaults,
})
@Injectable()
export class FilesState {
  private readonly filesService = inject(FilesService);
  private readonly contentDispositionHeaderParsePipe = inject(ContentDispositionHeaderParsePipe);
  private readonly router = inject(Router);
  private readonly pxToRemPipe = inject(PxToRemPipe);
  private readonly matDialog = inject(MatDialog);
  private readonly snackbarService = inject(SnackbarService);
  private readonly window = inject(WINDOW);

  @Selector()
  public static getSearchValue$({ searchValue }: FilesStateModel): string {
    return searchValue;
  }

  @Selector()
  public static isFileListLoading$({ isFileListLoading }: FilesStateModel): boolean {
    return isFileListLoading;
  }

  @Selector()
  public static getFileListSkeletonLoaders$({ fileListSkeletonLoaders }: FilesStateModel): number[] {
    return Array.from({ length: fileListSkeletonLoaders }, (_, i) => i);
  }

  @Selector()
  public static getFileList$({ fileList, searchValue }: FilesStateModel): FileDto[] {
    return fileList.filter(
      (file) => file.name.toLowerCase().includes(searchValue) || file.description.toLowerCase().includes(searchValue),
    );
  }

  @Selector()
  public static isFileLoading$({ isFileLoading }: FilesStateModel): boolean {
    return isFileLoading;
  }

  @Selector()
  public static isFileLoadErr$({ isFileLoadErr }: FilesStateModel): boolean {
    return isFileLoadErr;
  }

  @Selector()
  public static isFileDownloading$({ isFileDownloading }: FilesStateModel): boolean {
    return isFileDownloading;
  }

  @Selector()
  public static isDeleteInProgress$({ isDeleteInProgress }: FilesStateModel): boolean {
    return isDeleteInProgress;
  }

  @Selector()
  public static getFile$({ file }: FilesStateModel): FileDto | null {
    return file;
  }

  @Selector()
  public static getFileUsagesState$({
    isFileUsagesLoading,
    qrFileUsages,
    templateFileUsages,
  }: FilesStateModel): Pick<FilesStateModel, 'isFileUsagesLoading' | 'qrFileUsages' | 'templateFileUsages'> {
    return {
      isFileUsagesLoading,
      qrFileUsages,
      templateFileUsages,
    };
  }

  @Selector()
  public static getSelectedFileList$({ selectedFileList }: FilesStateModel): number[] {
    return selectedFileList;
  }

  @Action(FetchFileList)
  public fetchFileList(
    { setState }: StateContext<FilesStateModel>,
    { destroyRef }: FetchFileList,
  ): Observable<FileDto[]> {
    setState(patch({ isFileListLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.filesService.getFileList()),
      tap({
        next: (fileList) => {
          setState(patch({ fileList, isFileListLoading: false }));
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnFetchList);
        setState(patch({ isFileListLoading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(SetFileListSearchValue)
  public setFileListSearchValue(
    { setState }: StateContext<FilesStateModel>,
    { searchValue }: SetFileListSearchValue,
  ): void {
    setState(patch({ searchValue: searchValue.trim().toLowerCase(), selectedFileList: [] }));
  }

  @Action(FetchFile)
  public fetchFile({ setState }: StateContext<FilesStateModel>, { id, destroyRef }: FetchFile): Observable<FileDto> {
    setState(patch({ isFileLoading: true, isFileLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.filesService.getFile(id)),
      tap({
        next: (file) => {
          setState(patch({ file, isFileLoading: false }));
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnFetch);
        setState(patch({ isFileLoading: false, isFileLoadErr: true }));
        return throwError(() => err);
      }),
    );
  }

  @Action(FetchFileUsages)
  public fetchFileUsages(
    { setState }: StateContext<FilesStateModel>,
    { id, destroyRef }: FetchFileUsages,
  ): Observable<unknown> {
    setState(patch({ isFileUsagesLoading: true, isFileLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() =>
        zip([this.filesService.getFileUsages(id, { type: 'QR' }), this.filesService.getFileUsages(id, { type: 'FM' })]),
      ),
      tap({
        next: ([qrFileUsages, templateFileUsages]) => {
          setState(patch({ qrFileUsages, templateFileUsages, isFileUsagesLoading: false }));
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnFetch);
        setState(patch({ isFileUsagesLoading: false, isFileLoadErr: true }));
        return throwError(() => err);
      }),
    );
  }

  @Action(SetSelectedFiles)
  public setSelectedFiles({ setState }: StateContext<FilesStateModel>, { selectedFileList }: SetSelectedFiles): void {
    setState(patch({ selectedFileList }));
  }

  @Action(SelectAllFiles)
  public selectedAllFiles({ setState, getState }: StateContext<FilesStateModel>): void {
    const { fileList } = getState();
    setState(patch({ selectedFileList: fileList.map((file) => file.id) }));
  }

  @Action(DownloadFile)
  public downloadFile(
    { setState }: StateContext<FilesStateModel>,
    { id, fileName, fileStorageType, storagePath }: DownloadFile,
  ): Observable<HttpResponse<Blob>> {
    if (fileStorageType === 'URL' || fileStorageType === 'S3') {
      this.window.open(storagePath, '_blank', 'noreferrer');
      return of();
    }

    setState(patch({ isFileDownloading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.filesService.downloadFile(id, encodeURIComponent(fileName))),
      tap({
        next: (response: HttpResponse<Blob>) => {
          setState(patch({ isFileDownloading: false }));
          const filename = this.contentDispositionHeaderParsePipe.transform(
            response.headers.get('content-disposition'),
            fileName,
          );
          this.filesService.saveBlobToFile(response?.body ?? new Blob([]), filename);
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(ErrorsLocalization.errorDownloadingFile);
        setState(patch({ isFileDownloading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(DeleteFiles)
  public deleteFiles(
    { setState, dispatch }: StateContext<FilesStateModel>,
    { idList, destroyRef, refreshList, returnToList }: DeleteFiles,
  ): Observable<void[]> {
    setState(patch({ isDeleteInProgress: true }));

    const matDialogRef = this.matDialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        data: DeletionDialogData,
        width: this.pxToRemPipe.transform('600'),
      },
    );

    return matDialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (!result) {
          setState(patch({ isDeleteInProgress: false }));
          return EMPTY;
        }
        return from(idList).pipe(
          concatMap((id) => this.filesService.deleteFile(id)),
          toArray(),
          tap({
            next: () => {
              this.snackbarService.success(NotificationSnackbarLocalization.deleted);
              setState(patch({ isDeleteInProgress: false }));
              dispatch(new SetSelectedFiles([]));
              if (refreshList) {
                dispatch(FetchFileList);
              }
              if (returnToList) {
                this.router.navigate(['/', AppRoutes.files]);
              }
            },
          }),
        );
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnDelete);
        setState(patch({ isDeleteInProgress: false }));
        dispatch(new SetSelectedFiles([]));
        return throwError(() => err);
      }),
    );
  }
}
