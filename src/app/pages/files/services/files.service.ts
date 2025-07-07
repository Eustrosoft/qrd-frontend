import { DOCUMENT, inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
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
} from 'rxjs';
import {
  FileBlobUploadRequest,
  FileBlobUploadResponse,
  FileDto,
  FileUrlUploadRequest,
} from '@api/files/file-api.models';
import { FileReaderService } from '@app/pages/files/services/file-reader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedLocalization } from '@shared/shared.constants';
import { FileUploadFormGroup, UploadState } from '@app/pages/files/files.models';
import { DEFAULT_CHUNK_SIZE } from '@app/pages/files/files.constants';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  private readonly fileReaderService = inject(FileReaderService);
  private readonly matSnackBar = inject(MatSnackBar);

  public getFileList(): Observable<FileDto[]> {
    return this.http.get<FileDto[]>('/qrCodeDemo/v1/api/secured/files');
  }

  public getFile(id: number): Observable<FileDto> {
    return this.http.get<FileDto>(`/qrCodeDemo/v1/api/secured/files/${id}`);
  }

  public uploadFile(
    formValue: ReturnType<FileUploadFormGroup['getRawValue']>,
    cancelUpload$: Observable<void>,
  ): Observable<UploadState> {
    const { file, name, description, isPublic, isActive } = formValue;
    if (!file) {
      this.matSnackBar.open(SharedLocalization.noFiles);
      return of();
    }
    let uploadFileId: number | null = null;
    return merge(
      this.fileReaderService.splitBinary(file).pipe(
        concatMap((chunks) => combineLatest([scheduled(chunks, asyncScheduler), of(chunks.length)])),
        concatMap(([chunk, total], index) =>
          this.uploadBlobFile({
            chunk,
            chunkSize: DEFAULT_CHUNK_SIZE,
            no: index + 1,
            total,
            name,
            description,
            public: isPublic,
            active: isActive,
            fileId: uploadFileId,
          }).pipe(
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
        catchError(() =>
          of<UploadState>({
            progress: 0,
            isDone: false,
            isLoading: false,
            isCancelled: false,
            isError: true,
            fileId: uploadFileId,
          }),
        ),
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
    );
  }

  public uploadBlobFile(formData: FileBlobUploadRequest): Observable<FileBlobUploadResponse> {
    const fd = new FormData();
    fd.append('chunk', formData.chunk);
    fd.append('no', formData.no.toString());
    fd.append('total', formData.total.toString());
    fd.append('chunkSize', formData.chunkSize.toString());
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('public', formData.public.toString());
    fd.append('active', formData.active.toString());
    if (formData.fileId) {
      fd.append('fileId', formData.fileId.toString());
    }
    return this.http.post<FileBlobUploadResponse>('/qrCodeDemo/v1/api/secured/files/upload/blob', fd);
  }

  public addFileUrl(formData: FileUrlUploadRequest): Observable<FileDto> {
    const fd = new FormData();
    fd.append('storagePath', formData.storagePath);
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('public', formData.public.toString());
    fd.append('active', formData.active.toString());
    fd.append('fileStorageType', formData.fileStorageType);
    return this.http.post<FileDto>('/qrCodeDemo/v1/api/secured/files/upload', fd);
  }

  public updateFileMetadata(id: number, metadata: Partial<FileDto>): Observable<FileDto> {
    return this.http.put<FileDto>(`/qrCodeDemo/v1/api/secured/files/${id}`, metadata);
  }

  public downloadFile(id: number, fileName: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`/qrCodeDemo/v1/api/secured/files/${id}/download/${fileName}`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  public saveBlobToFile(file: Blob, fileName: string): void {
    const link = this.document.createElement('a');
    const objectUrl = URL.createObjectURL(file);
    link.href = objectUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(objectUrl);
  }
}
