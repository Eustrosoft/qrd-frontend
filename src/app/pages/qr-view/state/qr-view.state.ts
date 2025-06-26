import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { QRDto } from '@api/qr-cards/qrs-api.models';
import { QrCardsService } from '@app/pages/qr-cards/services/qr-cards.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { FetchQR } from '@app/pages/qr-view/state/qr-view.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsLocalization } from '@modules/error/error.constants';

export interface QrViewStateModel {
  qr: QRDto | null;
  isLoading: boolean;
  isLoadError: boolean;
  errorText: string;
}

const defaults: QrViewStateModel = {
  qr: null,
  isLoading: false,
  isLoadError: false,
  errorText: ErrorsLocalization.errOccurred,
} as const;

const QR_VIEW_STATE_TOKEN: StateToken<QrViewStateModel> = new StateToken<QrViewStateModel>('qrView');

@State<QrViewStateModel>({
  name: QR_VIEW_STATE_TOKEN,
  defaults,
})
@Injectable()
export class QrViewState {
  private readonly qrCardsService = inject(QrCardsService);

  @Selector()
  public static getQR$({ qr }: QrViewStateModel): QRDto | null {
    return qr;
  }

  @Selector()
  public static isLoading$({ isLoading }: QrViewStateModel): boolean {
    return isLoading;
  }

  @Selector()
  public static isLoadError$({ isLoadError }: QrViewStateModel): boolean {
    return isLoadError;
  }

  @Selector()
  public static getErrorText$({ errorText }: QrViewStateModel): string {
    return errorText;
  }

  @Action(FetchQR)
  public fetchQR(
    { getState, setState }: StateContext<QrViewStateModel>,
    { q, destroyRef }: FetchQR,
  ): Observable<QRDto> {
    setState(patch({ isLoading: true, isLoadError: false }));

    return this.qrCardsService.getPublicQrCard(q).pipe(
      tap({
        next: (qr) => {
          setState(patch({ qr, isLoading: false }));
        },
      }),
      catchError((err: HttpErrorResponse) => {
        setState(patch({ isLoading: false, isLoadError: true }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }
}
