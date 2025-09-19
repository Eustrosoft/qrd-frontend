import { inject, Injectable, inputBinding } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QRChangeDto, QRCreationDto, QRDto } from '@api/qr-cards/qrs-api.models';
import { Observable } from 'rxjs';
import { QRRangeDto } from '@api/ranges/ranges-api.models';
import { QrViewComponent } from '@app/pages/qr-view/qr-view.component';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { WINDOW } from '@cdk/tokens/window.token';
import { select } from '@ngxs/store';
import { AppState } from '@app/state/app.state';

@Injectable({
  providedIn: 'root',
})
export class QrCardsService {
  private readonly http = inject(HttpClient);
  private readonly uiSidenavService = inject(UiSidenavService);
  private readonly isXSmall = inject(IS_XSMALL);
  private readonly window = inject(WINDOW);
  private readonly settingsState = select(AppState.getSettingsState$);

  public getQrCardList(): Observable<QRDto[]> {
    return this.http.get<QRDto[]>('/qrCodeDemo/v1/api/secured/qrs');
  }

  public getQrRangeList(): Observable<QRRangeDto[]> {
    return this.http.get<QRRangeDto[]>('/qrCodeDemo/v1/api/secured/ranges');
  }

  public getQrCardById(id: number | string): Observable<QRDto> {
    return this.http.get<QRDto>(`/qrCodeDemo/v1/api/secured/qrs/${id}`);
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

  public openCardPreview(previewUrl: string): void {
    this.uiSidenavService.open(QrViewComponent, {
      bindings: [inputBinding('iframeSrc', () => previewUrl)],
      position: 'end',
      width: this.isXSmall() ? 'full' : 'sm',
      isFixed: true,
    });
  }

  public openPrint(code: string): void {
    const queryParams = new HttpParams({
      fromObject: {
        q: code,
        text: this.settingsState().settings.defaultQrPrintText,
        textDown: this.settingsState().settings.defaultQrPrintTextDown,
      },
    });
    this.window.open(`/printer/?${queryParams.toString()}`, '_blank', 'noopener noreferrer');
  }
}
