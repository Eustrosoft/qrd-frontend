import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { DataViewDisplayType } from '@shared/shared.models';
import { catchError, concatMap, EMPTY, from, Observable, of, switchMap, tap, throwError, timer, toArray } from 'rxjs';
import { patch } from '@ngxs/store/operators';
import { AppRoutes, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SetFilesDataViewDisplayType, SetSelectedFiles } from '@app/pages/files/state/files.actions';
import { Router } from '@angular/router';
import { TemplatesService } from '@app/pages/templates/services/templates.service';
import {
  AddFileToTemplate,
  CreateTemplate,
  DeleteTemplates,
  FetchFileList,
  FetchTemplate,
  FetchTemplateList,
  ResetTemplatesState,
  SaveTemplate,
  SelectAllTemplates,
  SetSelectedTemplates,
  SetTemplatesDataViewDisplayType,
} from '@app/pages/templates/state/templates.actions';
import { TemplateDto } from '@api/templates/template-api.models';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { DELETION_DIALOG_DATA } from '@shared/components/confirmation-dialog/confirmation-dialog.constants';
import { FileDto } from '@api/files/file-api.models';
import { FilesService } from '@app/pages/files/services/files.service';
import { DEFAULT_TEMPLATE_STATE } from '@app/pages/templates/templates.constants';

export interface TemplatesStateModel {
  displayType: DataViewDisplayType;
  isTemplateListLoading: boolean;
  templateListSkeletonLoaders: number;
  templateList: TemplateDto[];
  selectedTemplateList: number[];
  isTemplateLoading: boolean;
  template: TemplateDto | null;
  isDeleteInProgress: boolean;
  isSaveInProgress: boolean;
  isFileBeingAdded: boolean;
  isFileListLoading: boolean;
  fileList: FileDto[];
}

const TEMPLATES_STATE_TOKEN: StateToken<TemplatesStateModel> = new StateToken<TemplatesStateModel>('templates');

@State<TemplatesStateModel>({
  name: TEMPLATES_STATE_TOKEN,
  defaults: DEFAULT_TEMPLATE_STATE,
})
@Injectable()
export class TemplatesState {
  private readonly router = inject(Router);
  private readonly templatesService = inject(TemplatesService);
  private readonly filesService = inject(FilesService);
  private readonly pxToRemPipe = inject(PxToRemPipe);
  private readonly matDialog = inject(MatDialog);

  @Selector()
  public static getDisplayType$({ displayType }: TemplatesStateModel): DataViewDisplayType {
    return displayType;
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
  public static getTemplateList$({ templateList }: TemplatesStateModel): TemplateDto[] {
    return templateList;
  }

  @Selector()
  public static isTemplateLoading$({ isTemplateLoading }: TemplatesStateModel): boolean {
    return isTemplateLoading;
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
  public static isFileBeingAdded$({ isFileBeingAdded }: TemplatesStateModel): boolean {
    return isFileBeingAdded;
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
  public static getSelectedTemplateList$({ selectedTemplateList }: TemplatesStateModel): number[] {
    return selectedTemplateList;
  }

  @Selector()
  public static getFileList$({ fileList }: TemplatesStateModel): FileDto[] {
    return fileList;
  }

  @Action(FetchTemplateList)
  public fetchTemplateList({ setState }: StateContext<TemplatesStateModel>): Observable<TemplateDto[]> {
    setState(patch({ isTemplateListLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.getTemplateList()),
      tap({
        next: (fileList) => {
          setState(patch({ templateList: fileList, isTemplateListLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isTemplateListLoading: false }));
        return throwError(() => err);
      }),
    );
  }

  @Action(FetchTemplate)
  public fetchTemplate(
    { setState }: StateContext<TemplatesStateModel>,
    { id, destroyRef, showLoading }: FetchTemplate,
  ): Observable<TemplateDto> {
    if (showLoading) {
      setState(patch({ isTemplateLoading: true }));
    }
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.getTemplate(id)),
      tap({
        next: (file) => {
          setState(patch({ template: file, isTemplateLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isTemplateLoading: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
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

  @Action(SetTemplatesDataViewDisplayType)
  public setDisplayType(
    { setState }: StateContext<TemplatesStateModel>,
    { displayType }: SetFilesDataViewDisplayType,
  ): void {
    setState(patch({ displayType }));
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
          this.router.navigate([AppRoutes.templates, template.id, AppRoutes.edit]).then(() => {
            setState(patch({ isSaveInProgress: false }));
          });
        },
      }),
      catchError((err) => {
        setState(patch({ isSaveInProgress: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
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
          setState(patch({ isSaveInProgress: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isSaveInProgress: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(AddFileToTemplate)
  public addFileToTemplate(
    { setState, dispatch }: StateContext<TemplatesStateModel>,
    { templateId, fileId, destroyRef }: AddFileToTemplate,
  ): Observable<void> {
    setState(patch({ isFileBeingAdded: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.templatesService.addFileToTemplate(templateId, { id: fileId })),
      switchMap(() => dispatch(new FetchTemplate(templateId, destroyRef, false))),
      tap({
        next: () => {
          setState(patch({ isFileBeingAdded: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isFileBeingAdded: false }));
        return throwError(() => err);
      }),
      takeUntilDestroyed(destroyRef),
    );
  }

  @Action(FetchFileList)
  public fetchFileList(
    { getState, setState }: StateContext<TemplatesStateModel>,
    { destroyRef }: FetchFileList,
  ): Observable<FileDto[]> {
    const { fileList } = getState();
    if (fileList.length) {
      return of(fileList);
    }

    setState(patch({ isFileListLoading: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => this.filesService.getFileList()),
      tap({
        next: (fileList) => {
          setState(patch({ fileList, isFileListLoading: false }));
        },
      }),
      catchError((err) => {
        setState(patch({ isFileListLoading: false }));
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
          concatMap((id) => this.templatesService.deleteTemplate(id)),
          toArray(),
          tap({
            next: () => {
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
        setState(patch({ isDeleteInProgress: false }));
        dispatch(new SetSelectedFiles([]));
        return throwError(() => err);
      }),
    );
  }

  @Action(ResetTemplatesState)
  public resetTemplatesState({ setState }: StateContext<TemplatesStateModel>): void {
    setState(DEFAULT_TEMPLATE_STATE);
  }
}
