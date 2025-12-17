import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { catchError, Observable, switchMap, tap, throwError, timer } from 'rxjs';
import { AppRoutes, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateGs1, FetchGs1, FetchGs1List, ResetGs1State, SaveGs1 } from '@app/pages/gs1/state/gs1.actions';
import { Gs1Service } from '@app/pages/gs1/services/gs1.service';
import { Gs1ChangeDto, Gs1CreationDto, Gs1Dto } from '@api/gs1/gs1-api.models';
import { NotificationSnackbarLocalization } from '@modules/error/error.constants';
import { Router } from '@angular/router';
import { SnackbarService } from '@shared/service/snackbar.service';

export interface Gs1StateModel {
  isGs1ListLoading: boolean;
  isGs1ListLoadErr: boolean;
  gs1List: Gs1Dto[];
  isGs1Loading: boolean;
  isGs1LoadErr: boolean;
  isSaveInProgress: boolean;
  gs1: Gs1Dto | null;
}

const defaults: Gs1StateModel = {
  isGs1ListLoading: false,
  isGs1ListLoadErr: false,
  gs1List: [],
  isGs1Loading: false,
  isGs1LoadErr: false,
  isSaveInProgress: false,
  gs1: null,
} as const;

const GS1_STATE_TOKEN: StateToken<Gs1StateModel> = new StateToken<Gs1StateModel>('gs1');

@State<Gs1StateModel>({
  name: GS1_STATE_TOKEN,
  defaults,
})
@Injectable()
export class Gs1State {
  private readonly gs1Service = inject(Gs1Service);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);

  @Action(FetchGs1List)
  public fetchGs1List(
    { setState }: StateContext<Gs1StateModel>,
    { destroyRef, qrId }: FetchGs1List,
  ): Observable<Gs1Dto[]> {
    setState(patch({ isGs1ListLoading: true, isGs1ListLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.gs1Service.getGs1List(qrId)),
      tap({
        next: (gs1List) => {
          setState(
            patch({
              gs1List,
              isGs1ListLoading: false,
            }),
          );
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        setState(patch({ isGs1ListLoading: false, isGs1ListLoadErr: true, gs1List: [] }));
        return throwError(() => err);
      }),
    );
  }

  @Action(FetchGs1)
  public FetchGs1({ setState }: StateContext<Gs1StateModel>, { destroyRef, id }: FetchGs1): Observable<Gs1Dto> {
    setState(patch({ isGs1Loading: true, isGs1LoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.gs1Service.getGs1(id)),
      tap({
        next: (gs1) => {
          setState(
            patch({
              gs1,
              isGs1Loading: false,
            }),
          );
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        setState(patch({ isGs1Loading: false, isGs1LoadErr: true }));
        return throwError(() => err);
      }),
    );
  }

  @Action(CreateGs1)
  public createGs1(
    { setState }: StateContext<Gs1StateModel>,
    { payload, destroyRef }: CreateGs1,
  ): Observable<Gs1CreationDto> {
    setState(patch({ isSaveInProgress: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() =>
        this.gs1Service.createGs1({
          qrId: payload.qrId!,
          rtype: payload.rtype,
          gtin: +payload.gtin!,
          key: payload.key,
          value: payload.value,
          tail: payload.tail,
          comment: payload.comment,
        }),
      ),
      tap({
        next: () => {
          this.snackbarService.success(NotificationSnackbarLocalization.saved);
          this.router.navigate([AppRoutes.qrCards, payload.qrId, AppRoutes.gs1]).then(() => {
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

  @Action(SaveGs1)
  public saveGs1(
    { setState }: StateContext<Gs1StateModel>,
    { payload, destroyRef }: SaveGs1,
  ): Observable<Gs1ChangeDto> {
    setState(patch({ isSaveInProgress: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() =>
        this.gs1Service.saveGs1({
          id: payload.id!,
          qrId: payload.qrId!,
          rtype: payload.rtype,
          gtin: +payload.gtin!,
          key: payload.key,
          value: payload.value,
          tail: payload.tail,
          comment: payload.comment,
        }),
      ),
      tap({
        next: () => {
          this.snackbarService.success(NotificationSnackbarLocalization.saved);
          this.router.navigate([AppRoutes.qrCards, payload.qrId, AppRoutes.gs1]).then(() => {
            setState(patch({ isSaveInProgress: false }));
          });
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnSave);
        setState(patch({ isSaveInProgress: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(ResetGs1State)
  public resetGs1State({ setState }: StateContext<Gs1StateModel>): void {
    setState(defaults);
  }
}
