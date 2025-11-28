import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import {
  AddFilesToQrCard,
  ClearQrCard,
  CreateQrCard,
  DeleteQrCards,
  FetchGs1LabelList,
  FetchQrCard,
  FetchQrCardList,
  FetchQrRangeList,
  FetchTemplateList,
  ReplaceQrCardFields,
  ResetQrCardsState,
  SaveQrCard,
  SelectAllQrCards,
  SetQrCardListSearchValue,
  SetSelectedQrCards,
  UnbindGs1,
} from './qr-cards.actions';
import { patch } from '@ngxs/store/operators';
import { QRChangeDto, QRDto } from '@api/qr-cards/qrs-api.models';
import { catchError, concatMap, EMPTY, from, map, Observable, switchMap, tap, throwError, timer, toArray } from 'rxjs';
import { QrCardsService } from '@app/pages/qr-cards/services/qr-cards.service';
import { AppRoutes, DEFAULT_ITEMS_PER_PAGE, QR_API_URL, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { TemplatesStateModel } from '@app/pages/templates/state/templates.state';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { DeletionDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.constants';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { SnackbarService } from '@shared/service/snackbar.service';
import { NotificationSnackbarLocalization } from '@modules/error/error.constants';
import { FileDto } from '@api/files/files-api.models';
import { FetchFileList } from '@app/pages/qr-cards/state/qr-cards.actions';
import { FilesService } from '@app/pages/files/services/files.service';
import { TemplateDto } from '@api/templates/templates-api.models';
import { TemplatesService } from '@app/pages/templates/services/templates.service';
import { QRRangeDto } from '@api/ranges/ranges-api.models';
import { QrCardFormFactoryService } from '@app/pages/qr-cards/services/qr-card-form-factory.service';
import { Gs1Dto } from '@api/gs/gs-api.models';
import { Gs1Service } from '@app/pages/gs1/services/gs1.service';
import { FetchGs1List } from '@app/pages/gs1/state/gs1.actions';
import { removeRecordKey, setRecordKey } from '@app/state/app.operators';

export interface QrCardsStateModel {
  searchValue: string;
  isQrCardListLoading: boolean;
  isQrCardListLoadErr: boolean;
  qrCardListSkeletonLoaders: number;
  qrCardList: QRDto[];
  selectedQrCardList: number[];
  isQrCardLoading: boolean;
  isQrCardLoadErr: boolean;
  qrCard: QRDto | null;
  qrCardPreviewUrl: string;
  isGs1LabelListLoading: boolean;
  gs1LabelList: Gs1Dto[];
  gs1DeleteInProgressMap: Record<number, boolean>;
  isDeleteInProgress: boolean;
  isSaveInProgress: boolean;
  isTemplateListLoading: boolean;
  isTemplateListLoadErr: boolean;
  templateList: TemplateDto[];
  isQrCardFilesLoading: boolean;
  isFileListLoading: boolean;
  isFileListLoadErr: boolean;
  fileList: FileDto[];
  isQrRangeListLoading: boolean;
  isQrRangeListLoadErr: boolean;
  qrRangeList: QRRangeDto[];
}

const defaults: QrCardsStateModel = {
  searchValue: '',
  isQrCardListLoading: false,
  isQrCardListLoadErr: false,
  qrCardListSkeletonLoaders: DEFAULT_ITEMS_PER_PAGE,
  qrCardList: [],
  selectedQrCardList: [],
  isQrCardLoading: false,
  isQrCardLoadErr: false,
  qrCard: null,
  qrCardPreviewUrl: '',
  isGs1LabelListLoading: false,
  gs1LabelList: [],
  gs1DeleteInProgressMap: {},
  isDeleteInProgress: false,
  isSaveInProgress: false,
  isTemplateListLoading: false,
  isTemplateListLoadErr: false,
  templateList: [],
  isQrCardFilesLoading: false,
  isFileListLoading: false,
  isFileListLoadErr: false,
  fileList: [],
  isQrRangeListLoading: false,
  isQrRangeListLoadErr: false,
  qrRangeList: [],
} as const;

const QR_CARDS_STATE_TOKEN: StateToken<QrCardsStateModel> = new StateToken<QrCardsStateModel>('qrCards');

@State<QrCardsStateModel>({
  name: QR_CARDS_STATE_TOKEN,
  defaults,
})
@Injectable()
export class QrCardsState {
  private readonly qrCardsService = inject(QrCardsService);
  private readonly templatesService = inject(TemplatesService);
  private readonly filesService = inject(FilesService);
  private readonly gs1Service = inject(Gs1Service);
  private readonly router = inject(Router);
  private readonly toHexPipe = inject(ToHexPipe);
  private readonly pxToRemPipe = inject(PxToRemPipe);
  private readonly matDialog = inject(MatDialog);
  private readonly snackbarService = inject(SnackbarService);
  private readonly qrCardFormFactoryService = inject(QrCardFormFactoryService);

  @Action(FetchQrCardList)
  public fetchQrCardList(
    { setState }: StateContext<QrCardsStateModel>,
    { destroyRef, rangeIds }: FetchQrCardList,
  ): Observable<QRDto[]> {
    setState(patch({ isQrCardListLoading: true, isQrCardListLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.getQrCardList(rangeIds)),
      tap({
        next: (qrCardList) => {
          setState(
            patch({
              qrCardList: qrCardList.map((qrCard) => ({
                ...qrCard,
                qrCardPreviewUrl: `${QR_API_URL}${this.toHexPipe.transform(qrCard.code)}`,
                hexCode: this.toHexPipe.transform(qrCard.code),
              })),
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

  @Action(SetQrCardListSearchValue)
  public searchQrCardList(
    { setState }: StateContext<QrCardsStateModel>,
    { searchValue }: SetQrCardListSearchValue,
  ): void {
    setState(patch({ searchValue: searchValue.trim(), selectedQrCardList: [] }));
  }

  @Action(FetchQrCard)
  public fetchQrCard(
    { setState }: StateContext<QrCardsStateModel>,
    { id, destroyRef, showLoading, storeProp }: FetchQrCard,
  ): Observable<QRDto> {
    if (showLoading) {
      setState(patch({ [storeProp]: true, isQrCardLoadErr: false }));
    }
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.getQrCardById(id)),
      // TODO убрать после фикса form: null в response карточки по id
      switchMap((qrCard) => this.qrCardsService.getQrCard(this.toHexPipe.transform(qrCard.code))),
      tap({
        next: (qrCard) => {
          setState(
            patch({
              qrCard,
              qrCardPreviewUrl: `${QR_API_URL}${this.toHexPipe.transform(qrCard.code)}`,
              [storeProp]: false,
            }),
          );
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnFetch);
        setState(patch({ [storeProp]: false, isQrCardLoadErr: true }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(FetchGs1LabelList)
  public fetchGs1LabelList(
    { setState }: StateContext<QrCardsStateModel>,
    { destroyRef, qrId }: FetchGs1LabelList,
  ): Observable<Gs1Dto[]> {
    setState(patch({ isGs1LabelListLoading: true, isQrCardLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.gs1Service.getGs1List(qrId)),
      tap({
        next: (gs1LabelList) => {
          setState(
            patch({
              gs1LabelList,
              isGs1LabelListLoading: false,
            }),
          );
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        setState(patch({ isGs1LabelListLoading: false, isQrCardLoadErr: true, gs1LabelList: [] }));
        return throwError(() => err);
      }),
    );
  }

  @Action(UnbindGs1)
  public unbindGs1(
    { getState, setState, dispatch }: StateContext<QrCardsStateModel>,
    { id, qrId, destroyRef }: UnbindGs1,
  ): Observable<void> {
    setState(patch({ gs1DeleteInProgressMap: setRecordKey(id, true) }));
    const { gs1DeleteInProgressMap } = getState();

    const matDialogRef = this.matDialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        data: DeletionDialogData,
        width: this.pxToRemPipe.transform('600'),
      },
    );
    return matDialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (!result) {
          setState(patch({ gs1DeleteInProgressMap: removeRecordKey(id) }));
          return EMPTY;
        }
        return this.gs1Service.deleteGs1(id).pipe(
          tap(() => {
            this.snackbarService.success(NotificationSnackbarLocalization.deleted);
            setState(patch({ gs1DeleteInProgressMap: removeRecordKey(id) }));
            dispatch(new FetchGs1List(destroyRef, qrId));
          }),
        );
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnDelete);
        setState(patch({ gs1DeleteInProgressMap: patch({ ...gs1DeleteInProgressMap, [id]: undefined }) }));
        dispatch(new SetSelectedQrCards([]));
        return throwError(() => err);
      }),
    );
  }

  @Action(ClearQrCard)
  public clearQrCard({ setState }: StateContext<QrCardsStateModel>): void {
    setState(patch({ qrCard: null, isQrCardLoadErr: false, isQrCardLoading: false }));
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

  @Action(CreateQrCard)
  public createQrCard(
    { setState }: StateContext<QrCardsStateModel>,
    { payload, destroyRef }: CreateQrCard,
  ): Observable<QRDto> {
    setState(patch({ isSaveInProgress: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() =>
        this.qrCardsService.createQrCard({
          ...payload,
          formId: payload.formId!,
          rangeId: payload.rangeId!,
        }),
      ),
      tap({
        next: (qrCard) => {
          this.snackbarService.success(NotificationSnackbarLocalization.saved);
          this.router.navigate([AppRoutes.qrCards, qrCard.id, AppRoutes.edit]).then(() => {
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

  @Action(SaveQrCard)
  public saveQrCard(
    { setState }: StateContext<QrCardsStateModel>,
    { formValue, destroyRef }: SaveQrCard,
  ): Observable<QRDto> {
    setState(patch({ isSaveInProgress: true }));
    const filesIds = formValue.files?.map((file) => file.id.toString()) ?? [];
    delete formValue.files;
    const payload: Partial<QRChangeDto> = {
      ...formValue,
      filesIds,
    };
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.saveQrCard(payload)),
      tap({
        next: () => {
          this.snackbarService.success(NotificationSnackbarLocalization.saved);
          setState(patch({ isSaveInProgress: false }));
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

  @Action(AddFilesToQrCard)
  public addFileToQrCard(
    { setState }: StateContext<QrCardsStateModel>,
    { qrCardId, qrCardCode, fileIdList, destroyRef }: AddFilesToQrCard,
  ): Observable<unknown> {
    setState(patch({ isQrCardFilesLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() =>
        from(fileIdList).pipe(
          concatMap((fileId) => this.qrCardsService.addFileToQrCard(qrCardId, { id: fileId })),
          toArray(),
        ),
      ),
      switchMap(() => this.qrCardsService.getQrCard(qrCardCode).pipe(map((qrCard) => qrCard.files))),
      tap({
        next: (files) => {
          this.qrCardFormFactoryService.patchFiles(files ?? [], false);
          setState(patch({ isQrCardFilesLoading: false }));
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnAddFile);
        setState(patch({ isQrCardFilesLoading: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(ReplaceQrCardFields)
  public replaceQrCardFields(
    { setState, dispatch }: StateContext<QrCardsStateModel>,
    { formValue, destroyRef }: ReplaceQrCardFields,
  ): Observable<void> {
    setState(patch({ isQrCardLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      concatMap(() => dispatch(new SaveQrCard(formValue, destroyRef))),
      concatMap(() => dispatch(new FetchQrCard(formValue.id!, formValue.code?.toString()!, destroyRef))),
      tap({
        next: () => {
          setState(patch({ isQrCardLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isQrCardLoading: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(FetchTemplateList)
  public fetchTemplateList(
    { setState }: StateContext<QrCardsStateModel>,
    { destroyRef }: FetchTemplateList,
  ): Observable<TemplateDto[]> {
    setState(patch({ isTemplateListLoading: true, isTemplateListLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.getTemplateList()),
      tap({
        next: (templateList) => {
          setState(patch({ templateList, isTemplateListLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isTemplateListLoading: false, isTemplateListLoadErr: true }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(FetchQrRangeList)
  public fetchQrRangeList(
    { setState }: StateContext<QrCardsStateModel>,
    { destroyRef }: FetchQrRangeList,
  ): Observable<QRRangeDto[]> {
    setState(patch({ isQrRangeListLoading: true, isQrRangeListLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.getQrRangeList()),
      tap({
        next: (qrRangeList) => {
          setState(patch({ qrRangeList, isQrRangeListLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isQrRangeListLoading: false, isQrRangeListLoadErr: true }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(FetchFileList)
  public fetchFileList(
    { setState }: StateContext<QrCardsStateModel>,
    { destroyRef }: FetchFileList,
  ): Observable<FileDto[]> {
    setState(patch({ isFileListLoading: true, isFileListLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.filesService.getFileList()),
      tap({
        next: (fileList) => {
          setState(patch({ fileList, isFileListLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isFileListLoading: false, isFileListLoadErr: true }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
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
        data: DeletionDialogData,
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
              this.snackbarService.success(NotificationSnackbarLocalization.deleted);
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
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnDelete);
        setState(patch({ isDeleteInProgress: false }));
        dispatch(new SetSelectedQrCards([]));
        return throwError(() => err);
      }),
    );
  }

  @Action(ResetQrCardsState)
  public resetQrCardsState({ setState }: StateContext<QrCardsStateModel>): void {
    setState(defaults);
  }
}
