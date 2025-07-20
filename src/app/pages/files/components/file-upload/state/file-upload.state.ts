import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  AddFileUrl,
  ResetFileUploadState,
  SetFileAttachmentMode,
  UpdateFileMetadata,
  UploadBlobByChunks,
} from './file-upload.actions';
import { DEFAULT_FILE_UPLOAD_STATE } from '@app/pages/files/files.constants';
import { FileAttachmentMode, UploadState } from '@app/pages/files/files.models';
import { FileReaderService } from '@app/pages/files/services/file-reader.service';
import { SharedLocalization } from '@shared/shared.constants';
import {
  asyncScheduler,
  catchError,
  combineLatest,
  concatMap,
  endWith,
  map,
  merge,
  Observable,
  of,
  scheduled,
  startWith,
  takeUntil,
  takeWhile,
  tap,
  throwError,
} from 'rxjs';
import { FileBlobUploadResponse, FileDto } from '@api/files/file-api.models';
import { FilesService } from '@app/pages/files/services/files.service';
import { patch } from '@ngxs/store/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SnackbarService } from '@shared/service/snackbar.service';
import { ErrorsLocalization, NotificationSnackbarLocalization } from '@modules/error/error.constants';

export interface FileUploadStateModel {
  fileAttachmentMode: FileAttachmentMode;
  isLoading: boolean;
  uploadState: UploadState | null;
}

@State<FileUploadStateModel>({
  name: 'fileUpload',
  defaults: DEFAULT_FILE_UPLOAD_STATE,
})
@Injectable()
export class FileUploadState {
  private readonly fileReaderService = inject(FileReaderService);
  private readonly filesService = inject(FilesService);
  private readonly snackbarService = inject(SnackbarService);

  @Selector()
  public static getFileAttachmentMode$({ fileAttachmentMode }: FileUploadStateModel): FileAttachmentMode {
    return fileAttachmentMode;
  }

  @Selector()
  public static isLoading$({ isLoading }: FileUploadStateModel): boolean {
    return isLoading;
  }

  @Selector()
  public static getUploadState$({ uploadState }: FileUploadStateModel): UploadState | null {
    return uploadState;
  }

  @Action(SetFileAttachmentMode)
  public setFileAttachmentMode(
    { setState }: StateContext<FileUploadStateModel>,
    { fileAttachmentMode }: SetFileAttachmentMode,
  ): void {
    setState(patch({ fileAttachmentMode }));
  }

  @Action(UploadBlobByChunks)
  public uploadBlobByChunks(
    { setState }: StateContext<FileUploadStateModel>,
    { formValue, cancelUpload$ }: UploadBlobByChunks,
  ): Observable<UploadState> {
    const { file, name, description, isPublic, isActive } = formValue;
    if (!file) {
      this.snackbarService.open(SharedLocalization.noFiles);
      return of();
    }
    let uploadFileId: number | null = null;
    return merge(
      this.fileReaderService.splitBinary(file).pipe(
        concatMap((chunks) => combineLatest([scheduled(chunks, asyncScheduler), of(chunks.length)])),
        concatMap(([chunk, total], index) =>
          this.filesService
            .uploadBlobFile({
              chunk,
              originName: file.name,
              fileSize: file.size,
              chunkSize: chunk.size,
              no: index + 1,
              total,
              name,
              description,
              public: isPublic,
              active: isActive,
              fileId: uploadFileId,
            })
            .pipe(
              map<FileBlobUploadResponse, UploadState>(({ fileId, no }) => {
                uploadFileId = fileId;
                return {
                  progress: Math.round(((index + 1) / total) * 100),
                  isDone: no === total,
                  isLoading: no !== total,
                  isCancelled: false,
                  isError: false,
                  fileId: uploadFileId,
                };
              }),
            ),
        ),
        startWith<UploadState>({
          progress: 5,
          isDone: false,
          isLoading: true,
          isCancelled: false,
          isError: false,
          fileId: uploadFileId,
        }),
        endWith<UploadState>({
          progress: 0,
          isDone: true,
          isLoading: false,
          isCancelled: false,
          isError: false,
          fileId: null,
        }),
        catchError(() => {
          this.snackbarService.danger(ErrorsLocalization.errorUploadingFile);
          return of<UploadState>({
            progress: 0,
            isDone: false,
            isLoading: false,
            isCancelled: false,
            isError: true,
            fileId: uploadFileId,
          });
        }),
        takeUntil(cancelUpload$),
      ),
      cancelUpload$.pipe(
        map<void, UploadState>(() => ({
          progress: 0,
          isDone: false,
          isLoading: false,
          isCancelled: true,
          isError: false,
          fileId: uploadFileId,
        })),
      ),
    ).pipe(
      tap({
        next: (uploadState: UploadState) => {
          setState(
            patch({
              uploadState,
            }),
          );
        },
      }),
      takeWhile((state: UploadState) => !(state.isDone || state.isCancelled || state.isError)),
    );
  }

  @Action(AddFileUrl)
  public addFileUrl(
    { setState }: StateContext<FileUploadStateModel>,
    { formValue, destroyRef }: AddFileUrl,
  ): Observable<FileDto> {
    setState(
      patch({
        isLoading: true,
        uploadState: {
          progress: 0,
          isDone: false,
          isLoading: true,
          isCancelled: false,
          isError: false,
          fileId: null,
        },
      }),
    );
    const { name, description, isPublic, isActive, storagePath } = formValue;
    return this.filesService
      .addFileUrl({
        storagePath,
        name,
        description,
        public: isPublic,
        active: isActive,
        fileStorageType: 'URL',
      })
      .pipe(
        tap({
          next: (file: FileDto) => {
            this.snackbarService.danger(NotificationSnackbarLocalization.created);
            setState(
              patch({
                isLoading: false,
                uploadState: {
                  progress: 100,
                  isDone: true,
                  isLoading: false,
                  isCancelled: false,
                  isError: false,
                  fileId: file.id,
                },
              }),
            );
          },
        }),
        catchError((err) => {
          this.snackbarService.danger(ErrorsLocalization.errorAddingFileUrl);
          setState(
            patch({
              isLoading: false,
              uploadState: {
                progress: 0,
                isDone: false,
                isLoading: false,
                isCancelled: false,
                isError: true,
                fileId: null,
              },
            }),
          );
          return throwError(() => err);
        }),
        takeUntilDestroyed(destroyRef),
      );
  }

  @Action(UpdateFileMetadata)
  public updateFileMetadata(
    { setState }: StateContext<FileUploadStateModel>,
    { id, formValue, destroyRef }: UpdateFileMetadata,
  ): Observable<FileDto> {
    setState(patch({ isLoading: true }));
    const { name, description, isPublic, isActive, storagePath } = formValue;
    return this.filesService
      .updateFileMetadata(id, {
        storagePath,
        name,
        description,
        isPublic,
        isActive,
      })
      .pipe(
        tap({
          next: () => {
            this.snackbarService.success(NotificationSnackbarLocalization.saved);
            setState(patch({ isLoading: false }));
          },
        }),
        catchError((err) => {
          this.snackbarService.danger(ErrorsLocalization.errorUpdatingFileMetadata);
          setState(patch({ isLoading: false }));
          return throwError(() => err);
        }),
        takeUntilDestroyed(destroyRef),
      );
  }

  @Action(ResetFileUploadState)
  public resetFileUploadState({ setState }: StateContext<FileUploadStateModel>): void {
    setState(DEFAULT_FILE_UPLOAD_STATE);
  }
}
