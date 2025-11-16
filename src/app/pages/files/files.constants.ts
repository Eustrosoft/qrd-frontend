import { FileUploadStateModel } from '@app/pages/files/components/file-upload/state/file-upload.state';

export const DefaultFileUploadState: FileUploadStateModel = {
  isLoading: false,
  uploadState: null,
  fileAttachmentMode: 'upload',
};

export const DefaultChunkSize = 1048576; // 1 MB
export const MaxNameLength = 127;
export const MaxDescriptionLength = 511;
export const MaxUrlLength = 2048;

export const FilesLocalization = {
  selectFile: $localize`:@@files.selectFile:Select file`,
  selectExisting: $localize`:@@files.selectExisting:Select existing file`,
  uploadFile: $localize`:@@files.uploadFile:Upload file`,
  linkFile: $localize`:@@files.linkFile:Link file`,
  linkPath: $localize`:@@files.linkPath:Link`,
  upload: $localize`:@@files.upload:Upload`,
  uploaded: $localize`:@@files.uploaded:Uploaded`,
  fileRequired: $localize`:@@files.fileRequired:File is required`,
  fileSize: $localize`:@@files.fileSize:File size`,
  duplicatedFiles: $localize`:@@files.duplicatedFiles:File with this name already exists`,
};
