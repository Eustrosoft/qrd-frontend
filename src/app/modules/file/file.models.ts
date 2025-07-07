import { FormControl, FormGroup } from '@angular/forms';

export type UploadState = {
  progress: number;
  isDone: boolean;
  isLoading: boolean;
  isCancelled: boolean;
  isError: boolean;
  fileId: number | null;
};
export type FileAttachmentMode = 'upload' | 'fileUrl';
export type AttachmentModeListItem = {
  mode: FileAttachmentMode;
  title: string;
};
export type FileUploadFormGroup = FormGroup<FileUploadForm>;
export type FileUploadForm = {
  name: FormControl<string>;
  description: FormControl<string>;
  isActive: FormControl<boolean>;
  isPublic: FormControl<boolean>;
  file: FormControl<File | null>;
};

export type FileAsUrlFormGroup = FormGroup<FileAsUrlForm>;
export type FileAsUrlForm = {
  name: FormControl<string>;
  description: FormControl<string>;
  isActive: FormControl<boolean>;
  isPublic: FormControl<boolean>;
  storagePath: FormControl<string>;
};
