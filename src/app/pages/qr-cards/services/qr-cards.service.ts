import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QRChangeDto, QRCreationDto, QRDto } from '@api/qr-cards/qrs-api.models';
import { Observable } from 'rxjs';
import { QRRangeDto } from '@api/ranges/ranges-api.models';

@Injectable({
  providedIn: 'root',
})
export class QrCardsService {
  private readonly http = inject(HttpClient);

  public getQrCardList(): Observable<QRDto[]> {
    return this.http.get<QRDto[]>('/qrCodeDemo/v1/api/secured/qrs');
  }

  public getQrRangeList(): Observable<QRRangeDto[]> {
    return this.http.get<QRRangeDto[]>('/qrCodeDemo/v1/api/secured/ranges');
  }

  public getQrCard(code: string): Observable<QRDto> {
    const params = new HttpParams({ fromObject: { q: code } });
    return this.http.get<QRDto>('/qrCodeDemo/v1/api/secured/qrs/code', { params });
  }

  public createQrCard(payload: QRCreationDto): Observable<QRDto> {
    return this.http.post<QRDto>('/qrCodeDemo/v1/api/secured/qrs', payload);
  }

  public saveQrCard(payload: Partial<QRChangeDto>): Observable<QRDto> {
    return this.http.put<QRDto>('/qrCodeDemo/v1/api/secured/qrs', payload);
  }

  public addFileToQrCard(qrId: number, fileId: { id: number }): Observable<QRDto> {
    return this.http.put<QRDto>(`/qrCodeDemo/v1/api/secured/qrs/${qrId}/files/choose`, fileId);
  }

  public deleteQrCard(id: number): Observable<void> {
    return this.http.delete<void>(`/qrCodeDemo/v1/api/secured/qrs/${id}`);
  }
}
