import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gs1ChangeDto, Gs1CreationDto, Gs1Dto } from '@api/gs/gs-api.models';

@Injectable({
  providedIn: 'root',
})
export class Gs1Service {
  private readonly http = inject(HttpClient);

  public getGs1List(qrId?: number): Observable<Gs1Dto[]> {
    let params = new HttpParams();
    if (qrId) {
      params = params.append('qrId', qrId);
    }
    return this.http.get<Gs1Dto[]>('/qrCodeDemo/v1/api/secured/gs-labels', { params });
  }

  public getGs1(id: string | number): Observable<Gs1Dto> {
    return this.http.get<Gs1Dto>(`/qrCodeDemo/v1/api/secured/gs-labels/${id}`);
  }

  public createGs1(payload: Gs1CreationDto): Observable<Gs1CreationDto> {
    return this.http.post<Gs1CreationDto>('/qrCodeDemo/v1/api/secured/gs-labels', payload);
  }

  public saveGs1(payload: Gs1ChangeDto): Observable<Gs1ChangeDto> {
    return this.http.put<Gs1ChangeDto>('/qrCodeDemo/v1/api/secured/gs-labels', payload);
  }

  public deleteGs1(id: string | number): Observable<void> {
    return this.http.delete<void>(`/qrCodeDemo/v1/api/secured/gs-labels/${id}`);
  }
}
