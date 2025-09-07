import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemplateDto } from '@api/templates/templates-api.models';
import { HttpClient } from '@angular/common/http';
import { EntityDto } from '@api/api.models';

@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  private readonly http = inject(HttpClient);

  public getTemplateList(): Observable<TemplateDto[]> {
    return this.http.get<TemplateDto[]>('/qrCodeDemo/v1/api/secured/forms');
  }

  public getTemplate(id: number): Observable<TemplateDto> {
    return this.http.get<TemplateDto>(`/qrCodeDemo/v1/api/secured/forms/${id}`);
  }

  public getTemplateUsages(id: number): Observable<EntityDto[]> {
    return this.http.get<EntityDto[]>(`/qrCodeDemo/v1/api/secured/forms/${id}/related`);
  }

  public createTemplate(payload: Partial<TemplateDto>): Observable<TemplateDto> {
    return this.http.post<TemplateDto>('/qrCodeDemo/v1/api/secured/forms', payload);
  }

  public createDefaultTemplate(): Observable<TemplateDto> {
    return this.http.post<TemplateDto>('/qrCodeDemo/v1/api/secured/forms/default', undefined);
  }

  public saveTemplate(id: number, payload: Partial<TemplateDto>): Observable<TemplateDto> {
    return this.http.put<TemplateDto>(`/qrCodeDemo/v1/api/secured/forms/${id}`, payload);
  }

  public addFileToTemplate(templateId: number, fileId: { id: number }): Observable<TemplateDto> {
    return this.http.put<TemplateDto>(`/qrCodeDemo/v1/api/secured/forms/${templateId}/files/choose`, fileId);
  }

  public deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`/qrCodeDemo/v1/api/secured/forms/${id}`);
  }
}
