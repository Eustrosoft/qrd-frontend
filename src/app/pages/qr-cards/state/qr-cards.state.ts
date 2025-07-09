import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import {
  DeleteQrCards,
  FetchQrCard,
  FetchQrCardList,
  SelectAllQrCards,
  SetQrCardsDataViewDisplayType,
  SetSelectedQrCards,
} from './qr-cards.actions';
import { DataViewDisplayType } from '@shared/shared.models';
import { patch } from '@ngxs/store/operators';
import { QRDto } from '@api/qr-cards/qrs-api.models';
import { catchError, concatMap, EMPTY, from, Observable, switchMap, tap, throwError, timer, toArray } from 'rxjs';
import { QrCardsService } from '@app/pages/qr-cards/services/qr-cards.service';
import { AppRoutes, DEFAULT_ITEMS_PER_PAGE, QR_API_URL, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { TemplatesStateModel } from '@app/pages/templates/state/templates.state';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { DELETION_DIALOG_DATA } from '@shared/components/confirmation-dialog/confirmation-dialog.constants';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';

export interface QrCardsStateModel {
  displayType: DataViewDisplayType;
  isQrCardListLoading: boolean;
  qrCardListSkeletonLoaders: number;
  qrCardList: QRDto[];
  selectedQrCardList: number[];
  isQrCardLoading: boolean;
  qrCard: QRDto | null;
  qrCardPreviewUrl: string;
  isDeleteInProgress: boolean;
}

const defaults: QrCardsStateModel = {
  displayType: 'list',
  isQrCardListLoading: false,
  qrCardListSkeletonLoaders: DEFAULT_ITEMS_PER_PAGE,
  qrCardList: [],
  selectedQrCardList: [],
  isQrCardLoading: false,
  qrCard: null,
  qrCardPreviewUrl: '',
  isDeleteInProgress: false,
} as const;

const QR_CARDS_STATE_TOKEN: StateToken<QrCardsStateModel> = new StateToken<QrCardsStateModel>('qrCards');

@State<QrCardsStateModel>({
  name: QR_CARDS_STATE_TOKEN,
  defaults,
})
@Injectable()
export class QrCardsState {
  private readonly qrCardsService = inject(QrCardsService);
  private readonly router = inject(Router);
  private readonly toHexPipe = inject(ToHexPipe);
  private readonly pxToRemPipe = inject(PxToRemPipe);
  private readonly matDialog = inject(MatDialog);

  @Selector()
  public static getDisplayType$({ displayType }: QrCardsStateModel): DataViewDisplayType {
    return displayType;
  }

  @Selector()
  public static isQrCardListLoading$({ isQrCardListLoading }: QrCardsStateModel): boolean {
    return isQrCardListLoading;
  }

  @Selector()
  public static getQrCardListSkeletonLoaders$({ qrCardListSkeletonLoaders }: QrCardsStateModel): number[] {
    return Array.from({ length: qrCardListSkeletonLoaders }, (_, i) => i);
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

  @Selector()
  public static isDeleteInProgress$({ isDeleteInProgress }: QrCardsStateModel): boolean {
    return isDeleteInProgress;
  }

  @Action(FetchQrCardList)
  public fetchQrCardList({ setState }: StateContext<QrCardsStateModel>): Observable<QRDto[]> {
    setState(patch({ isQrCardListLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.getQrCardList()),
      tap({
        next: (qrCardList) => {
          setState(
            patch({
              qrCardList: qrCardList.map((qrCard) => ({
                ...qrCard,
                qrCardPreviewUrl: `${QR_API_URL}${this.toHexPipe.transform(qrCard.code)}`,
              })),
              isQrCardListLoading: false,
            }),
          );
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

  @Action(DeleteQrCards)
  public deleteQrCards(
    { setState, dispatch }: StateContext<TemplatesStateModel>,
    { idList, destroyRef, refreshList, returnToList }: DeleteQrCards,
  ): Observable<void[]> {
    setState(patch({ isDeleteInProgress: true }));

    const matDialogRef = this.matDialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        data: DELETION_DIALOG_DATA,
        width: this.pxToRemPipe.transform('600'),
      },
    );

    return matDialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (!result) {
          setState(patch({ isDeleteInProgress: false }));
          return EMPTY;
        }
        return from(idList).pipe(
          concatMap((id) => this.qrCardsService.deleteQrCard(id)),
          toArray(),
          tap({
            next: () => {
              setState(patch({ isDeleteInProgress: false }));
              dispatch(new SetSelectedQrCards([]));
              if (refreshList) {
                dispatch(FetchQrCardList);
              }
              if (returnToList) {
                this.router.navigate(['/', AppRoutes.qrCards]);
              }
            },
          }),
        );
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        setState(patch({ isDeleteInProgress: false }));
        dispatch(new SetSelectedQrCards([]));
        return throwError(() => err);
      }),
    );
  }
}
