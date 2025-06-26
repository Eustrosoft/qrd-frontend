import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QRDto } from '@api/qr-cards/qrs-api.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrCardsService {
  private readonly http = inject(HttpClient);

  public getQrCardList(): Observable<QRDto[]> {
    return this.http.get<QRDto[]>('/qrCodeDemo/v1/api/secured/qrs');
  }

  public getQrCard(code: string): Observable<QRDto> {
    const params = new HttpParams({ fromObject: { q: code } });
    return this.http.get<QRDto>('/qrCodeDemo/v1/api/secured/qrs/code', { params });
  }

  public getPublicQrCard(q: string): Observable<QRDto> {
    const params = new HttpParams({ fromObject: { q } });
    return this.http.get<QRDto>('/qrCodeDemo/v1/api/unsecured/qrs', { params });
  }
}
