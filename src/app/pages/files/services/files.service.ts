import { DOCUMENT, inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FileBlobUploadRequest,
  FileBlobUploadResponse,
  FileDto,
  FileUrlUploadRequest,
} from '@api/files/file-api.models';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);

  public getFileList(): Observable<FileDto[]> {
    return this.http.get<FileDto[]>('/qrCodeDemo/v1/api/secured/files');
  }

  public getFile(id: number): Observable<FileDto> {
    return this.http.get<FileDto>(`/qrCodeDemo/v1/api/secured/files/${id}`);
  }

  public uploadBlobFile(formData: FileBlobUploadRequest): Observable<FileBlobUploadResponse> {
    const fd = new FormData();
    fd.append('chunk', formData.chunk);
    fd.append('no', formData.no.toString());
    fd.append('total', formData.total.toString());
    fd.append('chunkSize', formData.chunkSize.toString());
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('public', formData.public.toString());
    fd.append('active', formData.active.toString());
    if (formData.fileId) {
      fd.append('fileId', formData.fileId.toString());
    }
    return this.http.post<FileBlobUploadResponse>('/qrCodeDemo/v1/api/secured/files/upload/blob', fd);
  }

  public uploadFile(formData: FileUrlUploadRequest): Observable<FileBlobUploadResponse> {
    const fd = new FormData();
    fd.append('storagePath', formData.storagePath);
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('public', formData.public.toString());
    fd.append('active', formData.active.toString());
    fd.append('fileStorageType', formData.fileStorageType);
    return this.http.post<FileBlobUploadResponse>('/qrCodeDemo/v1/api/secured/files/upload', fd);
  }

  public downloadFile(id: number, fileName: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`/qrCodeDemo/v1/api/secured/files/${id}/download/${fileName}`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  public saveBlobToFile(file: Blob, fileName: string): void {
    const link = this.document.createElement('a');
    const objectUrl = URL.createObjectURL(file);
    link.href = objectUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(objectUrl);
  }
}
