import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { DataViewDisplayType } from '@shared/shared.models';
import { FileDto } from '@api/files/file-api.models';
import { catchError, Observable, switchMap, tap, throwError, timer } from 'rxjs';
import { patch } from '@ngxs/store/operators';
import { SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DownloadFile,
  FetchFile,
  FetchFileList,
  SelectAllFiles,
  SetFilesDataViewDisplayType,
  SetSelectedFiles,
} from '@app/pages/files/state/files.actions';
import { FilesService } from '@app/pages/files/services/files.service';
import { HttpResponse } from '@angular/common/http';
import { ContentDispositionHeaderParsePipe } from '@shared/pipe/content-disposition-header-parse.pipe';

export interface FilesStateModel {
  displayType: DataViewDisplayType;
  isFileListLoading: boolean;
  fileList: FileDto[];
  selectedFileList: number[];
  isFileLoading: boolean;
  file: FileDto | null;
  isFileDownloading: boolean;
}

const defaults: FilesStateModel = {
  displayType: 'list',
  isFileListLoading: false,
  fileList: [],
  selectedFileList: [],
  isFileLoading: false,
  file: null,
  isFileDownloading: false,
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

  @Selector()
  public static getDisplayType$({ displayType }: FilesStateModel): DataViewDisplayType {
    return displayType;
  }

  @Selector()
  public static isFileListLoading$({ isFileListLoading }: FilesStateModel): boolean {
    return isFileListLoading;
  }

  @Selector()
  public static getFileList$({ fileList }: FilesStateModel): FileDto[] {
    return fileList;
  }

  @Selector()
  public static isFileLoading$({ isFileLoading }: FilesStateModel): boolean {
    return isFileLoading;
  }

  @Selector()
  public static isFileDownloading$({ isFileDownloading }: FilesStateModel): boolean {
    return isFileDownloading;
  }

  @Selector()
  public static getFile$({ file }: FilesStateModel): FileDto | null {
    return file;
  }

  @Selector()
  public static getSelectedFileList$({ selectedFileList }: FilesStateModel): number[] {
    return selectedFileList;
  }

  @Action(FetchFileList)
  public fetchFileList({ setState }: StateContext<FilesStateModel>): Observable<FileDto[]> {
    setState(patch({ isFileListLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.filesService.getFileList()),
      tap({
        next: (fileList) => {
          setState(patch({ fileList, isFileListLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isFileListLoading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(FetchFile)
  public fetchFile({ setState }: StateContext<FilesStateModel>, { id, destroyRef }: FetchFile): Observable<FileDto> {
    setState(patch({ isFileLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.filesService.getFile(id)),
      tap({
        next: (file) => {
          setState(patch({ file, isFileLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isFileLoading: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
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

  @Action(SetFilesDataViewDisplayType)
  public setDisplayType(
    { setState }: StateContext<FilesStateModel>,
    { displayType }: SetFilesDataViewDisplayType,
  ): void {
    setState(patch({ displayType }));
  }

  @Action(DownloadFile)
  public downloadFile(
    { setState }: StateContext<FilesStateModel>,
    { id, fileName }: DownloadFile,
  ): Observable<HttpResponse<Blob>> {
    setState(patch({ isFileDownloading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.filesService.downloadFile(id, fileName)),
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
        setState(patch({ isFileDownloading: false }));
        return throwError(() => err);
      }),
    );
  }
}
