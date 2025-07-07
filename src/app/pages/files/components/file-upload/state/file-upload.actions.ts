import { Observable } from 'rxjs';
import { FileAsUrlFormGroup, FileUploadFormGroup } from '@app/pages/files/files.models';
import { DestroyRef } from '@angular/core';

export class UploadBlobByChunks {
  public static readonly type = '[FileUpload] Upload Blob By Chunks';
  constructor(
    readonly formValue: ReturnType<FileUploadFormGroup['getRawValue']>,
    readonly cancelUpload$: Observable<void>,
  ) {}
}

export class AddFileUrl {
  public static readonly type = '[FileUpload] Add File Url';
  constructor(
    readonly formValue: ReturnType<FileAsUrlFormGroup['getRawValue']>,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class UpdateFileMetadata {
  public static readonly type = '[FileUpload] Update File Metadata';
  constructor(
    readonly id: number,
    readonly formValue: Partial<
      ReturnType<FileUploadFormGroup['getRawValue']> & ReturnType<FileAsUrlFormGroup['getRawValue']>
    >,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class ResetFileUploadState {
  public static readonly type = '[FileUpload] Reset File Upload State';
}
