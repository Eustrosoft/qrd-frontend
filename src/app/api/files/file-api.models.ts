import { components } from '@api/schema';

export type FileDto = components['schemas']['FileDto'];
export type FileStorageType = components['schemas']['FileDto']['fileStorageType'];
export type FileBlobUploadRequest = {
  chunk: Blob;
  no: number;
  total: number;
  chunkSize: number;
  name: string;
  description: string;
  public: boolean;
  active: boolean;
  fileId?: number;
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
