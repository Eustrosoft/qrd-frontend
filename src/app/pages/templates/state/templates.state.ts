import { DestroyRef, inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { catchError, concatMap, EMPTY, from, map, Observable, switchMap, tap, throwError, timer, toArray } from 'rxjs';
import { patch } from '@ngxs/store/operators';
import { AppRoutes, DEFAULT_ITEMS_PER_PAGE, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SetSelectedFiles } from '@app/pages/files/state/files.actions';
import { Router } from '@angular/router';
import { TemplatesService } from '@app/pages/templates/services/templates.service';
import {
  AddFileToTemplate,
  ClearTemplate,
  CreateDefaultTemplate,
  CreateTemplate,
  DeleteTemplates,
  FetchFileList,
  FetchTemplate,
  FetchTemplateList,
  FetchTemplateUsages,
  ResetTemplatesState,
  SaveTemplate,
  SelectAllTemplates,
  SetSelectedTemplates,
  SetTemplateListSearchValue,
} from '@app/pages/templates/state/templates.actions';
import { TemplateDto } from '@api/templates/templates-api.models';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { DeletionDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.constants';
import { FileDto } from '@api/files/files-api.models';
import { FilesService } from '@app/pages/files/services/files.service';
import { SnackbarService } from '@shared/service/snackbar.service';

import { NotificationSnackbarLocalization } from '@modules/error/error.constants';
import { EntityDto } from '@api/api.models';
import { TemplateFormFactoryService } from '@app/pages/templates/services/template-form-factory.service';

export interface TemplatesStateModel {
  searchValue: string;
  isTemplateListLoading: boolean;
  templateListSkeletonLoaders: number;
  templateList: TemplateDto[];
  selectedTemplateList: number[];
  isTemplateLoading: boolean;
  isTemplateLoadErr: boolean;
  template: TemplateDto | null;
  isTemplateUsagesLoading: boolean;
  qrTemplateUsages: EntityDto[] | null;
  isDeleteInProgress: boolean;
  isSaveInProgress: boolean;
  isTemplateFilesLoading: boolean;
  isFileListLoading: boolean;
  isFileListLoadErr: boolean;
  fileList: FileDto[];
}

const defaults: TemplatesStateModel = {
  searchValue: '',
  isTemplateListLoading: false,
  templateListSkeletonLoaders: DEFAULT_ITEMS_PER_PAGE,
  templateList: [],
  selectedTemplateList: [],
  isTemplateLoading: false,
  isTemplateLoadErr: false,
  template: null,
  isTemplateUsagesLoading: false,
  qrTemplateUsages: null,
  isDeleteInProgress: false,
  isSaveInProgress: false,
  isTemplateFilesLoading: false,
  isFileListLoading: false,
  isFileListLoadErr: false,
  fileList: [],
} as const;

const TEMPLATES_STATE_TOKEN: StateToken<TemplatesStateModel> = new StateToken<TemplatesStateModel>('templates');

@State<TemplatesStateModel>({
  name: TEMPLATES_STATE_TOKEN,
  defaults,
})
@Injectable()
export class TemplatesState {
  private readonly router = inject(Router);
  private readonly templatesService = inject(TemplatesService);
  private readonly filesService = inject(FilesService);
  private readonly pxToRemPipe = inject(PxToRemPipe);
  private readonly matDialog = inject(MatDialog);
  private readonly snackbarService = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateFormFactoryService = inject(TemplateFormFactoryService);

  @Selector()
  public static getSearchValue$({ searchValue }: TemplatesStateModel): string {
    return searchValue;
  }

  @Selector()
  public static isTemplateListLoading$({ isTemplateListLoading }: TemplatesStateModel): boolean {
    return isTemplateListLoading;
  }

  @Selector()
  public static getTemplateListSkeletonLoaders$({ templateListSkeletonLoaders }: TemplatesStateModel): number[] {
    return Array.from({ length: templateListSkeletonLoaders }, (_, i) => i);
  }

  @Selector()
  public static getTemplateList$({ templateList, searchValue }: TemplatesStateModel): TemplateDto[] {
    return templateList.filter(
      (template) =>
        template.name.toLowerCase().includes(searchValue) || template.description.toLowerCase().includes(searchValue),
    );
  }

  @Selector()
  public static isTemplateLoading$({ isTemplateLoading }: TemplatesStateModel): boolean {
    return isTemplateLoading;
  }

  @Selector()
  public static isTemplateLoadErr$({ isTemplateLoadErr }: TemplatesStateModel): boolean {
    return isTemplateLoadErr;
  }

  @Selector()
  public static isDeleteInProgress$({ isDeleteInProgress }: TemplatesStateModel): boolean {
    return isDeleteInProgress;
  }

  @Selector()
  public static isSaveInProgress$({ isSaveInProgress }: TemplatesStateModel): boolean {
    return isSaveInProgress;
  }

  @Selector()
  public static isTemplateFilesLoading$({ isTemplateFilesLoading }: TemplatesStateModel): boolean {
    return isTemplateFilesLoading;
  }

  @Selector()
  public static isFileListLoading$({ isFileListLoading }: TemplatesStateModel): boolean {
    return isFileListLoading;
  }

  @Selector()
  public static getTemplate$({ template }: TemplatesStateModel): TemplateDto | null {
    return template;
  }

  @Selector()
  public static getTemplateUsagesState$({
    isTemplateUsagesLoading,
    qrTemplateUsages,
  }: TemplatesStateModel): Pick<TemplatesStateModel, 'isTemplateUsagesLoading' | 'qrTemplateUsages'> {
    return {
      isTemplateUsagesLoading,
      qrTemplateUsages,
    };
  }

  @Selector()
  public static getSelectedTemplateList$({ selectedTemplateList }: TemplatesStateModel): number[] {
    return selectedTemplateList;
  }

  @Selector()
  public static getFilesState$({
    fileList,
    isFileListLoading,
    isFileListLoadErr,
  }: TemplatesStateModel): Pick<TemplatesStateModel, 'fileList' | 'isFileListLoading' | 'isFileListLoadErr'> {
    return { fileList, isFileListLoading, isFileListLoadErr };
  }

  @Action(FetchTemplateList)
  public fetchTemplateList(
    { setState }: StateContext<TemplatesStateModel>,
    { destroyRef }: FetchTemplateList,
  ): Observable<TemplateDto[]> {
    setState(patch({ isTemplateListLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.getTemplateList()),
      tap({
        next: (fileList) => {
          setState(patch({ templateList: fileList, isTemplateListLoading: false }));
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnFetchList);
        setState(patch({ isTemplateListLoading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(SetTemplateListSearchValue)
  public setTemplateListSearchValue(
    { setState }: StateContext<TemplatesStateModel>,
    { searchValue }: SetTemplateListSearchValue,
  ): void {
    setState(patch({ searchValue: searchValue.trim().toLowerCase(), selectedTemplateList: [] }));
  }

  @Action(FetchTemplate)
  public fetchTemplate(
    { setState }: StateContext<TemplatesStateModel>,
    { id, destroyRef, showLoading, loadingStoreProp }: FetchTemplate,
  ): Observable<TemplateDto> {
    if (showLoading) {
      setState(patch({ [loadingStoreProp]: true, isTemplateLoadErr: false }));
    }
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.getTemplate(id)),
      tap({
        next: (template) => {
          setState(patch({ template, [loadingStoreProp]: false }));
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnFetch);
        setState(patch({ [loadingStoreProp]: false, isTemplateLoadErr: true }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(FetchTemplateUsages)
  public fetchTemplateUsages(
    { setState }: StateContext<TemplatesStateModel>,
    { id, destroyRef }: FetchTemplateUsages,
  ): Observable<EntityDto[]> {
    setState(patch({ isTemplateUsagesLoading: true, isTemplateLoadErr: false }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.getTemplateUsages(id)),
      tap({
        next: (qrTemplateUsages) => {
          setState(patch({ qrTemplateUsages, isTemplateUsagesLoading: false }));
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnFetch);
        setState(patch({ isTemplateUsagesLoading: false, isTemplateLoadErr: true }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(ClearTemplate)
  public clearTemplate({ setState }: StateContext<TemplatesStateModel>): void {
    setState(patch({ template: null, isTemplateLoadErr: false, isTemplateLoading: false }));
  }

  @Action(SetSelectedTemplates)
  public setSelectedTemplates(
    { setState }: StateContext<TemplatesStateModel>,
    { selectedTemplateList }: SetSelectedTemplates,
  ): void {
    setState(patch({ selectedTemplateList }));
  }

  @Action(SelectAllTemplates)
  public selectedAllTemplates({ setState, getState }: StateContext<TemplatesStateModel>): void {
    const { templateList } = getState();
    setState(patch({ selectedTemplateList: templateList.map((file) => file.id) }));
  }

  @Action(CreateTemplate)
  public createTemplate(
    { setState }: StateContext<TemplatesStateModel>,
    { payload, destroyRef }: CreateTemplate,
  ): Observable<TemplateDto> {
    setState(patch({ isSaveInProgress: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.createTemplate(payload)),
      tap({
        next: (template) => {
          this.snackbarService.success(NotificationSnackbarLocalization.saved);
          this.router.navigate([AppRoutes.templates, template.id, AppRoutes.edit]).then(() => {
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

  @Action(CreateDefaultTemplate)
  public createDefaultTemplate({ setState, dispatch }: StateContext<TemplatesStateModel>): Observable<unknown> {
    setState(patch({ isTemplateListLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.createDefaultTemplate()),
      tap({
        next: ({ id }) => {
          this.snackbarService.success(NotificationSnackbarLocalization.created);
          dispatch(new FetchTemplateList(this.destroyRef));
          dispatch(new FetchTemplate(id));
          this.router.navigate([AppRoutes.templates, id, AppRoutes.template]);
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnCreate);
        setState(patch({ isTemplateListLoading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(SaveTemplate)
  public saveTemplate(
    { setState }: StateContext<TemplatesStateModel>,
    { id, payload, destroyRef }: SaveTemplate,
  ): Observable<TemplateDto> {
    setState(patch({ isSaveInProgress: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.saveTemplate(id, { ...payload, id })),
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

  @Action(AddFileToTemplate)
  public addFileToTemplate(
    { setState }: StateContext<TemplatesStateModel>,
    { templateId, fileId, destroyRef }: AddFileToTemplate,
  ): Observable<unknown> {
    setState(patch({ isTemplateFilesLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.addFileToTemplate(templateId, { id: fileId })),
      switchMap(() => this.templatesService.getTemplate(templateId).pipe(map((temp) => temp.files))),
      tap({
        next: (files) => {
          this.templateFormFactoryService.patchFiles(files ?? [], false);
          setState(patch({ isTemplateFilesLoading: false }));
        },
      }),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnAddFile);
        setState(patch({ isTemplateFilesLoading: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(FetchFileList)
  public fetchFileList(
    { setState }: StateContext<TemplatesStateModel>,
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

  @Action(DeleteTemplates)
  public deleteTemplates(
    { setState, dispatch }: StateContext<TemplatesStateModel>,
    { idList, destroyRef, refreshList, returnToList }: DeleteTemplates,
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
          concatMap((id) => this.templatesService.deleteTemplate(id)),
          toArray(),
          tap({
            next: () => {
              this.snackbarService.success(NotificationSnackbarLocalization.deleted);
              setState(patch({ isDeleteInProgress: false }));
              dispatch(new SetSelectedTemplates([]));
              if (refreshList) {
                dispatch(FetchTemplateList);
              }
              if (returnToList) {
                this.router.navigate(['/', AppRoutes.templates]);
              }
            },
          }),
        );
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        this.snackbarService.danger(NotificationSnackbarLocalization.errOnDelete);
        setState(patch({ isDeleteInProgress: false }));
        dispatch(new SetSelectedFiles([]));
        return throwError(() => err);
      }),
    );
  }

  @Action(ResetTemplatesState)
  public resetTemplatesState({ setState }: StateContext<TemplatesStateModel>): void {
    setState(defaults);
  }
}
