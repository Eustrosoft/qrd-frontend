import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import {
  FetchQrCard,
  FetchQrCardList,
  SelectAllQrCards,
  SetQrCardsDataViewDisplayType,
  SetSelectedQrCards,
} from './qr-cards.actions';
import { DataViewDisplayType } from '@shared/shared.models';
import { patch } from '@ngxs/store/operators';
import { QRDto } from '@api/qr-cards/qrs-api.models';
import { catchError, Observable, switchMap, tap, throwError, timer } from 'rxjs';
import { QrCardsService } from '@app/pages/qr-cards/services/qr-cards.service';
import { QR_API_URL, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';

export interface QrCardsStateModel {
  displayType: DataViewDisplayType;
  isQrCardListLoading: boolean;
  qrCardList: QRDto[];
  selectedQrCardList: number[];
  isQrCardLoading: boolean;
  qrCard: QRDto | null;
  qrCardPreviewUrl: string;
}

const defaults: QrCardsStateModel = {
  displayType: 'list',
  isQrCardListLoading: false,
  qrCardList: [],
  selectedQrCardList: [],
  isQrCardLoading: false,
  qrCard: null,
  qrCardPreviewUrl: '',
} as const;

const QR_CARDS_STATE_TOKEN: StateToken<QrCardsStateModel> = new StateToken<QrCardsStateModel>('qrCards');

@State<QrCardsStateModel>({
  name: QR_CARDS_STATE_TOKEN,
  defaults,
})
@Injectable()
export class QrCardsState {
  private readonly qrCardsService = inject(QrCardsService);
  private readonly toHexPipe = inject(ToHexPipe);

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
  public static isQrCardLoading$({ isQrCardLoading }: QrCardsStateModel): boolean {
    return isQrCardLoading;
  }

  @Selector()
  public static getQrCard$({ qrCard }: QrCardsStateModel): QRDto | null {
    return qrCard;
  }

  @Selector()
  public static getQrCardPreviewUrl$({ qrCardPreviewUrl }: QrCardsStateModel): string {
    return qrCardPreviewUrl;
  }

  @Selector()
  public static getSelectedQrCardList$({ selectedQrCardList }: QrCardsStateModel): number[] {
    return selectedQrCardList;
  }

  @Action(FetchQrCardList)
  public fetchQrCardList({ setState }: StateContext<QrCardsStateModel>): Observable<QRDto[]> {
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

  @Action(FetchQrCard)
  public fetchQrCard(
    { setState }: StateContext<QrCardsStateModel>,
    { code, destroyRef }: FetchQrCard,
  ): Observable<QRDto> {
    setState(patch({ isQrCardLoading: true }));
    const qrHexCode = this.toHexPipe.transform(code);
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.getQrCard(qrHexCode)),
      tap({
        next: (qrCard) => {
          setState(
            patch({
              qrCard,
              qrCardPreviewUrl: `${QR_API_URL}${qrHexCode}`,
              isQrCardLoading: false,
            }),
          );
        },
      }),
      catchError((err) => {
        setState(patch({ isQrCardLoading: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(SetSelectedQrCards)
  public setSelectedQrCards(
    { setState }: StateContext<QrCardsStateModel>,
    { selectedQrCardList }: SetSelectedQrCards,
  ): void {
    setState(patch({ selectedQrCardList }));
  }

  @Action(SelectAllQrCards)
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
