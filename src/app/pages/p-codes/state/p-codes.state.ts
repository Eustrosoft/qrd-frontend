import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import {
  catchError,
  filter,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
  throwIfEmpty,
  timer,
} from 'rxjs';
import { AppRoutes, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationSnackbarLocalization } from '@modules/error/error.constants';
import { Router } from '@angular/router';
import { SnackbarService } from '@shared/service/snackbar.service';
import { MappedPCodeDto } from '@api/p-codes/p-codes-api.models';
import { PCodesService } from '@app/pages/p-codes/services/p-codes.service';
import {
  CreatePCode,
  FetchPCode,
  FetchPCodeList,
  ResetPCodeState,
  SavePCode,
} from '@app/pages/p-codes/state/p-codes.actions';
import { PCodesUtilsService } from '@app/pages/p-codes/services/p-codes-utils.service';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { NotifyAboutMD5ChangesDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.constants';
import { UserAbortError } from '@core/errors/user-abort.error';

export interface PCodesStateModel {
  isPCodeListLoading: boolean;
  isPCodeListLoadErr: boolean;
  pCodeList: MappedPCodeDto[];
  isPCodeLoading: boolean;
  isPCodeLoadErr: boolean;
  isSaveInProgress: boolean;
  pCode: MappedPCodeDto | null;
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

const P_CODES_STATE_TOKEN: StateToken<PCodesStateModel> = new StateToken<PCodesStateModel>('pCodes');

@State<PCodesStateModel>({
  name: P_CODES_STATE_TOKEN,
  defaults,
})
@Injectable()
export class PCodesState {
  private readonly pCodesService = inject(PCodesService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);
  private readonly pCodesUtilsService = inject(PCodesUtilsService);
  private readonly pxToRemPipe = inject(PxToRemPipe);
  private readonly matDialog = inject(MatDialog);

  @Action(FetchPCodeList)
  public fetchPCodeList(
    { setState }: StateContext<PCodesStateModel>,
    { docId, destroyRef }: FetchPCodeList,
  ): Observable<MappedPCodeDto[]> {
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
    { getState, setState, dispatch }: StateContext<PCodesStateModel>,
    { destroyRef, docId, idx }: FetchPCode,
  ): Observable<MappedPCodeDto> {
    setState(patch({ isPCodeLoading: true, isPCodeLoadErr: false }));
    return dispatch(new FetchPCodeList(docId, destroyRef)).pipe(
      map(() => {
        const { pCodeList } = getState();
        return pCodeList.find((_, index) => index === idx);
      }),
      filter((pin) => !!pin),
      throwIfEmpty(() => new Error('Unavailable pin')),
      tap({
        next: (pCode) => {
          setState(
            patch({
              pCode: pCode,
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
      switchMap(() =>
        this.pCodesService.createPCode({
          docId: payload.docId!,
          rowId: payload.rowId!,
          participantId: payload.participantId!,
          p: payload.p,
          p2: payload.p2,
          p2Mode: payload.p2Mode,
          p2Prompt: payload.p2Prompt,
          hfields: this.pCodesUtilsService.toYesNo(payload.hfields),
          hfiles: this.pCodesUtilsService.toYesNo(payload.hfiles),
          comment: payload.comment,
        }),
      ),
      tap({
        next: () => {
          this.snackbarService.success(NotificationSnackbarLocalization.saved);
          this.router.navigate([AppRoutes.qrCards, payload.docId, AppRoutes.pins]).then(() => {
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
    { payload, isMd5HasChanged, destroyRef }: SavePCode,
  ): Observable<unknown> {
    setState(patch({ isSaveInProgress: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => {
        if (!isMd5HasChanged) {
          return of(true);
        }

        return this.matDialog
          .open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(ConfirmationDialogComponent, {
            data: NotifyAboutMD5ChangesDialogData,
            width: this.pxToRemPipe.transform('600'),
          })
          .afterClosed();
      }),
      filter(Boolean),
      throwIfEmpty(() => new UserAbortError(SavePCode.name)),
      switchMap(() =>
        this.pCodesService.savePCode({
          docId: payload.docId!,
          rowId: payload.rowId!,
          participantId: payload.participantId!,
          p: payload.p,
          p2: payload.p2,
          p2Mode: payload.p2Mode,
          p2Prompt: payload.p2Prompt,
          hfields: this.pCodesUtilsService.toYesNo(payload.hfields),
          hfiles: this.pCodesUtilsService.toYesNo(payload.hfiles),
          comment: payload.comment,
        }),
      ),
      tap({
        next: () => {
          this.snackbarService.success(NotificationSnackbarLocalization.saved);
          this.router.navigate([AppRoutes.qrCards, payload.docId, AppRoutes.pins]).then(() => {
            setState(patch({ isSaveInProgress: false }));
          });
        },
      }),
      catchError((err) => {
        setState(patch({ isSaveInProgress: false }));
        if (err instanceof UserAbortError) {
          return throwError(() => err);
        }
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnSave);
        return throwError(() => err);
      }),
      finalize(() => {
        setState(patch({ isSaveInProgress: false }));
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(ResetPCodeState)
  public resetPCodeState({ setState }: StateContext<PCodesStateModel>): void {
    setState(defaults);
  }
}
