import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import {
  AddFileToQrCard,
  ClearQrCard,
  CreateQrCard,
  DeleteQrCards,
  FetchQrCard,
  FetchQrCardList,
  FetchQrRangeList,
  FetchTemplateList,
  ResetQrCardsState,
  SaveQrCard,
  SelectAllQrCards,
  SetQrCardListSearchValue,
  SetQrCardsDataViewDisplayType,
  SetSelectedQrCards,
} from './qr-cards.actions';
import { DataViewDisplayType } from '@shared/shared.models';
import { patch } from '@ngxs/store/operators';
import { QRChangeDto, QRDto } from '@api/qr-cards/qrs-api.models';
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

export interface QrCardsStateModel {
  displayType: DataViewDisplayType;
  searchValue: string;
  isQrCardListLoading: boolean;
  qrCardListSkeletonLoaders: number;
  qrCardList: QRDto[];
  selectedQrCardList: number[];
  isQrCardLoading: boolean;
  qrCardLoadErr: boolean;
  qrCard: QRDto | null;
  qrCardPreviewUrl: string;
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
  displayType: 'list',
  searchValue: '',
  isQrCardListLoading: false,
  qrCardListSkeletonLoaders: DEFAULT_ITEMS_PER_PAGE,
  qrCardList: [],
  selectedQrCardList: [],
  isQrCardLoading: false,
  qrCardLoadErr: false,
  qrCard: null,
  qrCardPreviewUrl: '',
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
  private readonly router = inject(Router);
  private readonly toHexPipe = inject(ToHexPipe);
  private readonly pxToRemPipe = inject(PxToRemPipe);
  private readonly matDialog = inject(MatDialog);
  private readonly snackbarService = inject(SnackbarService);

  @Selector()
  public static getDisplayType$({ displayType }: QrCardsStateModel): DataViewDisplayType {
    return displayType;
  }

  @Selector()
  public static getSearchValue$({ searchValue }: QrCardsStateModel): string {
    return searchValue;
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
  public static getQrCardList$({ qrCardList, searchValue }: QrCardsStateModel): QRDto[] {
    return qrCardList.filter(
      (qrCard) =>
        qrCard.name.toLowerCase().includes(searchValue) ||
        qrCard.description.toLowerCase().includes(searchValue) ||
        qrCard.code.toString().includes(searchValue),
    );
  }

  @Selector()
  public static isQrCardLoading$({ isQrCardLoading }: QrCardsStateModel): boolean {
    return isQrCardLoading;
  }

  @Selector()
  public static qrCardLoadErr$({ qrCardLoadErr }: QrCardsStateModel): boolean {
    return qrCardLoadErr;
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

  @Selector()
  public static isSaveInProgress$({ isSaveInProgress }: QrCardsStateModel): boolean {
    return isSaveInProgress;
  }

  @Selector()
  public static getTemplatesState$({
    templateList,
    isTemplateListLoading,
    isTemplateListLoadErr,
  }: QrCardsStateModel): Pick<QrCardsStateModel, 'templateList' | 'isTemplateListLoading' | 'isTemplateListLoadErr'> {
    return { templateList, isTemplateListLoading, isTemplateListLoadErr };
  }

  @Selector()
  public static getQrRangesState$({
    qrRangeList,
    isQrRangeListLoading,
    isQrRangeListLoadErr,
  }: QrCardsStateModel): Pick<QrCardsStateModel, 'qrRangeList' | 'isQrRangeListLoading' | 'isQrRangeListLoadErr'> {
    return { qrRangeList, isQrRangeListLoading, isQrRangeListLoadErr };
  }

  @Selector()
  public static isQrCardFilesLoading$({ isQrCardFilesLoading }: QrCardsStateModel): boolean {
    return isQrCardFilesLoading;
  }

  @Selector()
  public static getFilesState$({
    fileList,
    isFileListLoading,
    isFileListLoadErr,
  }: QrCardsStateModel): Pick<QrCardsStateModel, 'fileList' | 'isFileListLoading' | 'isFileListLoadErr'> {
    return { fileList, isFileListLoading, isFileListLoadErr };
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
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnFetchList);
        setState(patch({ isQrCardListLoading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(SetQrCardListSearchValue)
  public searchQrCardList(
    { setState }: StateContext<QrCardsStateModel>,
    { searchValue }: SetQrCardListSearchValue,
  ): void {
    setState(patch({ searchValue: searchValue.trim().toLowerCase(), selectedQrCardList: [] }));
  }

  @Action(FetchQrCard)
  public fetchQrCard(
    { setState }: StateContext<QrCardsStateModel>,
    { code, destroyRef, showLoading, storeProp }: FetchQrCard,
  ): Observable<QRDto> {
    if (showLoading) {
      setState(patch({ [storeProp]: true, qrCardLoadErr: false }));
    }
    const qrHexCode = this.toHexPipe.transform(code);
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.getQrCard(qrHexCode)),
      tap({
        next: (qrCard) => {
          setState(
            patch({
              qrCard,
              qrCardPreviewUrl: `${QR_API_URL}${qrHexCode}`,
              [storeProp]: false,
            }),
          );
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnFetch);
        setState(patch({ [storeProp]: false, qrCardLoadErr: true }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(ClearQrCard)
  public clearQrCard({ setState }: StateContext<QrCardsStateModel>): void {
    setState(patch({ qrCard: null, qrCardLoadErr: false, isQrCardLoading: false }));
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
          this.router.navigate([AppRoutes.qrCards, qrCard.code, AppRoutes.edit]).then(() => {
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

  @Action(AddFileToQrCard)
  public addFileToTemplate(
    { setState, dispatch }: StateContext<QrCardsStateModel>,
    { qrCardId, qrCardCode, fileId, destroyRef }: AddFileToQrCard,
  ): Observable<void> {
    setState(patch({ isQrCardFilesLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.qrCardsService.addFileToQrCard(qrCardId, { id: fileId })),
      switchMap(() => dispatch(new FetchQrCard(qrCardCode, destroyRef, false))),
      tap({
        next: () => {
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
