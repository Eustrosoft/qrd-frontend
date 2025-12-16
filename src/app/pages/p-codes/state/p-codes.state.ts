import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { catchError, Observable, switchMap, tap, throwError, timer } from 'rxjs';
import { AppRoutes, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResetGs1State } from '@app/pages/gs1/state/gs1.actions';
import { NotificationSnackbarLocalization } from '@modules/error/error.constants';
import { Router } from '@angular/router';
import { SnackbarService } from '@shared/service/snackbar.service';
import { PCodeDto } from '@api/p-codes/p-codes-api.models';
import { PCodesService } from '@app/pages/p-codes/services/p-codes.service';
import { CreatePCode, FetchPCode, FetchPCodeList, SavePCode } from '@app/pages/p-codes/state/p-codes.actions';

export interface PCodesStateModel {
  isPCodeListLoading: boolean;
  isPCodeListLoadErr: boolean;
  pCodeList: PCodeDto[];
  isPCodeLoading: boolean;
  isPCodeLoadErr: boolean;
  isSaveInProgress: boolean;
  pCode: PCodeDto | null;
}

const defaults: PCodesStateModel = {
  isPCodeListLoading: false,
  isPCodeListLoadErr: false,
  pCodeList: [],
  isPCodeLoading: false,
  isPCodeLoadErr: false,
  isSaveInProgress: false,
  pCode: null,
} as const;

const P_CODE_STATE_TOKEN: StateToken<PCodesStateModel> = new StateToken<PCodesStateModel>('pCode');

@State<PCodesStateModel>({
  name: P_CODE_STATE_TOKEN,
  defaults,
})
@Injectable()
export class PCodesState {
  private readonly pCodesService = inject(PCodesService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);

  @Action(FetchPCodeList)
  public fetchPCodeList(
    { setState }: StateContext<PCodesStateModel>,
    { docId, destroyRef }: FetchPCodeList,
  ): Observable<PCodeDto[]> {
    setState(patch({ isPCodeListLoading: true, isPCodeListLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.pCodesService.getPCodeList(docId)),
      tap({
        next: (pCodeList) => {
          setState(
            patch({
              pCodeList,
              isPCodeListLoading: false,
            }),
          );
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        setState(patch({ isPCodeListLoading: false, isPCodeListLoadErr: true, pCodeList: [] }));
        return throwError(() => err);
      }),
    );
  }

  @Action(FetchPCode)
  public fetchPCode(
    { setState }: StateContext<PCodesStateModel>,
    { destroyRef, docId }: FetchPCode,
  ): Observable<PCodeDto> {
    setState(patch({ isPCodeLoading: true, isPCodeLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.pCodesService.getPCode(docId)),
      tap({
        next: (pCode) => {
          setState(
            patch({
              pCode,
              isPCodeLoading: false,
            }),
          );
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        setState(patch({ isPCodeLoading: false, isPCodeLoadErr: true }));
        return throwError(() => err);
      }),
    );
  }

  @Action(CreatePCode)
  public createPCode(
    { setState }: StateContext<PCodesStateModel>,
    { payload, destroyRef }: CreatePCode,
  ): Observable<unknown> {
    setState(patch({ isSaveInProgress: true }));
    return timer(SKELETON_TIMER).pipe(
      // switchMap(() =>
      //   this.pCodesService.createPCode({
      //     qrId: payload.qrId!,
      //     rtype: payload.rtype,
      //     gtin: +payload.gtin!,
      //     key: payload.key,
      //     value: payload.value,
      //     tail: payload.tail,
      //     comment: payload.comment,
      //   }),
      // ),
      tap({
        next: () => {
          this.snackbarService.success(NotificationSnackbarLocalization.saved);
          this.router.navigate([AppRoutes.qrCards, payload.docId, AppRoutes.pCodes]).then(() => {
            setState(patch({ isSaveInProgress: false }));
          });
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnCreate);
        setState(patch({ isSaveInProgress: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(SavePCode)
  public savePCode(
    { setState }: StateContext<PCodesStateModel>,
    { payload, destroyRef }: SavePCode,
  ): Observable<unknown> {
    setState(patch({ isSaveInProgress: true }));
    return timer(SKELETON_TIMER).pipe(
      // switchMap(() =>
      //   this.pCodesService.savePCode({
      //     id: payload.id!,
      //     qrId: payload.qrId!,
      //     rtype: payload.rtype,
      //     gtin: +payload.gtin!,
      //     key: payload.key,
      //     value: payload.value,
      //     tail: payload.tail,
      //     comment: payload.comment,
      //   }),
      // ),
      tap({
        next: () => {
          this.snackbarService.success(NotificationSnackbarLocalization.saved);
          this.router.navigate([AppRoutes.qrCards, payload.docId, AppRoutes.pCodes]).then(() => {
            setState(patch({ isSaveInProgress: false }));
          });
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnCreate);
        setState(patch({ isSaveInProgress: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(ResetGs1State)
  public resetGs1State({ setState }: StateContext<PCodesStateModel>): void {
    setState(defaults);
  }
}
