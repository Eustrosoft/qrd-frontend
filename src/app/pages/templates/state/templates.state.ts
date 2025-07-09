import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { DataViewDisplayType } from '@shared/shared.models';
import { catchError, concatMap, from, Observable, switchMap, tap, throwError, timer, toArray } from 'rxjs';
import { patch } from '@ngxs/store/operators';
import { AppRoutes, DEFAULT_ITEMS_PER_PAGE, SKELETON_TIMER } from '@app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FetchFile,
  FetchFileList,
  SetFilesDataViewDisplayType,
  SetSelectedFiles,
} from '@app/pages/files/state/files.actions';
import { Router } from '@angular/router';
import { TemplatesService } from '@app/pages/templates/services/templates.service';
import {
  DeleteTemplates,
  FetchTemplate,
  FetchTemplateList,
  SelectAllTemplates,
  SetSelectedTemplates,
  SetTemplatesDataViewDisplayType,
} from '@app/pages/templates/state/templates.actions';
import { TemplateDto } from '@api/templates/template-api.models';

export interface TemplatesStateModel {
  displayType: DataViewDisplayType;
  isTemplateListLoading: boolean;
  templateListSkeletonLoaders: number;
  templateList: TemplateDto[];
  selectedTemplateList: number[];
  isTemplateLoading: boolean;
  template: TemplateDto | null;
  isDeleteInProgress: boolean;
}

const defaults: TemplatesStateModel = {
  displayType: 'list',
  isTemplateListLoading: false,
  templateListSkeletonLoaders: DEFAULT_ITEMS_PER_PAGE,
  templateList: [],
  selectedTemplateList: [],
  isTemplateLoading: false,
  template: null,
  isDeleteInProgress: false,
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
  public static getTemplate$({ template }: TemplatesStateModel): TemplateDto | null {
    return template;
  }

  @Selector()
  public static getSelectedTemplateList$({ selectedTemplateList }: TemplatesStateModel): number[] {
    return selectedTemplateList;
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
    { id, destroyRef }: FetchFile,
  ): Observable<TemplateDto> {
    setState(patch({ isTemplateLoading: true }));
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
  @Action(DeleteTemplates)
  public deleteTemplates(
    { setState, dispatch }: StateContext<TemplatesStateModel>,
    { idList, destroyRef, refreshList, returnToList }: DeleteTemplates,
  ): Observable<void[]> {
    setState(patch({ isDeleteInProgress: true }));
    return timer(SKELETON_TIMER).pipe(
      switchMap(() => from(idList).pipe(concatMap((id) => this.templatesService.deleteTemplate(id)))),
      toArray(),
      tap({
        next: () => {
          setState(patch({ isDeleteInProgress: false }));
          dispatch(new SetSelectedFiles([]));
          if (refreshList) {
            dispatch(FetchFileList);
          }
          if (returnToList) {
            this.router.navigate(['/', AppRoutes.templates]);
          }
        },
      }),
      takeUntilDestroyed(destroyRef),
      catchError((err) => {
        setState(patch({ isDeleteInProgress: false }));
        dispatch(new SetSelectedFiles([]));
        return throwError(() => err);
      }),
    );
  }
}
