import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MappedPCodeDto, PCodeChangeDto, PCodeCreationDto, PCodeDto } from '@api/p-codes/p-codes-api.models';
import { PCodesUtilsService } from '@app/pages/p-codes/services/p-codes-utils.service';

@Injectable({
  providedIn: 'root',
})
export class PCodesService {
  private readonly http = inject(HttpClient);
  private readonly pCodesUtilsService = inject(PCodesUtilsService);

  public getPCodeList(docId: number): Observable<MappedPCodeDto[]> {
    const params = new HttpParams({ fromObject: { docId } });
    return this.http.get<PCodeDto[]>('/qrCodeDemo/v1/api/secured/p-codes', { params }).pipe(
      map((res) =>
        res.map((pin) => ({
          ...pin,
          hfields: this.pCodesUtilsService.toBoolean(pin.hfields),
          hfiles: this.pCodesUtilsService.toBoolean(pin.hfiles),
        })),
      ),
    );
  }

  public getPCode(docId: string | number): Observable<MappedPCodeDto> {
    return this.http.get<PCodeDto>(`/qrCodeDemo/v1/api/secured/p-codes/${docId}`).pipe(
      map((res) => ({
        ...res,
        hfields: this.pCodesUtilsService.toBoolean(res.hfields),
        hfiles: this.pCodesUtilsService.toBoolean(res.hfiles),
      })),
    );
  }

  public createPCode(payload: PCodeCreationDto): Observable<PCodeCreationDto> {
    return this.http.post<PCodeCreationDto>('/qrCodeDemo/v1/api/secured/p-codes', payload);
  }

  public savePCode(payload: PCodeChangeDto): Observable<PCodeChangeDto> {
    return this.http.put<PCodeChangeDto>('/qrCodeDemo/v1/api/secured/p-codes', payload);
  }

  public deletePCode(docId: string | number, rowId: string | number): Observable<void> {
    return this.http.delete<void>(`/qrCodeDemo/v1/api/secured/p-codes/${docId}/${rowId}`);
  }
}
