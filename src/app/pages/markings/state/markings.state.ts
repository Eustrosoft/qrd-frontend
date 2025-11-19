import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { QRDto } from '@api/qr-cards/qrs-api.models';
import { catchError, Observable, switchMap, tap, throwError, timer } from 'rxjs';
import { QrCardsService } from '@app/pages/qr-cards/services/qr-cards.service';
import { SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FetchQrCardList, ResetMarkingsState } from '@app/pages/markings/state/markings.actions';

export interface MarkingsStateModel {
  isGs1ListLoading: boolean;
  isGs1ListLoadErr: boolean;
  gs1List: unknown[];
  isGs1Loading: boolean;
  isGs1LoadErr: boolean;
  isSaveInProgress: boolean;
  gs1: unknown;
  isQrCardListLoading: boolean;
  isQrCardListLoadErr: boolean;
  qrCardList: QRDto[];
}

const defaults: MarkingsStateModel = {
  isGs1ListLoading: false,
  isGs1ListLoadErr: false,
  gs1List: [],
  isGs1Loading: false,
  isGs1LoadErr: false,
  isSaveInProgress: false,
  gs1: null,
  isQrCardListLoading: false,
  isQrCardListLoadErr: false,
  qrCardList: [],
} as const;

const MARKINGS_STATE_TOKEN: StateToken<MarkingsStateModel> = new StateToken<MarkingsStateModel>('markings');

@State<MarkingsStateModel>({
  name: MARKINGS_STATE_TOKEN,
  defaults,
})
@Injectable()
export class MarkingsState {
  private readonly qrCardsService = inject(QrCardsService);

  @Action(FetchQrCardList)
  public fetchQrCardList(
    { setState }: StateContext<MarkingsStateModel>,
    { destroyRef }: FetchQrCardList,
  ): Observable<QRDto[]> {
    setState(patch({ isQrCardListLoading: true, isQrCardListLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.getQrCardList()),
      tap({
        next: (qrCardList) => {
          setState(
            patch({
              qrCardList,
              isQrCardListLoading: false,
            }),
          );
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        setState(patch({ isQrCardListLoading: false, isQrCardListLoadErr: true, qrCardList: [] }));
        return throwError(() => err);
      }),
    );
  }

  @Action(ResetMarkingsState)
  public resetMarkingsState({ setState }: StateContext<MarkingsStateModel>): void {
    setState(defaults);
  }
}
