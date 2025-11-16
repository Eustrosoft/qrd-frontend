import { components } from '@api/schema';

export type FileDto = components['schemas']['FileDto'];
export type HidableFileDto = FileDto & { hidden: boolean };
export type FileStorageType = components['schemas']['FileDto']['fileStorageType'];
export type FileBlobUploadRequest = {
  chunk: Blob;
  no: number;
  total: number;
  fileSize: number;
  chunkSize: number;
  originName: string;
  name: string;
  description: string;
  public: boolean;
  active: boolean;
  fileId: number | null;
};
export type FileBlobUploadResponse = components['schemas']['FileUploadResponse'];
export type FileUrlUploadRequest = {
  storagePath: string;
  name: string;
  description: string;
  public: boolean;
  active: boolean;
  fileStorageType: string;
};
export type FileEditableMetadata = Pick<
  FileDto,
  'id' | 'name' | 'description' | 'isActive' | 'isPublic' | 'storagePath'
>;
