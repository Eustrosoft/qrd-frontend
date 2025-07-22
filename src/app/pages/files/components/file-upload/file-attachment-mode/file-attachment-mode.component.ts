import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { AttachmentModeListItem } from '@app/pages/files/files.models';
import { FilesLocalization } from '@app/pages/files/files.constants';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import { SetFileAttachmentMode } from '@app/pages/files/components/file-upload/state/file-upload.actions';

@Component({
  selector: 'file-attachment-mode',
  imports: [MatListItem, MatNavList],
  templateUrl: './file-attachment-mode.component.html',
  styleUrl: './file-attachment-mode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileAttachmentModeComponent {
  protected readonly selectors = createSelectMap({
    fileAttachmentMode: FileUploadState.getFileAttachmentMode$,
  });
  protected readonly actions = createDispatchMap({
    setFileAttachmentMode: SetFileAttachmentMode,
  });

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
}
