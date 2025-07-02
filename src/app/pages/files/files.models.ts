import { FormControl } from '@angular/forms';

export type FileAttachmentMode = 'upload' | 'selectExisting' | 'link';

export type AttachmentModeListItem = {
  mode: FileAttachmentMode;
  title: string;
};

export type FileForm = {
  name: FormControl<string>;
  description: FormControl<string>;
  isActive: FormControl<boolean>;
  isPublic: FormControl<boolean>;
  storagePath: FormControl<string>;
  file: FormControl<File | null>;
};
