import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QRDto } from '@api/qrs/qrs-api.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrCardsService {
  private readonly http = inject(HttpClient);

  public getQrCardList(): Observable<QRDto[]> {
    return this.http.get<QRDto[]>('/qrCodeDemo/v1/api/secured/qrs');
  }
}
