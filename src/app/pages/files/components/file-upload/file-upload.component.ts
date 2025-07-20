import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListItem, MatNavList } from '@angular/material/list';
import {
  AttachmentModeListItem,
  FileAsUrlFormGroup,
  FileUploadFormGroup,
  UploadState,
} from '@app/pages/files/files.models';
import { FilesLocalization } from '@app/pages/files/files.constants';
import { FileDto } from '@api/files/file-api.models';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import {
  ResetFileUploadState,
  SetFileAttachmentMode,
} from '@app/pages/files/components/file-upload/state/file-upload.actions';
import { FileUploadBlobComponent } from '@app/pages/files/components/file-upload-blob/file-upload-blob.component';
import { FileAsUrlComponent } from '@app/pages/files/components/file-as-url/file-as-url.component';
import { FileUploadFormFactoryService } from '@app/pages/files/components/file-upload/service/file-upload-form-factory.service';

@Component({
  selector: 'file-upload',
  imports: [FormsModule, MatListItem, ReactiveFormsModule, MatNavList, FileUploadBlobComponent, FileAsUrlComponent],
  providers: [FileUploadFormFactoryService],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit, OnDestroy {
  public readonly fileUploadFormFactoryService = inject(FileUploadFormFactoryService);

  protected readonly selectors = createSelectMap({
    fileAttachmentMode: FileUploadState.getFileAttachmentMode$,
    isLoading: FileUploadState.isLoading$,
    uploadState: FileUploadState.getUploadState$,
  });
  protected readonly actions = createDispatchMap({
    setFileAttachmentMode: SetFileAttachmentMode,
    resetFileUploadState: ResetFileUploadState,
  });

  public readonly fileMetadata = input<FileDto | null>(null);
  public readonly uploadCompleted = output<UploadState | null>();

  protected readonly attachmentModeList: AttachmentModeListItem[] = [
    {
      mode: 'upload',
      title: FilesLocalization.uploadFile,
    },
    {
      mode: 'fileUrl',
      title: FilesLocalization.linkFile,
    },
  ];

  public ngOnInit(): void {
    if (this.fileMetadata()?.storagePath) {
      this.actions.setFileAttachmentMode('fileUrl');
    } else {
      this.actions.setFileAttachmentMode('upload');
    }
  }

  public getFileUploadFormRawValue(): ReturnType<FileUploadFormGroup['getRawValue']> {
    return this.fileUploadFormFactoryService.fileUploadForm.getRawValue();
  }

  public getFileAsUrlFormRawValue(): ReturnType<FileAsUrlFormGroup['getRawValue']> {
    return this.fileUploadFormFactoryService.fileAsUrlForm.getRawValue();
  }

  public ngOnDestroy(): void {
    this.actions.resetFileUploadState();
    this.fileUploadFormFactoryService.dispose();
  }
}
