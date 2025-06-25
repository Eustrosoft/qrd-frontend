import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileDto } from '@api/files/file-api.models';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly http = inject(HttpClient);

  public getFileList(): Observable<FileDto[]> {
    return this.http.get<FileDto[]>('/qrCodeDemo/v1/api/secured/files');
  }

  public getFile(id: number): Observable<FileDto> {
    return this.http.get<FileDto>(`/qrCodeDemo/v1/api/secured/files/${id}`);
  }
}
