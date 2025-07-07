import { ChangeDetectionStrategy, Component, input, model, OnDestroy, OnInit, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListItem, MatNavList } from '@angular/material/list';
import { AttachmentModeListItem, FileAttachmentMode } from '@modules/file/file.models';
import { FilesLocalization } from '@modules/file/file.constants';
import { FileDto } from '@api/files/file-api.models';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FileUploadState } from '@modules/file/state/file-upload.state';
import {
  AddFileUrl,
  ResetFileUploadState,
  UpdateFileMetadata,
  UploadBlobByChunks,
} from '@modules/file/state/file-upload.actions';
import { FileUploadBlobComponent } from '@app/pages/files/components/file-upload-blob/file-upload-blob.component';
import { FileAsUrlComponent } from '@app/pages/files/components/file-add-url/file-as-url.component';

@Component({
  selector: 'file-upload',
  imports: [FormsModule, MatListItem, ReactiveFormsModule, MatNavList, FileUploadBlobComponent, FileAsUrlComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit, OnDestroy {
  protected readonly selectors = createSelectMap({
    isLoading: FileUploadState.isLoading$,
    uploadState: FileUploadState.getUploadState$,
  });
  protected readonly actions = createDispatchMap({
    uploadBlobByChunks: UploadBlobByChunks,
    addFileUrl: AddFileUrl,
    updateFileMetadata: UpdateFileMetadata,
    resetFileUploadState: ResetFileUploadState,
  });

  public readonly fileAttachmentMode = model<FileAttachmentMode>('upload');
  public readonly fileMetadata = input<FileDto | null>(null);
  public readonly uploadCompleted = output<number | null>();

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
      this.fileAttachmentMode.set('fileUrl');
    }
  }

  public ngOnDestroy(): void {
    this.actions.resetFileUploadState();
  }
}
