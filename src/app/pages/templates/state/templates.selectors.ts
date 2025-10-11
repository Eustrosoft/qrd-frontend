import { createPickSelector, createPropertySelectors, createSelector } from '@ngxs/store';
import { TemplatesState, TemplatesStateModel } from '@app/pages/templates/state/templates.state';

export class TemplatesSelectors {
  private static readonly getFullState = createSelector([TemplatesState], (state: TemplatesStateModel) => state);

  public static getSlices = createPropertySelectors<TemplatesStateModel>(TemplatesState);

  public static getTemplateListSkeletonLoaders$ = createSelector(
    [TemplatesSelectors.getSlices.templateListSkeletonLoaders],
    (length) => Array.from({ length }, (_, i) => i),
  );

  public static getTemplateUsagesState$ = createPickSelector(TemplatesSelectors.getFullState, [
    'isTemplateUsagesLoading',
    'qrTemplateUsages',
  ]);

  public static getFilesState$ = createPickSelector(TemplatesSelectors.getFullState, [
    'fileList',
    'isFileListLoading',
    'isFileListLoadErr',
  ]);
}
