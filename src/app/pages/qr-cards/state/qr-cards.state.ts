import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import {
  FetchQrCards,
  SelectedAllQrCards,
  SetQrCardsDataViewDisplayType,
  SetSelectedQrCards,
} from './qr-cards.actions';
import { DataViewDisplayType } from '@shared/shared.models';
import { patch } from '@ngxs/store/operators';
import { QRDto } from '@api/qrs/qrs-api.models';
import { catchError, Observable, switchMap, tap, throwError, timer } from 'rxjs';
import { QrCardsService } from '@app/pages/qr-cards/services/qr-cards.service';
import { SKELETON_TIMER } from '@app/app.constants';

export interface QrCardsStateModel {
  displayType: DataViewDisplayType;
  isQrCardListLoading: boolean;
  qrCardList: QRDto[];
  selectedQrCardList: number[];
}

const defaults: QrCardsStateModel = {
  displayType: 'list',
  isQrCardListLoading: false,
  qrCardList: [],
  selectedQrCardList: [],
} as const;

const QR_CARDS_STATE_TOKEN: StateToken<QrCardsStateModel> = new StateToken<QrCardsStateModel>('qrCards');

@State<QrCardsStateModel>({
  name: QR_CARDS_STATE_TOKEN,
  defaults,
})
@Injectable()
export class QrCardsState {
  private readonly qrCardsService = inject(QrCardsService);

  @Selector()
  public static getDisplayType$({ displayType }: QrCardsStateModel): DataViewDisplayType {
    return displayType;
  }

  @Selector()
  public static isQrCardListLoading$({ isQrCardListLoading }: QrCardsStateModel): boolean {
    return isQrCardListLoading;
  }

  @Selector()
  public static getQrCardList$({ qrCardList }: QrCardsStateModel): QRDto[] {
    return qrCardList;
  }

  @Selector()
  public static getSelectedQrCardList$({ selectedQrCardList }: QrCardsStateModel): number[] {
    return selectedQrCardList;
  }

  @Action(FetchQrCards)
  public fetchQrCards({ setState }: StateContext<QrCardsStateModel>): Observable<QRDto[]> {
    setState(patch({ isQrCardListLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.getQrCardList()),
      tap({
        next: (qrCardList) => {
          setState(patch({ qrCardList, isQrCardListLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isQrCardListLoading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(SetSelectedQrCards)
  public setSelectedQrCards(
    { setState }: StateContext<QrCardsStateModel>,
    { selectedQrCardList }: SetSelectedQrCards,
  ): void {
    setState(patch({ selectedQrCardList }));
  }

  @Action(SelectedAllQrCards)
  public selectedAllQrCards({ setState, getState }: StateContext<QrCardsStateModel>): void {
    const { qrCardList } = getState();
    setState(patch({ selectedQrCardList: qrCardList.map((card) => card.id) }));
  }

  @Action(SetQrCardsDataViewDisplayType)
  public setDisplayType(
    { setState }: StateContext<QrCardsStateModel>,
    { displayType }: SetQrCardsDataViewDisplayType,
  ): void {
    setState(patch({ displayType }));
  }
}
