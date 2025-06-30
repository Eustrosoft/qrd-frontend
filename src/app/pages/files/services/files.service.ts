import { DOCUMENT, inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileDto } from '@api/files/file-api.models';

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
