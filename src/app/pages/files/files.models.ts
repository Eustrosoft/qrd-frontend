import { FormControl, FormGroup } from '@angular/forms';

export type FileAttachmentMode = 'upload' | 'selectExisting' | 'link';

export type AttachmentModeListItem = {
  mode: FileAttachmentMode;
  title: string;
};

export type FileFormGroup = FormGroup<FileForm>;

export type FileForm = {
  name: FormControl<string>;
  description: FormControl<string>;
  isActive: FormControl<boolean>;
  isPublic: FormControl<boolean>;
  storagePath: FormControl<string>;
  file: FormControl<File | null>;
};

export type UploadState = {
  progress: number;
  isDone: boolean;
  isLoading: boolean;
  isCancelled: boolean;
  isError: boolean;
  fileId: number | null;
};
