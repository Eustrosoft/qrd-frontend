import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PCodeChangeDto, PCodeCreationDto, PCodeDto } from '@api/p-codes/p-codes-api.models';
import { Pin2Length } from '@app/pages/p-codes/p-codes.models';
import { Pin2Alphabet, Pin2Sizes } from '@app/pages/p-codes/p-codes.constants';
import { CRYPTO } from '@cdk/tokens/crypto.token';

@Injectable({
  providedIn: 'root',
})
export class PCodesService {
  private readonly http = inject(HttpClient);
  private readonly crypto = inject(CRYPTO);

  public getPCodeList(docId: number): Observable<PCodeDto[]> {
    const params = new HttpParams({ fromObject: { docId } });
    return this.http.get<PCodeDto[]>('/qrCodeDemo/v1/api/secured/p-codes', { params });
  }

  public getPCode(docId: string | number): Observable<PCodeDto> {
    return this.http.get<PCodeDto>(`/qrCodeDemo/v1/api/secured/p-codes/${docId}`);
  }

  public createPCode(payload: PCodeCreationDto): Observable<PCodeCreationDto> {
    return this.http.post<PCodeCreationDto>('/qrCodeDemo/v1/api/secured/gs-labels', payload);
  }

  public savePCode(payload: PCodeChangeDto): Observable<PCodeChangeDto> {
    return this.http.put<PCodeChangeDto>('/qrCodeDemo/v1/api/secured/gs-labels', payload);
  }

  public deletePCode(docId: string | number): Observable<void> {
    return this.http.delete<void>(`/qrCodeDemo/v1/api/secured/gs-labels/${docId}`);
  }

  public makeRandomPin(length?: Pin2Length): string {
    const alphabet = Pin2Alphabet;
    const alphabetLength = alphabet.length;

    const finalLength: Pin2Length =
      length ?? Pin2Sizes[this.crypto.getRandomValues(new Uint8Array(1))[0] % Pin2Sizes.length];

    const randomValues = new Uint32Array(finalLength);
    this.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < finalLength; i++) {
      result += alphabet[randomValues[i] % alphabetLength];
    }

    return result;
  }
}
